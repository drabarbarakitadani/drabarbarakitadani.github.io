// Testa a versão de produção (dist/) em navegador: celular, desktop, teclado, redução de movimento e sem JavaScript.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';
import { loadContent, whatsappUrl } from '../scripts/render.mjs';

const channel = process.env.PW_CHANNEL === 'chromium' ? undefined : (process.env.PW_CHANNEL || 'chrome');
const site = loadContent().site;

test('dist: celular, desktop, movimento reduzido e sem JavaScript', async () => {
  const server = spawn(process.execPath, ['server.cjs'], { windowsHide: true, env: { ...process.env, PORT: '0', ROOT: 'dist' } });
  let browser;
  try {
    const base = await new Promise((resolve, reject) => {
      server.stdout.once('data', data => resolve(String(data).match(/http:\/\/127\.0\.0\.1:\d+/)[0]));
      server.once('error', reject);
      server.once('exit', code => reject(new Error('Servidor encerrou: ' + code)));
    });
    browser = await chromium.launch({ channel, headless: true });
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const errors = [], failed = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); });
    await page.goto(base + '/', { waitUntil: 'load' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'sem overflow horizontal');
    assert.equal(await page.evaluate(() => document.fonts.ready.then(() => document.fonts.check('16px Montserrat'))), true, 'Montserrat local carregada');
    assert.equal(await page.locator('link[rel="icon"]').count(), 1);
    assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'), new URL('og.jpg', site.url).href);
    assert.equal(await page.locator('.modulo').count(), 0, 'nenhum módulo de exemplo ativo');

    const video = page.locator('video');
    assert.equal(await video.getAttribute('preload'), 'none');
    assert.equal(await video.evaluate(el => el.paused && el.muted), true);
    const videoUrl = new URL(await page.locator('video source').getAttribute('src'), base + '/').href;
    const head = await page.request.head(videoUrl);
    assert.equal(head.status(), 200);
    assert.ok(Number(head.headers()['content-length']) < 25 * 1024 * 1024, 'vídeo abaixo de 25 MiB');
    // Navegadores sem H.264 (Chromium de código aberto) não reproduzem o MP4; nesse caso só o estado inicial é verificado.
    const reproduz = await video.evaluate(el => el.canPlayType('video/mp4; codecs="avc1.640028, mp4a.40.2"') !== '');
    if (!reproduz) console.log('Aviso: navegador sem suporte a H.264; verificações de reprodução do vídeo ignoradas.');
    if (reproduz) {
    await video.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
    await page.waitForFunction(() => { const v = document.querySelector('video'); return !v.paused && v.currentTime > 0; }, null, { timeout: 20000 });
    await video.evaluate(el => el.pause());
    await page.waitForTimeout(150);
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(150);
    await video.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
    await page.waitForTimeout(250);
    assert.equal(await video.evaluate(el => el.paused), true, 'pausa manual persiste ao voltar');
    await video.evaluate(el => el.play());
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForFunction(() => document.querySelector('video').paused);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await video.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'center' }));
    await page.waitForTimeout(250);
    assert.equal(await video.evaluate(el => el.paused), true, 'movimento reduzido desliga autoplay');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForFunction(() => !document.querySelector('video').paused);
    }

    const toggle = page.locator('.card-toggle').first();
    assert.equal(await toggle.textContent(), '');
    assert.equal(await page.locator('[data-card]:visible').count(), 3);
    await page.locator('.all-care summary').tap();
    assert.equal(await page.locator('[data-card]:visible').count(), 18);
    const ids = await page.locator('[data-card]').evaluateAll(els => els.map(el => el.dataset.procedure));
    assert.equal(new Set(ids).size, 18);
    const lastToggle = page.locator('.card-toggle').last();
    await lastToggle.tap();
    assert.equal(await lastToggle.getAttribute('aria-expanded'), 'true');
    await page.locator('.all-care summary').tap();
    assert.equal(await page.locator('[data-card]:visible').count(), 3);
    await toggle.tap();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    await page.waitForTimeout(850);
    assert.equal(await page.locator('.card-rotor').first().evaluate(el => Math.round(new DOMMatrix(getComputedStyle(el).transform).m11)), -1);
    assert.equal(await page.locator('.card-back').first().getAttribute('aria-hidden'), 'false');
    await toggle.tap();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');

    const contactUrl = new URL(await page.locator('#schedule').getAttribute('href'));
    assert.equal(contactUrl.href, whatsappUrl(site));
    assert.equal(contactUrl.searchParams.get('text'), site.whatsapp.mensagem);
    assert.equal(await page.locator('.instagram-link').getAttribute('href'), site.instagram.url);
    assert.match(await page.locator('address').textContent(), /Rua Dr\. Gabriel Monteiro da Silva, 666.*Ibiúna, SP/);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await toggle.focus();
    await page.keyboard.press('Enter');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    assert.equal(await page.locator('.card-rotor').first().evaluate(el => getComputedStyle(el).transform), 'none');
    await page.keyboard.press('Escape');
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    await fs.mkdir('.artifacts', { recursive: true });
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: '.artifacts/mobile.png', fullPage: true });

    const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await desktop.goto(base + '/');
    await desktop.locator('[data-card]').first().hover();
    assert.equal(await desktop.locator('.card-toggle').first().getAttribute('aria-expanded'), 'true');
    await desktop.waitForTimeout(850);
    assert.equal(await desktop.locator('.card-rotor').first().evaluate(el => Math.round(new DOMMatrix(getComputedStyle(el).transform).m11)), -1);
    await desktop.locator('#cuidados h2').hover();
    assert.equal(await desktop.locator('.card-toggle').first().getAttribute('aria-expanded'), 'false');
    await desktop.emulateMedia({ reducedMotion: 'reduce' });
    await desktop.evaluate(() => scrollTo(0, 0));
    await desktop.screenshot({ path: '.artifacts/desktop.png', fullPage: true });

    const plain = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    await plain.goto(base + '/');
    assert.equal(await plain.locator('#schedule').getAttribute('href'), contactUrl.href);
    await plain.locator('.all-care summary').click();
    assert.equal(await plain.locator('[data-card]:visible').count(), 18);
    assert.equal(await plain.locator('.card-back').first().isVisible(), true);
    assert.equal(await plain.evaluate(() => getComputedStyle(document.body).fontFamily.includes('Montserrat')), true, 'CSS aplicado sem JavaScript');
    assert.equal(await plain.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.deepEqual(errors, []);
    assert.deepEqual(failed, [], 'todos os recursos respondem');
  } finally {
    if (browser) await browser.close();
    server.kill();
  }
});
