import { defineConfig } from 'vite';
import { loadContent, renderIndex } from './scripts/render.mjs';

// Conteúdo em content/*.json vira HTML em tempo de build. Caminhos relativos permitem publicar em qualquer subcaminho (GitHub Pages ou Cloudflare Pages).
export default defineConfig({
  base: './',
  build: { outDir: 'dist', emptyOutDir: true, assetsInlineLimit: 0 },
  plugins: [{
    name: 'bk-conteudo',
    transformIndexHtml: { order: 'pre', handler: html => renderIndex(html, loadContent()) },
    configureServer(server) {
      server.watcher.add('content');
      server.watcher.on('change', file => { if (file.includes('content')) server.ws.send({ type: 'full-reload' }); });
    }
  }]
});
