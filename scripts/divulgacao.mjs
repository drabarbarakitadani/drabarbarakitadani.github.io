// Gera material de divulgação do site para o Instagram: carrossel (6 cards 1080x1350), vídeo de Story (1080x1920) e legenda.
// Uso: node scripts/divulgacao.mjs [pasta-de-saida]   (padrão: divulgacao/<AAAA-MM-DD>-lancamento). Requer Google Chrome e ffmpeg.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const site = JSON.parse(readFileSync('content/site.json', 'utf8'));
const procedimentos = JSON.parse(readFileSync('content/procedimentos.json', 'utf8'));
const out = process.argv[2] || `divulgacao/${new Date().toISOString().slice(0, 10)}-lancamento`;
mkdirSync(out, { recursive: true });
const url = site.url;
const dominio = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

const b64 = (file, type) => `data:${type};base64,${readFileSync(file).toString('base64')}`;
const fonts = [400, 500, 600].map(w => `@font-face{font-family:M;font-weight:${w};src:url(${b64(`src/fonts/montserrat-latin-${w}.woff2`, 'font/woff2')}) format("woff2")}`).join('');
const mono = readFileSync('docs/visual-identity/monogram-bk.svg', 'utf8').replace(/<\?xml[^>]*>/, '').replace(/<title[\s\S]*?<\/desc>/, '');
const foto2 = b64('public/media/foto-sorrindo-2-777.jpg', 'image/jpeg');
const foto1 = b64('public/media/foto-sorrindo-1-1080.jpg', 'image/jpeg');
const icone = id => { const p = procedimentos.find(x => x.id === id); return `<svg viewBox="0 0 120 120" fill="none" stroke="#1F2711" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="${p.icone}"/></svg>`; };

const css = `${fonts}
*{box-sizing:border-box}body{margin:0;width:1080px;height:1350px;background:#F7F6F2;color:#292824;font-family:M,Arial,sans-serif;font-weight:400;position:relative;overflow:hidden}
.areia{background:#E8E1D8}.pad{padding:104px 96px}
.eyebrow{font-size:22px;font-weight:500;letter-spacing:.17em;color:#1F2711;margin:0 0 36px}
h1{font-size:118px;line-height:1.04;letter-spacing:-.05em;margin:0;font-weight:400}h2{font-size:64px;line-height:1.15;letter-spacing:-.035em;margin:0;font-weight:400}
em{font-style:normal;color:#708D3E}.muted{color:#716D64}
.rodape{position:absolute;left:96px;right:96px;bottom:72px;display:flex;justify-content:space-between;align-items:center;font-size:22px;letter-spacing:.06em;color:#716D64}
.rodape svg{width:64px;height:auto}
.botao{display:inline-flex;align-items:center;justify-content:space-between;gap:80px;border:2px solid #1F2711;border-radius:8px;color:#1F2711;padding:30px 44px;font-size:30px;font-weight:500}
.arco{width:100%;height:760px;overflow:hidden;border-radius:46% 46% 8px 8px;background:#E8E1D8}.arco img{width:100%;height:100%;object-fit:cover;object-position:50% 40%}
.phone{position:absolute;left:50%;top:300px;transform:translateX(-50%);width:560px;height:880px;border-radius:72px;background:#1b1b1b;padding:18px;box-shadow:0 40px 80px rgba(41,40,36,.18)}
.phone .tela{width:100%;height:100%;border-radius:56px;overflow:hidden;background:#F7F6F2}.phone img{width:100%;display:block}
.icones{display:flex;justify-content:space-between;margin:140px 0 120px}.icones div{width:272px;text-align:center}.icones svg{width:200px;height:200px;display:block;margin:0 auto 20px}.icones span{font-size:22px;letter-spacing:.17em;font-weight:500;color:#1F2711}`;

