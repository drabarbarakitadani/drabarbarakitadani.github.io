# Plano de publicação e conclusão

Data: 05/09/2026. Atualizado no mesmo dia após a execução das etapas 1 e 2.

Repositório oficial: https://github.com/drabarbarakitadani/drabarbarakitadani.github.io (organização gratuita drabarbarakitadani, administrada pela conta pessoal pptex23; criado como pptex23/dra-barbara-kitadani e transferido em 05/09/2026). O nome project-dra-bk citado anteriormente nunca foi criado.

## Estado após a execução de 05/09/2026

- Etapa 1 concluída: Vite 6.4.3, Anime.js empacotado, conteúdo em `content/*.json`, mídia otimizada (vídeo de 9,3 MB, poster do próprio vídeo, fotos em JPEG e WebP), Montserrat local com licença, favicon, ícone iOS, imagem de compartilhamento e dados estruturados. Testes unitários e de produção em navegador passam. Guia em docs/OPERACAO.md.
- Etapa 2 concluída: repositório criado e workflow de build, testes e deploy no GitHub Actions.
- Etapa 3 adaptada: hospedagem no GitHub Pages em vez de Cloudflare Pages, porque a conexão com a Cloudflare exige login no navegador e o GitHub já concentra código e publicação. O build usa caminhos relativos e pode migrar sem alteração da interface.
- Molde de módulos extras (promoções, avisos e informações) implementado com ativação por data; exemplos desligados.
- Vídeo inspecionado: mostra recepção, consulta com análise facial em tablet, fotografia clínica e procedimento injetável. Uma paciente aparece identificável em quase todos os cortes; há áudio. Pendente: autorização de imagem da paciente e validação da Dra. quanto às regras de publicidade do CFO.
- Ainda pendente para divulgação: CRO/UF (`registro`), revisão dos textos, aprovação do vídeo e troca de `indexar` para `true`.

Restrição definida pelo usuário: começar sem custos de hospedagem ou domínio. Não existe domínio registrado. Domínio próprio fica para uma etapa futura. A proposta original era GitHub + Cloudflare Pages Free. A execução usou GitHub Pages (gratuito, endereço github.io); a migração para Cloudflare ou domínio próprio continua possível sem reconstruir o site.

## Estado verificado

- Protótipo local em HTML, CSS e JavaScript com Anime.js 4.0.2.
- Identidade digital aprovada; reconstrução do logo ainda pode ser refinada.
- 18 procedimentos, cards interativos, vídeo com início automático sem som ao entrar na tela e agendamento ao final.
- Testes existentes para desktop/mobile, toque/teclado, movimento reduzido, conteúdo sem JavaScript e reprodução do vídeo.
- A pasta ainda não é um repositório Git; histórico, conteúdo e visibilidade do remoto não foram inspecionados.
- package.json não possui comando de build. index.html usa arquivo de node_modules diretamente.
- WhatsApp real com mensagem preenchida, Instagram com ícone e endereço integrados; aviso demonstrativo e link interno do rodapé removidos. Noindex permanece ativo até publicação aprovada.
- Vídeo original de aproximadamente 76 MB; ainda sem versão otimizada e poster próprio.
- Não há CMS, domínio configurado, métricas ou versão pública. CRO/UF e especialidades registradas ainda pendentes; contatos recebidos em docs/DADOS-PROFISSIONAIS.md.

## Arquitetura proposta

Preservar a interface atual e adicionar Vite para empacotar CSS, JavaScript e Anime.js, gerando dist/. Essa é uma adaptação da proposta inicial de Next.js: nesta etapa a home já funciona como site estático e não precisa de uma migração para React para ser publicada.

GitHub guarda o código; Cloudflare Pages executa o build e entrega a versão pública no subdomínio gratuito pages.dev. Exemplo de nome desejado: dra-barbara-kitadani.pages.dev, sujeito à disponibilidade e ainda não criado. Essa proposta substitui a hospedagem paga na Vercel. Não adicionar serviços pagos ou com cobrança por consumo nesta fase.

O painel editorial continua como parte pendente do escopo original. A proposta de CMS é Sanity, ainda a validar com a rotina da Dra. Conteúdo deve ser estruturado por perfil, procedimentos, mídia, contatos e configurações. Publicação do CMS deve atualizar o site por novo build ou integração equivalente, sem exigir edição de HTML pela cliente. Tokens de escrita nunca entram no navegador.

## Etapa 1 — preparar uma versão publicável

1. Criar scripts de desenvolvimento, build e preview, com dependências fixadas pelo lockfile.
2. Importar Anime.js pelo empacotador; eliminar a dependência pública de caminhos node_modules.
3. Organizar mídia aprovada em assets/public e gerar imagens responsivas, fonte local licenciada, favicon e poster do vídeo.
4. Criar vídeo comprimido para web, preservando o original no acervo. Cada arquivo no Cloudflare Pages pode ter no máximo 25 MiB; o MP4 atual de aproximadamente 76 MB não pode ser publicado diretamente. Mirar uma versão significativamente menor que esse teto e avaliar a qualidade em conexão móvel. Não contratar armazenamento de vídeo externo nesta fase.
5. Publicar somente dist/. Não incluir docs, estudos visuais, testes, arquivos Word ou originais não utilizados no artefato público. Remover o link de estudo visual do rodapé de produção.
6. Separar conteúdo e configuração de apresentação, preparando a futura conexão com o CMS.
7. Testar a saída de produção, e não apenas o servidor do protótipo: imagens, animações, rotação dos cards e autoplay.

Entrega: build reproduzível localmente, mantendo o visual aprovado.

## Etapa 2 — versionar no GitHub

