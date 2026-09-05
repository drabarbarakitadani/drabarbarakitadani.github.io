import { animate, createTimeline, stagger } from 'animejs';
import './styles/tokens.css';
import './styles/site.css';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const hover = matchMedia('(hover: hover) and (pointer: fine)');
const running = new Set();

function motion(target, params) {
  if (reduced.matches) return null;
  const a = animate(target, params);
  running.add(a);
  return a;
}

// Vídeo: começa sem som quando ao menos 55% entra na tela, pausa ao sair ou com a aba oculta. Pausa manual é respeitada.
const video = document.getElementById('clinic-video');
if (video) {
  let videoInView = false, manualPause = false, internalPauses = 0, playPending = false;
  video.muted = true;
  const pauseVideo = () => { if (!video.paused) { internalPauses++; video.pause(); } };
  const updateVideo = () => {
    if (!videoInView || document.hidden) { pauseVideo(); return; }
    if (reduced.matches || manualPause || video.ended || !video.paused || playPending) return;
    playPending = true;
    video.play().then(() => { if (!videoInView || document.hidden || reduced.matches) pauseVideo(); })
      .catch(() => { /* Controles nativos ficam disponíveis se o navegador bloquear o autoplay. */ })
      .finally(() => { playPending = false; });
  };
  video.addEventListener('pause', () => { if (internalPauses) { internalPauses--; return; } if (!video.ended) manualPause = true; });
  video.addEventListener('play', () => { manualPause = false; if (!videoInView || document.hidden) pauseVideo(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= .55) videoInView = true; else if (entry.intersectionRatio <= .2) videoInView = false;
      updateVideo();
    }, { threshold: [0, .2, .55, 1] }).observe(video);
  } else { videoInView = true; }
  document.addEventListener('visibilitychange', updateVideo);
  reduced.addEventListener('change', () => { if (reduced.matches) pauseVideo(); else updateVideo(); });
}

if (!reduced.matches) {
  const tl = createTimeline({ defaults: { ease: 'outCubic' } });
  tl.add('.hero-line', { opacity: [0, 1], y: [30, 0], duration: 850, delay: stagger(100) })
    .add('.hero-image', { opacity: [0, 1], clipPath: ['inset(12% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'], duration: 1100 }, 0);
  running.add(tl);
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { motion(entry.target, { opacity: [0, 1], y: [24, 0], duration: 700, ease: 'outCubic' }); observer.unobserve(entry.target); }
  }), { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Cards: um único estado coordena mouse, toque e teclado.
const cards = [];
document.querySelectorAll('[data-card]').forEach(card => {
  const rotor = card.querySelector('.card-rotor'), front = card.querySelector('.card-front'), back = card.querySelector('.card-back'), button = card.querySelector('button');
  const name = front.querySelector('h3').textContent;
  let opened = false, pinned = false, over = false, anim = null;
  function render(open, instant = false) {
    opened = open;
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', (open ? 'Fechar descrição: ' : 'Ver descrição: ') + name);
    if (open) button.setAttribute('aria-describedby', back.id); else button.removeAttribute('aria-describedby');
    front.setAttribute('aria-hidden', String(open)); back.setAttribute('aria-hidden', String(!open));
    front.inert = open; back.inert = !open;
    if (anim) { anim.pause(); running.delete(anim); }
    if (reduced.matches) {
      rotor.style.transform = 'none'; front.style.visibility = open ? 'hidden' : 'visible'; back.style.visibility = open ? 'visible' : 'hidden';
    } else {
      front.style.visibility = ''; back.style.visibility = '';
      if (!instant) anim = motion(rotor, { rotateY: open ? 180 : 0, duration: 700, ease: 'inOutCubic' });
      else rotor.style.transform = 'rotateY(' + (open ? 180 : 0) + 'deg)';
    }
  }
  button.addEventListener('click', () => { pinned = !pinned; render(pinned); });
  card.addEventListener('pointerenter', () => { if (hover.matches) { over = true; render(true); } });
  card.addEventListener('pointerleave', () => { over = false; if (!pinned && !card.contains(document.activeElement)) render(false); });
  card.addEventListener('focusout', () => { queueMicrotask(() => { if (!pinned && !over && !card.contains(document.activeElement)) render(false); }); });
  card.addEventListener('keydown', e => { if (e.key === 'Escape') { pinned = false; render(false); button.focus(); } });
  render(false, true); cards.push(() => render(opened, true));
});
document.documentElement.classList.add('cards-ready');
reduced.addEventListener('change', () => { running.forEach(a => a.complete()); running.clear(); cards.forEach(update => update()); });
