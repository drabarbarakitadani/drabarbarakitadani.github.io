// Renderiza o HTML do site a partir dos arquivos em content/. Usado pelo Vite (dev e build) e pelos testes.
import { readFileSync } from 'node:fs';
import path from 'node:path';

export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
// Texto com marcação mínima: *palavra* vira destaque em oliva; quebra de linha vira <br>.
export function rich(value) {
  return esc(value).replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/\n/g, '<br>');
}

export function loadContent(dir = 'content') {
  const read = name => JSON.parse(readFileSync(path.join(dir, name), 'utf8'));
  return { site: read('site.json'), procedimentos: read('procedimentos.json'), modulos: read('modulos.json').modulos ?? [] };
}

const IMAGENS = {
  'foto-sorrindo-1': { larguras: [1080, 720], w: 1080, h: 1920, sizes: '(max-width: 760px) 100vw, 45vw' },
  'foto-sorrindo-2': { larguras: [777, 540], w: 777, h: 1409, sizes: '(max-width: 760px) 100vw, 40vw' }
};

export function whatsappUrl(site) {
  return `https://wa.me/${site.whatsapp.numero}?text=${encodeURIComponent(site.whatsapp.mensagem)}`;
}

function picture(nome, alt, attrs = '') {
  const img = IMAGENS[nome];
  if (!img) throw new Error(`Imagem desconhecida: ${nome}`);
  const srcset = ext => img.larguras.map(w => `media/${nome}-${w}.${ext} ${w}w`).join(', ');
  return `<picture><source type="image/webp" srcset="${srcset('webp')}" sizes="${img.sizes}"><img src="media/${nome}-${img.larguras[0]}.jpg" srcset="${srcset('jpg')}" sizes="${img.sizes}" width="${img.w}" height="${img.h}" alt="${esc(alt)}" ${attrs}></picture>`;
}

function resolveUrl(url, site) {
  if (url === 'whatsapp') return { href: whatsappUrl(site), externo: true };
  if (url === 'instagram') return { href: site.instagram.url, externo: true };
  return { href: url, externo: /^https?:/i.test(url) };
}

function acao(a, site, classe) {
  if (!a) return '';
  const { href, externo } = resolveUrl(a.url, site);
  const alvo = externo ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a class="${classe}" href="${esc(href)}"${alvo}>${esc(a.texto)}${externo ? ' <span aria-hidden="true">↗</span>' : ''}</a>`;
}

export function moduloAtivo(m, hoje) {
  if (!m.ativo) return false;
  if (m.inicio && hoje < m.inicio) return false;
  if (m.fim && hoje > m.fim) return false;
  return true;
}

export function renderModulo(m, site) {
  const id = `modulo-${esc(m.id)}`;
  if (m.tipo === 'aviso') {
    return `<section class="modulo modulo-aviso" id="${id}" aria-label="${esc(m.titulo)}"><p><strong>${esc(m.titulo)}</strong> ${rich(m.texto)} ${acao(m.acao, site, 'modulo-link')}</p></section>`;
  }
  if (m.tipo === 'informacao') {
    const itens = (m.itens ?? []).map(i => `<li>${rich(i)}</li>`).join('');
    return `<section class="modulo modulo-info" id="${id}"><div class="section-heading reveal">${m.rotulo ? `<p class="eyebrow">${esc(m.rotulo)}</p>` : ''}<h2>${rich(m.titulo)}</h2>${m.texto ? `<p>${rich(m.texto)}</p>` : ''}</div>${itens ? `<ul class="modulo-lista reveal">${itens}</ul>` : ''}${acao(m.acao, site, 'contact-button modulo-acao')}</section>`;
  }
  return `<section class="modulo modulo-destaque" id="${id}"><div class="reveal">${m.rotulo ? `<p class="eyebrow">${esc(m.rotulo)}</p>` : ''}<h2>${rich(m.titulo)}</h2>${m.texto ? `<p>${rich(m.texto)}</p>` : ''}${acao(m.acao, site, 'contact-button modulo-acao')}</div></section>`;
}

function card(p, indice) {
  const num = String(indice + 1).padStart(2, '0');
  const rotulo = `${num} · ${p.categoria.toUpperCase()}`;
  return `<article class="procedure reveal" data-card data-procedure="${esc(p.id)}">
<div class="card-rotor"><div class="card-face card-front"><span class="eyebrow">${esc(rotulo)}</span><svg viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${esc(p.icone)}"/></svg><h3>${esc(p.titulo)}</h3></div>
<div class="card-face card-back" id="detail-${esc(p.id)}"><span class="eyebrow">${esc(rotulo)}</span><h3>${esc(p.titulo)}</h3><p>${rich(p.descricao)}</p></div></div>
<button type="button" class="card-toggle" aria-expanded="false" aria-controls="detail-${esc(p.id)}" aria-label="Ver descrição: ${esc(p.titulo)}"></button>
</article>`;
}

export function renderHead(site) {
  const abs = rel => new URL(rel, site.url).href;
  const ld = {
    '@context': 'https://schema.org', '@type': 'Dentist', name: site.nomeCompleto, url: site.url, image: abs('og.jpg'),
    telephone: `+${site.whatsapp.numero}`, sameAs: [site.instagram.url],
    address: { '@type': 'PostalAddress', streetAddress: site.endereco[0], addressLocality: 'Ibiúna', addressRegion: 'SP', addressCountry: 'BR' }
  };
  return [
    `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`,
    site.indexar ? '' : `<meta name="robots" content="noindex,nofollow">`,
    `<title>${esc(site.titulo)}</title>`, `<meta name="description" content="${esc(site.descricao)}">`,
    `<link rel="canonical" href="${esc(site.url)}">`, `<meta name="theme-color" content="#f7f6f2">`,
    `<link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="apple-touch-icon.png">`,
    `<meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="${esc(site.nomeCompleto)}">`,
    `<meta property="og:title" content="${esc(site.titulo)}"><meta property="og:description" content="${esc(site.descricao)}"><meta property="og:url" content="${esc(site.url)}">`,
    `<meta property="og:image" content="${esc(abs('og.jpg'))}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<script type="application/ld+json">${JSON.stringify(ld)}</script>`
  ].filter(Boolean).join('\n');
}

