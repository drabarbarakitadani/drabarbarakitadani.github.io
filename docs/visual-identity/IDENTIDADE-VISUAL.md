# Identidade visual digital — proposta v2

Data: 05/09/2026. Status: direção visual digital aprovada pelo usuário em conversa ("ok na identidade visual"). O desenho reconstruído do logo continua sujeito a revisão de fidelidade.

Revisão de cor solicitada pelo usuário: verde oliva #708D3E como acento; verde profundo #1F2711 em pequenas doses nos contornos, links e palavras de destaque. Montserrat e base clara preservadas. O painel foi atualizado; os arquivos de logo mantêm suas cores originais.

## Conceito

Precisão com proximidade. Uma presença luminosa, natural e contemporânea, com espaço para o olhar, a expressão e a escuta. A marca deve transmitir cuidado individualizado, respeito à anatomia e bem-estar.

Lannino orienta a dinâmica sequencial, não as cores. Odyssée orienta a apresentação clean do rosto e do olhar. Apple é referência complementar de hierarquia. O documento inspirado na Barbara Sturm orienta espaço, materialidade e edição do conteúdo.

## Tipografia

O nome nas imagens possui letras sem serifa, geométricas, leves e espaçadas. O monograma BK possui contraste entre traços finos e grossos e desenho próprio. A fonte original não foi identificada. O primeiro JPEG e o novo mockup têm diferenças nas letras, como a barra dos As; não inferir uma fonte exata a partir deles. O SVG reconstruído é uma aproximação, não uma fonte.

Proposta: **Montserrat** como única família do site. Escolha por afinidade visual com a assinatura, não identificação de autoria. Manrope fica como alternativa caso a composição final peça um desenho menos próximo do lettering.

| Uso | Peso | Tamanho mobile → desktop | Entrelinha / espaçamento |
| --- | --- | --- | --- |
| Título de abertura | 400 | 40 → 88 px | 1,08 / -0,035em |
| Título de seção | 400 | 30 → 56 px | 1,15 / -0,025em |
| Texto de destaque | 400 | 22 → 28 px | 1,4 / normal |
| Texto corrido | 400 | 16 → 18 px | 1,65 / normal |
| Botões e navegação | 500 | 15 → 16 px | 1,4 / 0,01em |
| Rótulo curto | 500 | 12 → 13 px | 1,5 / 0,12em, caixa alta |

Reservar letras espaçadas e caixa alta a rótulos curtos. Usar frases em caixa normal nos títulos para manter proximidade. O nome no logo permanece como arte vetorial; não recriá-lo digitando em Montserrat. Peso 300 só como experimento em títulos grandes, após conferir no celular.

Validar acentos e textos reais: “avaliação”, “harmonização”, “cirurgiã-dentista” e “cuidado com você”. Na produção, hospedar arquivos de fonte e licença junto ao projeto, com font-display: swap. O painel de referência usa Google Fonts online e informa quando a fonte não carregar.

Fontes consultadas:
- https://fonts.google.com/specimen/Montserrat
- https://github.com/google/fonts/blob/main/ofl/montserrat/OFL.txt
- Alternativa: https://www.sharanda.com/manrope

## Paleta

As cores são propostas visuais inspiradas nos arquivos; não uma extração de cores oficiais. Luz, relevo e textura do mockup alteram os pixels.

| Papel | Nome | HEX | Aplicação |
| --- | --- | --- | --- |
| Fundo principal | Porcelana | #F7F6F2 | Maior parte da página |
| Superfície | Branco | #FFFFFF | Áreas de leitura e detalhes |
| Fundo alternado | Areia | #E8E1D8 | Pausas e capítulos acolhedores |
| Acento digital | Oliva | #708D3E | Palavras grandes e pequenos traços de destaque |
| Detalhes escuros | Verde profundo | #1F2711 | Contorno do botão, links e títulos pontuais |
| Cor do logo existente | Taupe | #9D948A | Preservada nos SVGs; não é mais o acento principal do site |
| Texto secundário | Pedra | #716D64 | Texto sobre porcelana ou branco |
| Texto e ação principal | Grafite quente | #292824 | Títulos, corpo, botões e foco |
| Divisória decorativa | Névoa | #D5CEC5 | Linhas que não sejam essenciais à compreensão |

Predominância de porcelana e fotografias. Areia em momentos pontuais. Grafite concentra leitura; oliva marca palavras grandes e traços. Verde profundo substitui pequenos contornos escuros e destaques, sem grandes áreas preenchidas nessa cor. Não aplicar um filtro bege uniforme sobre a pele.

