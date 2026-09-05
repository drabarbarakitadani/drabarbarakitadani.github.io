import { test } from 'node:test';
import assert from 'node:assert/strict';
import { esc, rich, moduloAtivo, renderModulo, renderBody, renderHead, loadContent, whatsappUrl } from '../scripts/render.mjs';

const content = loadContent();

test('escape e marcação mínima', () => {
  assert.equal(esc('<b>"a"</b> & c'), '&lt;b&gt;&quot;a&quot;&lt;/b&gt; &amp; c');
  assert.equal(rich('Antes de cuidar,\n*entender.*'), 'Antes de cuidar,<br><em>entender.</em>');
  assert.equal(rich('<script>*x*</script>'), '&lt;script&gt;<em>x</em>&lt;/script&gt;');
});

test('módulo respeita ativo, início e fim', () => {
  const base = { ativo: true, inicio: '2026-09-01', fim: '2026-09-30' };
  assert.equal(moduloAtivo(base, '2026-09-15'), true);
  assert.equal(moduloAtivo(base, '2026-08-31'), false);
  assert.equal(moduloAtivo(base, '2026-10-01'), false);
  assert.equal(moduloAtivo({ ...base, ativo: false }, '2026-09-15'), false);
  assert.equal(moduloAtivo({ ativo: true }, '2030-01-01'), true);
});

test('três tipos de módulo renderizam com ação resolvida', () => {
  const site = content.site;
  const destaque = renderModulo({ id: 'p', tipo: 'destaque', titulo: 'Mês da *avaliação.*', texto: 'x', acao: { texto: 'Reservar', url: 'whatsapp' } }, site);
  assert.match(destaque, /class="modulo modulo-destaque" id="modulo-p"/);
  assert.match(destaque, /<em>avaliação\.<\/em>/);
  assert.ok(destaque.includes(`href="${esc(whatsappUrl(site))}" target="_blank"`));
  const aviso = renderModulo({ id: 'a', tipo: 'aviso', titulo: 'Recesso', texto: 'até dia 27', acao: { texto: 'Ver', url: '#contato' } }, site);
  assert.match(aviso, /modulo-aviso/);
  assert.ok(aviso.includes('href="#contato">Ver</a>'));
  const info = renderModulo({ id: 'i', tipo: 'informacao', titulo: 'T', itens: ['um', 'dois'] }, site);
  assert.equal((info.match(/<li>/g) || []).length, 2);
});

test('página inclui 18 procedimentos, contato e módulos ativos na posição certa', () => {
  const ativo = { id: 'teste', ativo: true, tipo: 'aviso', posicao: 'apos-inicio', titulo: 'Aviso', texto: 't' };
  const html = renderBody({ ...content, modulos: [...content.modulos, ativo] }, '2026-09-05');
  assert.equal((html.match(/data-card /g) || []).length, 18);
  assert.equal(new Set([...html.matchAll(/data-procedure="([^"]+)"/g)].map(m => m[1])).size, 18);
  assert.ok(html.indexOf('id="modulo-teste"') > html.indexOf('id="inicio"'));
  assert.ok(html.indexOf('id="modulo-teste"') < html.indexOf('id="olhar"'));
  assert.equal(html.includes('modulo-exemplo-destaque'), false, 'exemplos ficam desligados');
  assert.ok(html.includes(`href="${esc(whatsappUrl(content.site))}"`));
  assert.ok(html.includes('Conheça os procedimentos · 18'));
  assert.ok(html.includes('<span class="registro">CRO-SP 159.520</span>'), 'CRO no rodapé');
});

test('head reflete indexação, canônica e imagem de compartilhamento absoluta', () => {
  const head = renderHead(content.site);
  assert.match(head, /rel="canonical" href="https:\/\//);
  assert.match(head, /property="og:image" content="https:\/\/[^"]+\/og\.jpg"/);
  assert.equal(head.includes('noindex'), !content.site.indexar);
  assert.ok(renderHead({ ...content.site, indexar: true }).includes('noindex') === false);
});