const rodape = `<div class="rodape"><span>@${site.instagram.usuario}</span>${mono}</div>`;
const cards = [
  `<body><div class="pad"><div style="width:220px;margin-bottom:120px">${mono}</div><p class="eyebrow">NOSSO SITE CHEGOU</p><h1 style="font-size:100px">Agora ficou mais fácil de agendar sua <em>consulta.</em></h1><p class="muted" style="font-size:32px;line-height:1.5;margin:64px 0 0;max-width:820px">Clique no link para conhecer mais e agendar sua avaliação.</p></div>${rodape}</body>`,
  `<body><div class="pad"><div style="width:220px;margin-bottom:120px">${mono}</div><p class="eyebrow">UM JEITO DE CUIDAR</p><h1>Cuidado que<br>começa na<br><em>escuta.</em></h1><p class="muted" style="font-size:30px;line-height:1.5;margin:64px 0 0">Sua história, sua beleza.<br>Um cuidado pensado para você.</p></div>${rodape}</body>`,
  `<body><div class="pad" style="padding-top:88px"><div class="arco"><img src="${foto2}"></div><p class="eyebrow" style="margin-top:72px">UM ESPAÇO PARA VOCÊ</p><h2>Conheça o cuidado da Dra. Barbara antes mesmo da <em>primeira conversa.</em></h2></div>${rodape}</body>`,
  `<body class="areia"><div class="pad" style="text-align:center"><p class="eyebrow">CONHEÇA O SITE</p><h2 style="font-size:56px">${dominio}</h2></div><div class="phone"><div class="tela"><img src="__SITE__"></div></div>${rodape}</body>`,
  `<body><div class="pad"><p class="eyebrow">PELE · FACE · SORRISO</p><h2>18 possibilidades de cuidado para explorar <em>com calma.</em></h2><div class="icones"><div>${icone('bioestimulador')}<span>PELE</span></div><div>${icone('labial')}<span>FACE</span></div><div>${icone('clareamento')}<span>SORRISO</span></div></div><p class="muted" style="font-size:30px;line-height:1.5;margin:0;max-width:760px">Cada possibilidade explicada em poucas linhas. A indicação sempre começa com uma avaliação individual.</p></div>${rodape}</body>`,
  `<body class="areia"><div class="pad"><div class="arco" style="height:560px;border-radius:8px"><img src="${foto1}" style="object-position:50% 45%"></div><p class="eyebrow" style="margin-top:72px">O PRÓXIMO PASSO É UMA CONVERSA</p><h1 style="font-size:104px">O link está<br>na <em>bio.</em></h1><div style="margin-top:56px" class="botao">${site.contato.botao} <span>↗</span></div></div>${rodape}</body>`
];

const channel = process.env.PW_CHANNEL === 'chromium' ? undefined : (process.env.PW_CHANNEL || 'chrome');
const browser = await chromium.launch({ channel, headless: true });

// Captura real do site publicado para o mockup de celular.
const celular = await browser.newPage({ viewport: { width: 390, height: 790 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
await celular.goto(url, { waitUntil: 'networkidle' });
await celular.evaluate(() => document.fonts.ready);
const shot = await celular.screenshot({ type: 'png' });
await celular.close();

const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
for (const [i, body] of cards.entries()) {
  await page.setContent(`<style>${css}</style>${body.replace('__SITE__', 'data:image/png;base64,' + shot.toString('base64'))}`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(out, `carrossel-${i + 1}.png`) });
}
await page.close();

// Story: gravação real do site rolando em proporção 9:16.
const tmp = path.join(out, '_video');
const ctx = await browser.newContext({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, recordVideo: { dir: tmp, size: { width: 1080, height: 1920 } } });
const story = await ctx.newPage();
await story.goto(url, { waitUntil: 'networkidle' });
await story.waitForTimeout(2200);
await story.evaluate(() => new Promise(done => {
  const total = document.documentElement.scrollHeight - innerHeight, dur = 11000, t0 = performance.now();
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  (function frame(now) { const t = Math.min(1, (now - t0) / dur); scrollTo(0, total * ease(t)); if (t < 1) requestAnimationFrame(frame); else done(); })(t0);
}));
await story.waitForTimeout(1800);
await ctx.close();
await browser.close();
const webm = readdirSync(tmp).find(f => f.endsWith('.webm'));
const ffdir = process.env.FFMPEG_DIR || path.join(process.env.LOCALAPPDATA || '', 'Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.1-full_build/bin');
const ffmpeg = existsSync(path.join(ffdir, 'ffmpeg.exe')) ? path.join(ffdir, 'ffmpeg.exe') : 'ffmpeg';
execFileSync(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', '-ss', '0.6', '-i', path.join(tmp, webm), '-map_metadata', '-1', '-vf', 'scale=1080:1920:flags=lanczos,fps=30', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', path.join(out, 'story-site.mp4')]);
rmSync(tmp, { recursive: true, force: true });

writeFileSync(path.join(out, 'legenda.txt'), `Um lugar para você me conhecer com calma. 🌿

Criei um site para contar como penso o cuidado: começa na escuta, respeita a sua identidade e olha para você por inteiro. Pele, face e sorriso, explicados sem pressa.

O link está na bio. Quando quiser conversar, o WhatsApp está a um toque.

#esteticafacial #odontologia #ibiuna #harmonizacaofacial #cuidadocomapele

---
Story: publicar story-site.mp4 com a figurinha de link apontando para ${url} e o texto "Toque para conhecer". Fixar nos destaques como "Site".
Lembrete: incluir o CRO/UF da Dra. na legenda conforme o Código de Ética Odontológica.
`);
console.log(`Gerado em ${out}/: ${readdirSync(out).join(', ')}`);