Contrastes calculados para cores sólidas:
- Grafite / porcelana: 13,64:1.
- Pedra / porcelana: 4,77:1.
- Grafite / areia: 11,38:1.
- Pedra / areia: 3,98:1 — usar grafite para texto pequeno nesse fundo.
- Taupe / porcelana: 2,76:1 — reservar a decoração; não usar em textos informativos ou contornos essenciais.
- Porcelana / grafite: 13,64:1 — combinação disponível para aplicações futuras.
- Oliva / porcelana: 3,49:1 — usar em títulos grandes e acentos, não em texto pequeno.
- Verde profundo / porcelana: 14,32:1 — texto e contorno do botão no painel atualizado.
- Verde profundo / oliva: 4,10:1 — evitar essa combinação em texto pequeno; o botão usa fundo claro.

Esses valores não validam texto sobre fotografia ou vídeo. Nesses casos, preferir bloco sólido; testar qualquer sobreposição em todos os quadros relevantes.

## Composição e formas

- Uma ideia principal por momento, com detalhes de tratamentos sob demanda.
- Margem horizontal de 24 px no celular e 48–80 px no desktop.
- Conteúdo limitado a 1280 px; parágrafos com no máximo 60 caracteres por linha.
- Escala de espaço: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px.
- Fotografias grandes com recorte intencional; preservar olhos, rosto e gestos.
- Cantos discretos de 8 px em mídia e 4 px nos botões.
- Poucas divisórias finas; relevo reservado à apresentação da marca, não a todos os elementos.
- Ícones lineares consistentes, acompanhados de nome acessível; área de toque proposta de pelo menos 48 px.

## Componentes e estados

Cards ilustrados de procedimentos com giro: incorporar a referência específica de Lari Venâncio solicitada pelo usuário. Distribuir pequenos grupos ao longo da narrativa; frente com desenho e identificação, verso com descrição breve. Hover no desktop e controle por toque/teclado. Planejar a animação com Anime.js. Especificação: [cards de procedimentos e movimento](../references/cards-procedimentos-motion.md).

Botão principal na proposta v2: fundo claro com contorno fino, texto e seta em verde profundo, altura mínima 48 px e texto “Agendar avaliação”. Hover futuro com mudança leve de superfície; foco externo visível. Links secundários sublinhados em verde profundo. Estados ativos devem ter indicação além da cor.

Navegação curta: marca, menu e acesso ao agendamento. O contato real ainda precisa ser fornecido. No protótipo de identidade, qualquer botão de demonstração deve declarar sua função e não simular um agendamento concluído.

FAQ e tratamentos: títulos claros, detalhes expansíveis, foco e teclado funcionais. Campos do futuro CMS devem preservar hierarquia e cores.

## Fotografia e vídeo

Foto sorrindo 2: candidata à apresentação. Foto sorrindo 1: candidata à seção de proximidade. Retratos verticais não devem ser esticados no desktop. Textura de pele e expressão preservadas.

Vídeo: momento dedicado à experiência, sujeito à inspeção dos cortes. Local na sequência ainda em aberto. Preparar versão comprimida, poster, pausa e controles apropriados. Inventário: ../midia/README.md.

## Movimento

A sequência inspirada no Lannino continua central. Uma transição visual pode conectar seções, mas conteúdo e contato ficam disponíveis sem esperar animação.

- Resposta de botões: 160–220 ms.
- Transições editoriais propostas: 600–900 ms; ainda precisam ser testadas.
- Entrada discreta por opacidade e deslocamento curto; evitar deslocar textos durante leitura.
- Scroll nativo e controle do usuário. Não bloquear rolagem para terminar uma cena.
- Redução de movimento: conteúdo estático e legível, sem entradas obrigatórias.
- Fundo animado do Figma ainda não visualizado; não é elemento aprovado.

## Voz

Humana, clara e calma. Propostas de texto, sujeitas à revisão:
- “Seu rosto. Sua história. Seu cuidado.”
- “Um olhar atento para o que faz você ser você.”
- “Cuidado que começa na escuta.”

A linguagem traduz acolhimento e planejamento individualizado sem promessas de resultado.

## Logo

Preservar proporções do BK e da assinatura. Monograma em interfaces compactas; assinatura completa onde houver largura para leitura. Área livre inicial: pelo menos 1/4 da largura do monograma ao redor dele, a testar.

O logo completo tem linhas delicadas: testar tamanho mínimo na aplicação, sem fixar um mínimo de impressão a partir desta referência digital. Não usar o mockup com fundo como logotipo do cabeçalho. Versões monocromáticas e ícone simplificado são trabalho posterior; originais e SVGs atuais permanecem preservados.

## Revisão com a Dra.

O painel identidade-preview.html permite avaliar paleta, Montserrat e uma aplicação com foto. É um estudo estático de identidade, não o protótipo de dinâmica do site.

Montserrat e paleta da proposta v2 aprovadas para avançar ao protótipo. Frase de apresentação e cortes do vídeo continuam em revisão. Protótipo navegável em ../../index.html; ainda sem publicação ou identificação da fonte original do logo.