1. Verificar acesso, visibilidade e histórico do repositório informado antes de conectar a pasta.
2. Se houver histórico remoto, usar uma cópia de trabalho que o preserve e incorporar os arquivos locais. Se estiver vazio, inicializar e criar o primeiro commit. Não sobrescrever histórico remoto.
3. Revisar o conjunto exato de arquivos. Ignorar node_modules, dist, capturas, caches e arquivos locais de credenciais; manter package-lock.json e exemplo de configuração sem segredos.
4. Definir o que entra no repositório: código e derivados aprovados; acervo original pode permanecer fora dele. Não excluir originais locais ao organizar versionamento.
5. Criar commit revisável e enviar quando a execução desse passo for autorizada.
6. Preparar integração contínua: npm ci, build e testes em navegador. Adaptar os testes para o Chromium instalado pela CI em vez de depender do Chrome do Windows.

Entrega: código versionado, histórico preservado e checks de build/testes.

## Etapa 3 — link de revisão

1. Criar ou usar uma conta Cloudflare no plano gratuito e definir o responsável. Autorizar a integração apenas com o repositório do projeto.
2. Conectar somente o repositório do projeto, configurar npm run build e saída dist/.
3. Gerar preview para revisão da Dra. Manter noindex no preview; isso não equivale a privacidade. Usar proteção de acesso caso o material não deva ficar acessível por link.
4. Validar no navegador interno do Instagram, Safari/iPhone e Chrome/Android reais. Testes em viewport mobile no Chrome não substituem esses aparelhos.
5. Revisar títulos, descrições dos procedimentos, vídeo, áudio e dados profissionais. Confirmar direitos de uso do material selecionado para divulgação.

Entrega: link de revisão funcional, sem agendamento fictício apresentado como real.

## Etapa 4 — lançamento no endereço gratuito

1. Definir o nome disponível do subdomínio pages.dev e receber WhatsApp com DDI e DDD, CRO/UF, especialidades registradas, endereço, horários e Instagram.
2. Conectar o agendamento ao WhatsApp e retirar os avisos de demonstração.

   Mensagem padrão definida pelo usuário: “Olá, Dra. Barbara! Conheci seu trabalho e gostaria de agendar uma avaliação.” Link já implementado para 5512988978229; o envio é confirmado pela pessoa no WhatsApp.
3. Preparar título e descrição de busca, imagem de compartilhamento, URL canônica, favicon, sitemap e robots. Remover noindex somente da produção aprovada.
4. Definir os dados efetivamente coletados e o aviso de privacidade correspondente. Não adicionar pixels publicitários sem decisão de campanha e configuração de privacidade.
5. Conferir HTTPS e endereço canônico usando a URL pages.dev criada pela hospedagem. Não é necessário comprar domínio nem configurar DNS próprio nessa etapa.
6. Fazer verificação final e publicar a versão aprovada. Manter caminho de rollback para uma versão anterior.
7. Colocar o endereço na bio quando o fluxo de contato estiver validado.

Entrega: site público com endereço gratuito, contato real e compartilhamento correto. No futuro, conectar domínio próprio e atualizar URLs canônicas, sitemap e redirecionamentos, sem reconstruir a interface.

## Etapa 5 — autonomia e divulgação

- Implementar e testar o CMS: editar, visualizar rascunho, publicar, substituir mídia e recuperar conteúdo. O projeto não estará completo quanto à autonomia da cliente antes dessa entrega.
- Definir se o CMS deve estar pronto no primeiro lançamento ou se haverá uma fase inicial explicitamente mantida pelo desenvolvedor.
- Configurar métricas adequadas: visitas e cliques no contato. Clique em WhatsApp não comprova conversa ou consulta; agendamentos efetivos dependem da confirmação da equipe.
- Preparar links com origem de campanha e imagem de compartilhamento. Planejamento e execução de anúncios pagos constituem uma etapa específica, com orçamento próprio.
- Entregar manual curto, acesso às contas e rotina de manutenção/backup.

## Custos e titularidade

Meta inicial: R$0 de hospedagem e endereço, usando os limites gratuitos de GitHub e Cloudflare Pages, site estático e link simples de WhatsApp. Free Pages inclui 500 builds por mês e limite de 25 MiB por arquivo, conforme consulta de 05/09/2026. CMS permanece no escopo, mas sua solução gratuita e limites ainda precisam ser avaliados; não prometer gratuidade irrestrita de serviços futuros. Recomenda-se que a Dra. tenha acesso administrativo às contas.

A alternativa anterior de Vercel Pro foi retirada da proposta inicial devido ao requisito de custo zero. Não há contratação ou deploy realizado. Domínio próprio e anúncios pagos só entram se forem desejados e orçados no futuro.

## Fontes oficiais consultadas

- Cloudflare Pages: https://www.cloudflare.com/products/pages/
- Integração com Git e endereço pages.dev: https://developers.cloudflare.com/pages/get-started/git-integration/
- Limites gratuitos e tamanho de arquivo: https://developers.cloudflare.com/pages/platform/limits/

- Vite na Vercel e previews ligados ao Git: https://vercel.com/docs/frameworks/frontend/vite
- Restrição de uso comercial do Hobby: https://vercel.com/docs/plans/hobby
- Preços da Vercel: https://vercel.com/pricing

## Próxima decisão

Próximo passo técnico: preparar build e mídia para o Cloudflare Pages Free. Para publicar, será necessário acesso à conta Cloudflare e integração com o GitHub. WhatsApp, Instagram e endereço recebidos e integrados; CRO/UF e revisão final continuam pendentes. Domínio próprio não é necessário. Autonomia via CMS continua como entrega pendente, não esquecida.
