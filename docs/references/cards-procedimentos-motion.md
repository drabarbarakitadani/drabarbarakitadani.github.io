# Cards de procedimentos — referência e comportamento

Atualizado em 05/09/2026. Componente implementado no protótipo com Anime.js 4.0.2 e verificado no Chrome em desktop e viewport mobile.

## Referência e escopo

Referência: https://larivenancio.com.br/

O usuário destacou os desenhos minimalistas e o giro dos cards ao passar o mouse, revelando nome e descrição breve. A consulta textual confirmou a seção de serviços com imagens, títulos e descrições; o movimento não foi reproduzido pela ferramenta. O comportamento abaixo traduz o pedido para o projeto BK, sem copiar textos, artes ou serviços da referência.

Lannino permanece a referência principal da sequência da página. Três cards aparecem inicialmente; “Conheça os procedimentos” revela os outros 15. A lista completa contém os 18 procedimentos informados pela Dra., cada um uma única vez. A seleção inicial continua sendo uma amostra de interação, sem prioridade comercial aprovada.

## Conteúdo e visual

- Frente: ilustração vetorial minimalista e título curto visível. Sem texto “Conhecer” ou “Voltar” abaixo do card, conforme pedido do usuário.
- Verso: nome do procedimento e descrição de uma ou duas frases. Os textos são rascunhos e ainda precisam da revisão clínica da Dra.
- Ilustrações próprias em SVG, com traços consistentes, representando pele, lábios, contorno facial ou sorriso conforme o procedimento.
- Aplicar a identidade aprovada: Montserrat, porcelana, areia, verde oliva e detalhes verde profundo. Desenhos em verde profundo.
- Espaço para textos variáveis do CMS; sem truncar informação essencial ou fixar altura que corte o verso com zoom.
- Se existir link de agendamento no verso, ele será um elemento independente do botão de virar; não aninhar links em botões.

## Interação proposta

| Contexto | Comportamento |
| --- | --- |
| Entrada na tela | Revelação leve ao rolar, em pequenos grupos; sem giro automático que obrigue a ler rapidamente. |
| Mouse com hover real | Entrada do ponteiro revela o verso. Saída volta à frente apenas se o card não estiver fixado por clique nem contiver foco. |
| Clique ou toque | Toda a superfície do card é o controle; alterna aberto/fechado, com abertura persistente até nova ação do usuário. Toque não inicia agendamento. |
| Teclado | Botão acessível por Tab; Enter/Espaço alternam; Escape fecha mantendo foco em local visível. |
| Redução de movimento | Exibir a troca de conteúdo sem rotação 3D. |
| Sem JavaScript | Título e descrição continuam legíveis no fluxo normal. |

Giro implementado: eixo Y, 180 graus, duração de 700 ms e easing inOutCubic. Scroll move o contêiner externo; giro atua em um elemento interno para evitar conflito de transforms. Um botão transparente sobre o card preserva a área de interação durante o giro, com nome acessível, foco visível e descrição associada quando aberto.

Um estado de abertura único deve coordenar mouse, toque e teclado. A face oculta não pode permanecer no foco ou ser lida em duplicidade por leitores de tela. Usar aria-expanded e aria-controls no controle; backface-visibility sozinho não resolve acessibilidade. O controle persistente fora das faces evita que o foco desapareça durante a troca.

## Anime.js

Biblioteca indicada pelo usuário para implementação. Recursos verificados na documentação oficial:

- animate(): animações de propriedades — https://animejs.com/documentation/animation
- createTimeline(): sincronização e sequência — https://animejs.com/documentation/timeline
- onScroll(): controle relacionado à rolagem — https://animejs.com/documentation/events

A biblioteca fornece os recursos para construir o efeito; não assumir que a referência usa Anime.js ou que o card está pronto na biblioteca. Selecionar e fixar uma versão compatível na implementação.

## Verificação do protótipo

- Desktop: hover, saída, clique para manter aberto e interações rápidas sem giros acumulados.
- Celular: toque para abrir e fechar, scroll vertical livre, sem depender de hover.
- Teclado: abertura, fechamento e ordem de foco estáveis; conteúdo oculto fora da navegação.
- Texto ampliado e descrição longa: verso não corta conteúdo nem sobrepõe o próximo card.
- Movimento reduzido e falha de JavaScript: descrições continuam disponíveis.
- Conteúdo e ilustrações limitados aos procedimentos efetivamente informados pela Dra.