export function renderBody(content, hoje) {
  const { site, procedimentos, modulos } = content;
  const ativos = modulos.filter(m => moduloAtivo(m, hoje));
  const slot = pos => ativos.filter(m => (m.posicao ?? 'apos-cuidados') === pos).map(m => renderModulo(m, site)).join('\n');
  const wa = whatsappUrl(site);
  const menu = site.menu.map(i => `<a href="${esc(i.href)}">${esc(i.texto)}${i.seta ? ' <span aria-hidden="true">↗</span>' : ''}</a>`).join('');
  const n = site.cuidados.iniciais;
  const iniciais = procedimentos.slice(0, n).map(card).join('\n');
  const restantes = procedimentos.slice(n).map((p, i) => card(p, i + n)).join('\n');
  const heading = s => `<div class="section-heading reveal"><p class="eyebrow">${esc(s.rotulo)}</p><h2>${rich(s.titulo)}</h2><p>${rich(s.texto)}</p></div>`;
  const experiencia = site.experiencia.exibir ? `<section id="experiencia" class="experience">${heading(site.experiencia)}<div class="video-frame reveal"><video id="clinic-video" controls muted playsinline preload="none" poster="media/${esc(site.experiencia.poster)}" aria-label="${esc(site.experiencia.videoAlt)}"><source src="media/${esc(site.experiencia.video)}" type="video/mp4">Seu navegador não reproduz este vídeo. <a href="media/${esc(site.experiencia.video)}">Abrir vídeo</a>.</video></div></section>` : '';
  return `<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<header><a class="brand" href="#inicio" aria-label="${esc(site.nome)}, início"><img src="monogram-bk.svg" width="54" height="51" alt=""><span>${esc(site.nome).toUpperCase().replace(' ', '<br>')}</span></a><nav aria-label="Principal">${menu}</nav></header>
<main id="conteudo">
<section id="inicio" class="hero"><div class="hero-copy"><p class="eyebrow reveal">${esc(site.inicio.rotulo)}</p><h1>${site.inicio.titulo.map(l => `<span class="hero-line">${rich(l)}</span>`).join('')}</h1><p class="hero-sub reveal">${rich(site.inicio.texto)}</p><a class="scroll-link" href="#olhar">${esc(site.inicio.link)} <span aria-hidden="true">↓</span></a></div><div class="hero-image">${picture(site.inicio.imagem, site.inicio.imagemAlt, 'fetchpriority="high"')}</div></section>
${slot('apos-inicio')}
<section id="olhar" class="story"><div class="story-visual">${picture(site.olhar.imagem, site.olhar.imagemAlt, 'loading="lazy"')}<span class="eyebrow">${esc(site.olhar.legenda)}</span></div><div class="story-steps">${site.olhar.passos.map(p => `<article class="story-step reveal"><p class="eyebrow">${esc(p.rotulo)}</p><h2>${rich(p.titulo)}</h2><p>${rich(p.texto)}</p></article>`).join('')}</div></section>
${slot('apos-olhar')}
${experiencia}
${slot('apos-experiencia')}
<section id="cuidados" class="care">${heading(site.cuidados)}<div class="cards">
${iniciais}
</div><details class="all-care"><summary><span class="when-closed">${esc(site.cuidados.abrir)} · ${procedimentos.length}</span><span class="when-open">${esc(site.cuidados.fechar)}</span><span class="expand-icon" aria-hidden="true">+</span></summary>
<div class="cards expanded-cards">
${restantes}
</div></details></section>
${slot('apos-cuidados')}
<section id="contato" class="contact"><p class="eyebrow reveal">${esc(site.contato.rotulo)}</p><h2 class="reveal">${rich(site.contato.titulo)}</h2><p class="reveal">${rich(site.contato.texto)}</p><a class="contact-button" id="schedule" href="${esc(wa)}" target="_blank" rel="noopener noreferrer">${esc(site.contato.botao)} <span aria-hidden="true">↗</span></a><p class="contact-phone">WhatsApp · ${esc(site.whatsapp.exibicao)}</p><address class="contact-address">${site.endereco.map(esc).join('<br>')}</address></section>
${slot('apos-contato')}
</main><footer><span>${esc(site.nome).toUpperCase()}</span><span>${esc(site.atuacao)}${site.registro ? ` · ${esc(site.registro)}` : ''}</span><a class="instagram-link" href="${esc(site.instagram.url)}" target="_blank" rel="noopener noreferrer" aria-label="Instagram da ${esc(site.nomeCompleto)} (abre em nova aba)"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></svg><span>@${esc(site.instagram.usuario)}</span></a></footer>`;
}

export function hojeISO(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function renderIndex(template, content, hoje = process.env.BUILD_DATE || hojeISO()) {
  return template.replace('<!-- @head -->', renderHead(content.site)).replace('<!-- @body -->', renderBody(content, hoje));
}
