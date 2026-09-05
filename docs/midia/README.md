# Acervo e aplicação de mídia

Atualizado em 05/09/2026. Opções para o protótipo; composição e recortes ainda não aprovados. Originais preservados.

## Direção do projeto

- Público de 25 a 45 anos interessado em pele, rejuvenescimento e embelezamento.
- Mostrar atendimento próximo, escuta, naturalidade e cuidado com a face como um todo.
- Lannino: referência principal de dinâmica e sequência animada, com pouca informação por momento: https://lannino.com/
- Odyssée: referência de olhar, rosto e identidade clean: https://www.odysseeclinic.com.au/
- Organizar a exploração por pele, face e sorriso, sem priorizar um procedimento específico neste momento.

## Materiais disponíveis

| Arquivo | Dados | Leitura e uso proposto |
| --- | --- | --- |
| [foto-sorrindo-1.png](foto-sorrindo-1.png) | 1080 × 1920; 2,44 MB | Foto observada: sorriso espontâneo, enquadramento lateral, luz e reflexos no ambiente. Candidata ao momento sobre escuta e proximidade. |
| [foto-sorrindo-2.jpg](foto-sorrindo-2.jpg) | 777 × 1409; 0,22 MB | Foto observada: retrato frontal sorrindo, blazer claro e ambiente de consultório. Candidata à apresentação da profissional ou abertura mobile. Evitar ampliação excessiva no desktop. |
| [video-conceito.MP4](video-conceito.MP4) | 42,44 segundos, segundo o cabeçalho MP4; 75,92 MB | Segundo o usuário, mostra cortes da Dra. trabalhando e deve ser considerado para aparecer no site. Conteúdo visual, áudio, orientação e cortes ainda não inspecionados. Candidato a um momento dedicado à experiência de atendimento. |
| [logo-2.png](../visual-identity/logo-2.png) | 1536 × 1024; 2,34 MB | Imagem observada: assinatura BK com relevo, sombras e fundo bege texturizado. Referência de materialidade e cores; é um mockup raster, não vetor transparente. |

## Sequência inicial para experimentar

1. Apresentação: retrato da Dra., nome e uma frase curta.
2. Filosofia de cuidado: foto espontânea e mensagens breves sobre escuta e individualidade.
3. Experiência: vídeo em uma área própria, com poster estático e opção de reprodução.
4. Exploração: pele, face e sorriso, com detalhes sob demanda.
5. Contato: convite para avaliação.

Esta sequência é uma proposta, não uma decisão de layout. O vídeo também poderá ser testado na abertura após inspeção dos cortes. A rolagem conduz as transições; a reprodução do vídeo é uma decisão independente.

## Preparação para implementação

- Gerar derivados otimizados das fotos, preservando os originais; definir recortes distintos para celular e desktop sem cortar o rosto.
- As fotos são verticais. No desktop, experimentar composição com imagem ao lado de texto em vez de esticá-las para preencher a largura.
- Selecionar um poster do vídeo após assisti-lo e gerar uma versão comprimida. Não carregar automaticamente o original de 76 MB na abertura.
- Se houver loop ambiente, usar trecho curto sem som e permitir pausa. Respeitar a preferência de redução de movimento com apresentação estática.
- Se o vídeo integral tiver fala relevante, oferecer legendas e controles de áudio.
- Rever os cortes concretos antes de publicar, incluindo eventuais imagens de pacientes e execução de procedimentos; a descrição recebida não equivale a aprovação editorial dos trechos.
- A referência de close do olhar ainda precisa de uma foto adequada: não assumir que os retratos disponíveis suportam um macro com qualidade.

## Inspeção do vídeo (05/09/2026)

Quadros extraídos a cada 4 segundos. Sequência: abraço de recepção; consulta à mesa com análise facial em tablet; Dra. sorrindo à mesa (12 s, usado como poster); fotografia clínica da paciente; procedimento injetável no rosto com luvas e máscara; tela preta no final. A faixa de áudio existe (AAC estéreo); conteúdo do áudio não avaliado. Uma paciente aparece identificável em quase todos os cortes. Derivados gerados em `public/media/` por `npm run media`, com metadados removidos.

## Pendências

- Ouvir o áudio e decidir se permanece; se houver fala, preparar legendas.
- Obter autorização de uso de imagem da paciente e validar os cortes de procedimento com a Dra.
- Comparar os dois retratos no protótipo e escolher a abertura.
- Confirmar se existem originais em maior resolução, especialmente da segunda foto.
- Validar se os tons do novo mockup serão adotados na identidade do site.
