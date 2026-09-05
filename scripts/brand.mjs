// Gera favicon, ícone iOS e imagem de compartilhamento (WhatsApp/Instagram) a partir do monograma e da identidade.
// Uso: node scripts/brand.mjs   (usa o Chrome instalado via Playwright; PW_CHANNEL=chromium na CI)
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';

const site = JSON.parse(readFileSync('content/site.json', 'utf8'));
const mono = readFileSync('docs/visual-identity/monogram-bk.svg', 'utf8').replace(/<\?xml[^>]*>/, '');
const font = readFileSync('src/fonts/montserrat-latin-400.woff2').toString('base64');
const fontCss = `@font-face{font-family:M;src:url(data:font/woff2;base64,${font}) format("woff2")}`;

// Favicon SVG: monograma em verde profundo sobre porcelana, com margem, para leitura em tamanho pequeno.
const inner = mono.replace(/<svg[^>]*>/, '').replace('</svg>', '').replace(/fill="#9D948A"/g, 'fill="#1F2711"').replace(/<title[\s\S]*?<\/desc>/, '');
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" rx="80" fill="#F7F6F2"/><g transform="translate(38 48)">${inner}</g></svg>`;
writeFileSync('public/favicon.svg', favicon);

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL === 'chromium' ? undefined : (process.env.PW_CHANNEL || 'chrome'), headless: true });
const page = await browser.newPage({ viewport: { width: 180, height: 180 } });
await page.setContent(`<body style="margin:0">${favicon.replace('<svg ', '<svg width="180" height="180" ')}</body>`);
await page.screenshot({ path: 'public/apple-touch-icon.png', omitBackground: true });

await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(`<style>${fontCss}body{margin:0;width:1200px;height:630px;background:#F7F6F2;color:#292824;font-family:M,Arial,sans-serif;display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:0 96px;box-sizing:border-box}
h1{font-weight:400;font-size:72px;line-height:1.05;letter-spacing:-.04em;margin:0 0 28px}em{font-style:normal;color:#708D3E}.l{font-size:15px;letter-spacing:.17em;color:#1F2711;margin:0 0 28px}.s{font-size:20px;color:#716D64;margin:0}.m{justify-self:end;width:300px}.m svg{width:300px;height:auto;display:block}</style>
<body><div><p class="l">${site.inicio.rotulo}</p><h1>Cuidado que<br>começa na <em>escuta.</em></h1><p class="s">${site.nomeCompleto} · ${site.endereco[1]}</p></div><div class="m">${mono}</div></body>`);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og.jpg', type: 'jpeg', quality: 88 });
await browser.close();
console.log('favicon.svg, apple-touch-icon.png e og.jpg gerados em public/');
