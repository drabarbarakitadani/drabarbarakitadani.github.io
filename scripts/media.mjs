// Gera derivados otimizados da mídia aprovada. Originais em docs/midia permanecem intocados.
// Uso: node scripts/media.mjs   (requer ffmpeg; caminho configurável por FFMPEG_DIR)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import path from 'node:path';

const ffdir = process.env.FFMPEG_DIR || path.join(process.env.LOCALAPPDATA || '', 'Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin');
const ffmpeg = existsSync(path.join(ffdir, 'ffmpeg.exe')) ? path.join(ffdir, 'ffmpeg.exe') : 'ffmpeg';
const src = 'docs/midia';
const out = 'public/media';
mkdirSync(out, { recursive: true });

function run(args) { execFileSync(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', '-map_metadata', '-1', ...args], { stdio: 'inherit' }); }
function mb(file) { return (statSync(file).size / 1048576).toFixed(2) + ' MB'; }

// Vídeo: H.264 1080x1920, ~3 Mbps máximo, áudio AAC 96k, faststart para streaming progressivo.
run(['-i', `${src}/video-conceito.MP4`, '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-maxrate', '3000k', '-bufsize', '6000k',
  '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.0', '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '96k', '-ac', '2', `${out}/video-conceito.mp4`]);
// Poster: quadro aos 12s (Dra. sorrindo à mesa), JPEG de qualidade alta.
run(['-ss', '12', '-i', `${src}/video-conceito.MP4`, '-frames:v', '1', '-q:v', '3', `${out}/video-poster.jpg`]);
// Fotos: JPEG + WebP em duas larguras, preservando proporção.
for (const [name, ext, widths] of [['foto-sorrindo-1', 'png', [1080, 720]], ['foto-sorrindo-2', 'jpg', [777, 540]]]) {
  for (const w of widths) {
    run(['-i', `${src}/${name}.${ext}`, '-vf', `scale=${w}:-2`, '-q:v', '3', `${out}/${name}-${w}.jpg`]);
    run(['-i', `${src}/${name}.${ext}`, '-vf', `scale=${w}:-2`, '-c:v', 'libwebp', '-quality', '82', `${out}/${name}-${w}.webp`]);
  }
}
for (const f of ['video-conceito.mp4', 'video-poster.jpg', 'foto-sorrindo-1-1080.jpg', 'foto-sorrindo-1-1080.webp', 'foto-sorrindo-2-777.jpg', 'foto-sorrindo-2-777.webp']) console.log(f.padEnd(28), mb(`${out}/${f}`));
