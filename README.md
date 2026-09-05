# Dra. Barbara Kitadani — site

Site estático de apresentação da Dra. Barbara Kitadani (estética facial e odontologia, Ibiúna, SP). Conteúdo em JSON, build com Vite, publicação automática no GitHub Pages a cada push na `main`.

- Endereço público: valor de `url` em [content/site.json](content/site.json).
- Repositório oficial: https://github.com/drabarbarakitadani/drabarbarakitadani.github.io
- Guia de manutenção: [docs/OPERACAO.md](docs/OPERACAO.md)
- Plano e pendências para divulgação: [docs/PLANO-PUBLICACAO.md](docs/PLANO-PUBLICACAO.md)

## Rodar localmente

```
npm install
npm run dev       # http://localhost:5173, recarrega ao editar content/*.json
npm test          # gera dist/ e roda testes unitários e em navegador (requer Google Chrome)
npm run preview   # serve dist/ como em produção
```

## Estrutura

| Pasta ou arquivo | Função |
| --- | --- |
| `content/site.json` | Dados profissionais, contato, textos das seções, indexação |
| `content/procedimentos.json` | Os 18 cards: título, descrição, categoria e ícone SVG |
| `content/modulos.json` | Molde de seções extras (promoções, avisos, informações) com ativação e datas |
| `scripts/render.mjs` | Transforma o conteúdo em HTML durante o build |
| `src/main.js`, `src/styles/` | Interação (Anime.js 4.0.2), tokens da identidade e estilos |
| `src/fonts/` | Montserrat 400/500/600 hospedada localmente, licença OFL |
| `public/media/` | Fotos e vídeo otimizados, gerados por `npm run media` a partir de `docs/midia/` |
| `public/` | Favicon, ícone iOS, imagem de compartilhamento (`npm run brand`), robots.txt |
| `tests/` | Testes unitários do renderizador e teste de produção em navegador |
| `.github/workflows/publicar.yml` | Build, testes e deploy no GitHub Pages; roda também diariamente |
| `docs/` | Identidade visual, referências, inventário de mídia e planejamento |

## Comportamento

Abertura com retrato, narrativa de escuta e cuidado, vídeo com início automático sem som ao entrar na tela, 18 cards que giram ao passar o mouse, tocar ou usar Enter/Espaço, e convite para agendamento via WhatsApp com mensagem preenchida. Sem JavaScript, todo o conteúdo continua legível. Redução de movimento desliga animações e autoplay.

Identidade: Montserrat, base clara, verde oliva #708D3E como acento e verde profundo #1F2711 nos detalhes. Documentação em [docs/visual-identity/](docs/visual-identity/).

## Pendências antes de divulgar

Revisão dos textos dos cards e aprovação do vídeo pela Dra., incluindo autorização de imagem da paciente que aparece nos cortes. Enquanto isso, o site fica publicado com `noindex`. Detalhes no [plano de publicação](docs/PLANO-PUBLICACAO.md).
