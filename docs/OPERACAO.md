# Guia de operação

Para quem mantém o site. A Dra. não precisa acessar nada; toda alteração passa por este repositório.

## Como o site funciona

- O conteúdo fica em três arquivos JSON na pasta `content/`. O HTML é gerado a partir deles no momento do build.
- Cada push na branch `main` dispara o workflow em `.github/workflows/publicar.yml`: instala dependências, gera o site, roda os testes em navegador e publica no GitHub Pages. Se um teste falhar, a versão anterior continua no ar.
- O workflow também roda todo dia às 9h UTC para que módulos com data de início e fim entrem e saiam do ar sem novo commit.
- Endereço público: o valor de `url` em `content/site.json`.

## Rotina de uma alteração

```
npm install          # só na primeira vez
npm run dev          # abre o site local com recarga automática ao salvar os JSON
npm test             # gera dist/ e roda todos os testes (obrigatório antes de publicar)
git add -A
git commit -m "Descreva a mudança"
git push
```

Acompanhe a publicação na aba Actions do repositório. Leva de dois a três minutos. Depois, abra o site no celular em uma aba anônima para confirmar.

## O que editar em cada arquivo

### content/site.json — dados e textos das seções fixas

- `registro`: CRO/UF da Dra., exibido no rodapé quando preenchido. Exemplo: `"CRO-SP 123456"`.
- `indexar`: `false` mantém o site fora do Google. Trocar para `true` só após aprovação final da Dra.
- `url`: endereço público. Usado na URL canônica e na imagem de compartilhamento. Trocar se o site mudar de hospedagem.
- `whatsapp.numero` no formato internacional sem sinais; `whatsapp.mensagem` é o texto que chega preenchido.
- `titulo` e `descricao`: o que aparece na aba do navegador, no Google e na prévia do WhatsApp.
- Seções `inicio`, `olhar`, `experiencia`, `cuidados` e `contato`: textos visíveis. `experiencia.exibir: false` esconde a seção do vídeo inteira.

Marcação disponível em qualquer texto: `*palavra*` deixa a palavra em verde oliva; `\n` quebra a linha.

### content/procedimentos.json — os cards

Lista ordenada. Os três primeiros aparecem abertos; os demais ficam atrás de "Conheça os procedimentos". Para reordenar, mova o item. Para adicionar, copie um item e altere `id` (sem espaços ou acentos, único), `categoria` (Pele, Face ou Sorriso), `titulo`, `descricao` e `icone` (o atributo `d` de um `<path>` SVG em uma caixa de 120 por 120). O rótulo do card é a categoria.

### content/modulos.json — molde para promoções, avisos e informações extras

Cada item da lista `modulos` vira uma seção do site quando `ativo` é `true` e a data de hoje está entre `inicio` e `fim`. As datas são opcionais.

| Campo | Uso |
| --- | --- |
| `id` | Identificador único, sem espaços. Vira a âncora `#modulo-<id>`. |
| `ativo` | `true` publica; `false` guarda o módulo pronto sem exibir. |
| `tipo` | `destaque` (título grande, texto e botão sobre fundo areia), `aviso` (faixa curta escura, ideal para recesso ou horário) ou `informacao` (título, texto e lista de itens). |
| `posicao` | `apos-inicio`, `apos-olhar`, `apos-experiencia`, `apos-cuidados` ou `apos-contato`. |
| `inicio`, `fim` | Datas `AAAA-MM-DD`. O módulo aparece no primeiro build a partir de `inicio` e sai no primeiro build após `fim`. |
| `rotulo`, `titulo`, `texto` | Textos. `titulo` aceita `*destaque*`. |
| `itens` | Só no tipo `informacao`: lista de frases curtas. |
| `acao` | Opcional. `texto` do botão e `url`: `whatsapp`, `instagram`, `#contato` ou um endereço completo. |

Os três exemplos incluídos estão com `ativo: false`. Copie um deles para criar um módulo novo. Teste com `npm run dev` antes de publicar.

Atenção: promoções, descontos e preços em publicidade de cirurgiã-dentista têm restrições no Código de Ética Odontológica. Confirme com a Dra. antes de publicar um módulo com esse conteúdo.

## Trocar fotos ou vídeo

1. Coloque o arquivo original em `docs/midia/` com o mesmo nome do que vai substituir. Originais não vão para o repositório quando forem grandes; o vídeo original já está ignorado pelo git.
2. Rode `npm run media`. O script gera versões otimizadas em `public/media/` com metadados removidos. Requer ffmpeg instalado; no Windows, `winget install Gyan.FFmpeg`.
3. A capa do vídeo é o campo `experiencia.poster` em `content/site.json`: qualquer arquivo de `public/media/` serve (hoje, `foto-sorrindo-1-1080.jpg`). `video-poster.jpg` é um quadro do próprio vídeo, gerado aos 12 segundos, disponível como alternativa.
4. Se mudar as dimensões de uma foto, atualize a tabela `IMAGENS` em `scripts/render.mjs`.
5. Rode `npm test` e faça o commit incluindo `public/media/`.

Limite do GitHub: 100 MB por arquivo. O vídeo publicado tem cerca de 9 MB.

## Trocar favicon ou imagem de compartilhamento

`npm run brand` regera `public/favicon.svg`, `public/apple-touch-icon.png` e `public/og.jpg` a partir do monograma e dos textos de `site.json`. O WhatsApp guarda a prévia em cache por alguns dias; para forçar, compartilhe o link com `?v=2` no final.

## Quando o site for aprovado para divulgação

1. Preencher `registro` em `site.json`.
2. Trocar `indexar` para `true`.
3. Confirmar que os textos dos 18 cards e o vídeo foram revisados pela Dra.
4. Publicar e colocar o endereço na bio do Instagram.

## Mudar de hospedagem no futuro

O build usa caminhos relativos e funciona em qualquer hospedagem estática: Cloudflare Pages, Netlify, Vercel ou domínio próprio. Comando de build `npm run build`, pasta de saída `dist`. Ao mudar, atualize `url` em `site.json`.

Para domínio próprio no GitHub Pages: adicionar o arquivo `public/CNAME` com o domínio, configurar o DNS conforme a documentação do GitHub e atualizar `url`.

## Se algo quebrar

- Site fora do ar ou desatualizado: abra a aba Actions e leia o log da última execução. Erros de teste mostram a asserção que falhou.
- Para voltar a uma versão anterior: `git revert <commit>` e push. O workflow publica a versão revertida.
- Testes locais exigem Google Chrome instalado. Para usar o Chromium do Playwright: `npx playwright install chromium` e `PW_CHANNEL=chromium npm test`.
