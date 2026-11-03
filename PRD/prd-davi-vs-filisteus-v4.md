# PRD v4 — Davi vs Filisteus

2026-11-02 · Danilo Gomes Nolêto

Davi vs Filisteus passa a ser um jogo mobile de plataforma e ação em pixel art, cômico, em quatro fases. Este PRD substitui por inteiro o PRD v3 e a spec de mecânica: a mecânica de estilingue, a tenda como vida, o rubber hose e as referências a Angry Birds, Worms e Cuphead saem do projeto.

## Como ler este PRD

Cada item está marcado com o seu nível de certeza, para que nenhuma sugestão seja lida como decisão.

- **[Decidido]**: definido por Danilo.
- **[Proposto]**: sugestão de design, ainda sem aprovação.
- **[Pendente]**: precisa de decisão ou de teste.

Todo número deste documento é ponto de partida até ser testado em Android real.

## Visão geral

O jogador conduz Davi de pastor a herói de Israel, com cajado, funda e muito humor de desenho animado.

| Campo | Valor |
| --- | --- |
| Nome | Davi vs Filisteus |
| Gênero | Plataforma de ação 2D com rolagem lateral e pulo [Decidido] |
| Plataforma | Android primeiro; iOS e web depois da primeira versão [Proposto] |
| Motor | Godot 4 [Decidido] |
| Orientação | Paisagem [Proposto] |
| Referências de tom | Earthworm Jim e Metal Slug [Decidido] |
| Base narrativa | 1 Samuel 17 e 18 |
| Objetivo principal | Publicar em loja; aprendizado e portfólio vêm como consequência [Decidido] |

As referências valem pelo ritmo e pela comédia. Nenhum personagem, sprite ou piada será copiado delas.

**Pilares do jogo:**

1. **Simples de jogar:** mover, pular, bater e, quando a barra encher, soltar o especial.
2. **Engraçado de olhar:** toda ação importante pode ter uma reação cômica.
3. **Fiel à história:** o humor fica nas reações, e os fatos centrais da narrativa bíblica são preservados.

## Público, tom e limites do humor

O público é infantil e o humor vai do cômico ao hilário [Decidido]. Mantemos a faixa de 8 a 12 anos do PRD anterior [Decidido], com partida rápida e pouco texto.

**Exemplos de humor** [Decidido]:

- Quando Golias cai, os filisteus fazem a expressão de grito de desenho animado.
- Alguns filisteus levam tamanho susto que a alma sai do corpo.

**Limites** [Proposto]:

- Sem sangue, ferimentos ou mortes mostradas. Derrotado é quem cai tonto, foge ou desmaia de susto.
- A alma que sai do corpo é susto, não morte: ela volta, e o soldado foge.
- A decapitação de Golias (1 Sm 17:51) fica fora do jogo. Davi apenas pega a espada.
- O contexto bíblico dos 100 filisteus (1 Sm 18:25-27) não é mostrado nem citado no jogo.
- O humor nunca ridiculariza a fé ou o texto bíblico. A graça está nas situações e nas expressões.
- Sem humor escatológico. Earthworm Jim tem esse tipo de piada, mas aqui ela fica de fora.

## Mecânica central

Davi tem dois ataques: um golpe básico e um especial de funda que depende de uma barra de energia [Decidido].

**Controles** [Proposto, salvo os botões de movimento, que são decisão]:

| Lado da tela | Comando | Ação |
| --- | --- | --- |
| Esquerda | Botões esquerda e direita | Mover Davi |
| Direita | Pular | Pular, com salto mais alto ao segurar |
| Direita | Golpe | Atacar com o cajado ou a espada |
| Direita | Funda | Acionar o especial com a barra cheia e escolher o lado |

**Ataques:**

| Ataque | Quando | Como funciona |
| --- | --- | --- |
| Cajado | Fases 1 a 3 [Decidido] | Golpe corpo a corpo que derrota inimigos comuns e atordoa chefes [Decidido], sem custo de energia |
| Espada | Fase 4 [Decidido] | Substitui o cajado, com alcance e dano maiores [Proposto] |
| Funda | Todas as fases, com barra cheia [Decidido] | Golpe grande que pega tudo de um lado, direita ou esquerda [Decidido]; o jogador escolhe o lado em até 2 segundos [Decidido] e o golpe gasta a barra [Proposto] |

**Barra de energia:**

- Enche com muita energia acumulada e libera a funda [Decidido].
- Resgatar uma ovelha dá muita energia [Decidido].
- Fora das lutas contra chefes, acertar inimigos dá pouca energia [Decidido].

**Acionar a funda:** ao apertar o botão, o jogador tem 2 segundos para decidir o lado do ataque [Decidido].

1. Davi gira a funda e duas setas aparecem, uma de cada lado [Proposto].
2. Os inimigos param e reagem durante a escolha, e nenhum ataque acerta Davi [Proposto].
3. O jogador toca em uma seta, e o golpe sai na hora, sem esperar os 2 segundos [Proposto].
4. Sem escolha, o golpe vai para onde Davi está olhando [Proposto].

**Vida de Davi** [Proposto]:

- Três corações por tentativa, sempre mostrados como ícones.
- Ao perder os três, Davi volta ao último ponto de controle, sem penalidade.
- Tentativas ilimitadas, para respeitar o público infantil.
- Depois de levar um golpe, Davi fica invulnerável por um instante.

**Ajudas de controle** [Proposto]: pulo aceito pouco depois de sair da beirada, comando guardado por um instante antes de tocar o chão e áreas de colisão generosas a favor do jogador. Isso compensa a falta de botão físico.

**Fora do jogo:** menu de upgrades, XP e pontos para distribuir [Proposto].

**Evolução de Davi:** a cada fase, Davi fica mais forte [Decidido]. O ganho é automático ao vencer o chefe, sem menu [Decidido].

| Vitória | Ganho [Decidido] |
| --- | --- |
| Leão | Um coração a mais |
| Urso | Barra de energia enche mais rápido |
| Golias | Espada, com alcance e dano maiores [Decidido] |

## Ovelhas teimosas

As ovelhas alimentam a funda e são o principal gerador de piadas do jogo. Elas são teimosas: não ficam paradas, mas também não fogem de Davi [Decidido].

**Comportamento** [Proposto]:

- Andam para onde querem, param para comer e mudam de direção sem aviso.
- Podem subir em lugares altos ou entrar em lugares chatos de alcançar.
- Davi resgata uma ovelha ao encostar nela. Não é preciso perseguir de verdade.
- Ao ser resgatada, a ovelha dá muita energia e vai para a pochete de Davi.

**Variações para uma piada por tipo** [Proposto]:

| Ovelha | Teimosia |
| --- | --- |
| Comilona | Não sai do capim até o último instante |
| Dorminhoca | Dorme em cima de um obstáculo |
| Escaladora | Sempre aparece em um ponto alto |

**Ovelha mascote** [Proposto]: a mesma ovelha teimosa escapa da pochete de Davi nas fases 3 e 4. Isso explica sua presença no Vale de Elá e mantém a energia disponível fora do pasto.

**A pochete sem fundo:** a pochete é o alforje de pastor de 1 Samuel 17:40 e a piada que atravessa o jogo inteiro. Ela sempre fica do mesmo tamanho, e ninguém explica como as ovelhas cabem ali.

| Quando | O que acontece | Status |
| --- | --- | --- |
| Primeira ovelha da fase 1 | Davi pega a ovelha com uma mão, abre o zíper com a outra e a enfia com três toques | [Decidido] |
| Demais ovelhas | Versão curta, com menos de 1 segundo e sem tirar o controle do jogador | [Proposto] |
| Início da fase 3 | Cena do sentinela, descrita abaixo, uma única vez no jogo | [Decidido] |
| Golpe final em Golias | Davi tira uma ovelha da pochete, olha para ela, devolve e aí tira a pedra | [Decidido] |
| Final do jogo | Davi abre a pochete e todas as ovelhas saem em fila, sem parar | [Decidido] |

**Cena do sentinela** [Decidido]: ao chegar ao exército, Davi encontra um sentinela quase dormindo no posto. A ovelha solta um balido, ele acorda e vê Davi guardar a ovelha na pochete. Incrédulo, ele olha para a tela, como se perguntasse ao jogador "você viu isso também?", e volta a encarar Davi, perplexo.

**Regras da cena** [Proposto]:

- A piada é escondida: o destaque nunca é o sentinela, e não há zoom, pausa ou som de destaque.
- O sentinela é israelita [Decidido], porque Davi chega ao acampamento de Saul (1 Sm 17:20-22). Assim ele fica fora da luta.
- A ovelha fica no caminho, para que Davi a resgate naturalmente, com o jogador no controle.
- A graça vem do tempo: olhos grandes, boca aberta e cerca de 2 segundos encarando a tela.
- A expressão precisa ser aprovada na tela do celular, no tamanho real do sprite.

## Fases

O jogo tem quatro fases, sempre com um clímax. Golias cai com a funda, e a espada só chega como recompensa dessa vitória [Decidido].

| Fase | Cenário [Proposto] | Objetivo | Inimigos | Clímax | Arma |
| --- | --- | --- | --- | --- | --- |
| 1. O pastor | Pastos e rochas | Coletar ovelhas [Decidido] | Hienas e chacais [Decidido] | Chefe Leão [Decidido] | Cajado |
| 2. A ravina | Savana e ravinas | Avançar e proteger o rebanho [Proposto] | Hienas e lobos [Decidido] | Chefe Urso [Decidido] | Cajado |
| 3. Vale de Elá | Acampamento e vale | Enfrentar o gigante [Decidido] | Filisteus [Proposto] | Chefe Golias [Decidido] | Cajado, com a funda no golpe final |
| 4. Os 100 filisteus | Campo de batalha | Sobreviver [Decidido] | Filisteus em ondas [Decidido] | Contador chega a 100 [Decidido] | Espada de Golias |

**Base bíblica:**

- Davi protegia o rebanho de leões e ursos (1 Sm 17:34-36).
- Ele recusa a armadura de Saul e vai com cajado, funda e cinco pedras (1 Sm 17:38-40).
- Vence Golias com pedra e funda, sem espada na mão (1 Sm 17:49-50), e depois toma a espada do gigante (17:51).

**Lutas contra Leão e Urso:** um golpe de funda tira toda a vida do chefe [Decidido]. Para isso, Davi precisa resgatar ovelhas durante a luta, e os chefes ignoram as ovelhas e focam em Davi [Decidido].

- Na luta, a barra enche só com ovelhas, e o cajado apenas atordoa o chefe [Decidido].
- Novas ovelhas entram na arena depois de um golpe errado, para a luta nunca travar [Proposto].

**Regras da fase 3** [Proposto]:

- Golias muda de ataque conforme a luta avança.
- Cada golpe de funda tira 1/3 da vida de Golias [Decidido]. O cajado não basta, então ele só cai na terceira pedra. Para respeitar a pedra única de 1 Sm 17:49, a primeira derruba o escudo do escudeiro, a segunda derruba o capacete e só a terceira acerta a testa [Decidido]. Antes da pedra, entra a piada da ovelha na pochete; o tempo dela será ajustado em teste.
- Depois da pedrada: Golias cai, os filisteus gritam e a alma de alguns sai do corpo.

**Regras da fase 4:**

- Um contador mostra quantos dos 100 filisteus já foram derrotados [Decidido].
- Os 100 não aparecem juntos: vêm em ondas [Decidido].
- Limite inicial de 6 a 8 inimigos na tela [Proposto], ajustável depois do teste em Android.
- O ritmo cresce a cada 25 derrotados, com um soldado diferente ou uma gag [Proposto].

**Final** [Proposto]: Davi é aclamado pelo povo pela vitória contra os 100 filisteus [Decidido], com a canção de 1 Sm 18:6-7. Antes de ele virar rei, Davi abre a pochete, todas as ovelhas saem em fila e uma tela de encerramento fecha o jogo.

## Inimigos comuns

Cada animal tem uma personalidade cômica própria, e as hienas aparecem nas fases 1 e 2 [Decidido]. Leão africano é usado no lugar do asiático, por ser mais fácil de reconhecer [Decidido].

| Inimigo | Fases | Personalidade [Decidido] | Resistência [Decidido] |
| --- | --- | --- | --- |
| Hiena | 1 e 2 | Boba, ri o tempo todo, meio relaxada, um olho menor que o outro e língua sempre para fora | 2 golpes |
| Chacal | 1 | Baixinho e briguento, com cara de buldogue | 3 golpes |
| Lobo | 2 | Raivoso e bravo, até ver a funda | 3 golpes, mais rápido |

**Hiena com design próprio** [Decidido]: a personalidade pode lembrar as hienas de O Rei Leão, mas desenho e nome serão originais. A hiena-listrada, nativa da região, resolve as duas coisas: é fiel à época e tem visual diferente das hienas pintadas do filme.

**Lobos com medo:** quando a funda é acionada, os lobos veem o tamanho do golpe, perdem a pose, abraçam quem está mais perto e tremem de medo [Decidido].

**Regras da reação** [Proposto]:

- Os animais do lado oposto ao golpe continuam na reação por alguns instantes, sem atacar.
- Lobo sozinho, e chacal ou hiena sem lobo por perto, se ajoelha, junta as mãos e começa a orar [Decidido].
- Na v1, o abraço em par é só lobo com lobo e lobo com hiena, para limitar as animações.

**Filisteus:** nunca oram, porque não creem no Deus verdadeiro [Decidido]. Durante a escolha, eles reagem só com a expressão de susto [Decidido]. A alma saindo do corpo fica reservada para a queda de Golias [Decidido].

## Direção de arte e cenários

O jogo será em pixel art, com personagens simples sobre cenários ricos, e todo o design será refeito [Decidido]. A imagem de referência guia o estilo sem limitar o resultado [Decidido].

**O que aproveitar da imagem** [Proposto]:

- Camadas de fundo com profundidade e movimento em parallax.
- Cenário denso, com vegetação e rochas em primeiro plano.
- Personagem legível, com silhueta clara contra o fundo.
- Pontos de luz que orientam o olhar para o que é importante.

**O que muda:** nada de floresta encantada ou magia. O cenário retrata a época de Israel: savana, região rochosa e deserto com oásis, para o visual não ficar pobre [Decidido].

| Fase | Ambiente [Proposto] | Riqueza visual [Proposto] |
| --- | --- | --- |
| 1 | Pastos e rochas ao amanhecer | Capim, flores, cercados de pedra |
| 2 | Savana e ravinas ao entardecer | Acácias, cavernas, olhos brilhando na sombra |
| 3 | Vale de Elá, com acampamentos | Tendas, estandartes, riacho com pedras |
| 4 | Deserto com oásis, à noite | Palmeiras, fogueiras, céu estrelado |

**Base técnica da arte** [Proposto]:

- Resolução interna de 640×360, que amplia por inteiro para 720p e 1080p.
- Tamanho inicial: Davi com cerca de 48 px, Leão e Urso com cerca de 96 px e Golias com cerca de 128 px.
- Paleta única para todo o jogo, definida antes do primeiro sprite final.
- Proporções grossas: cabeça grande e membros largos, para ler bem na tela do celular.

A interface segue o padrão visual: ícones e imagens, pouco texto e nenhum significado transmitido só pela cor.

**Produção da arte:** a arte será gerada por IA, e Danilo está estudando as ferramentas, de preferência com MCP e custo zero [Decidido]. Se não for viável, ele produz à mão [Decidido].

## Escopo

A primeira versão é o jogo completo, com quatro fases e três chefes, e a animação é o maior custo dele [Proposto]. Cada piada visual é trabalho de arte, então as gags entram na lista de produção como qualquer outro item.

**Dentro da v1** [Proposto]:

- As quatro fases, os três chefes, os filisteus e as ovelhas.
- Menu, seleção de fase, pausa, vitória e derrota.
- Progresso salvo no aparelho e funcionamento offline.
- Efeitos sonoros e música.

**Fora da v1** [Proposto]:

- XP, loja, customização, ranking online e multiplayer.
- Texto extenso e dublagem.
- Fases além das quatro.

**Inventário de personagens** [Proposto, a confirmar na produção]:

| Personagem | Papel | Animações mínimas |
| --- | --- | --- |
| Davi | Jogador | Parado, correr, pular, cair, golpe, funda, guardar ovelha, levar golpe, derrota, vitória |
| Ovelha | Coleta | Andar, comer, balir, escapar, resgate e uma gag por variação |
| Lobo | Inimigo fase 2 | Andar, atacar, levar golpe, abraçar e tremer, orar |
| Filisteu | Inimigo fases 3 e 4 | Andar, atacar, levar golpe, susto, fugir |
| Leão | Chefe | Parado, 2 ou 3 ataques com aviso, levar golpe, derrota |
| Urso | Chefe | Parado, 2 ou 3 ataques com aviso, levar golpe, derrota |
| Golias | Chefe | Parado, 3 ataques com aviso, levar golpe, queda |
| Sentinela | Piada da fase 3 | Cochilar, acordar, olhar para a tela, olhar para Davi |
| Hiena | Inimigo fases 1 e 2 | Andar, rir, atacar, levar golpe, ser abraçada, orar |
| Chacal | Inimigo fase 1 | Andar, atacar, levar golpe, fugir, orar |

**Como conter o custo** [Proposto]:

- Cajado e espada usam as mesmas animações de Davi, trocando só a camada da arma.
- Variações de filisteu mudam capacete e cor, sem novas animações.
- Cada chefe recebe no máximo três ataques na v1.
- Hienas reaparecem na fase 2, sem novas animações além do abraço.

## Requisitos

Estes são os requisitos da v1 [Proposto], em ordem de construção do jogo.

| ID | Requisito | Prioridade |
| --- | --- | --- |
| RF01 | Mover Davi com botões na tela | Alta |
| RF02 | Pular com altura variável | Alta |
| RF03 | Golpear com a arma atual | Alta |
| RF04 | Encher a barra por ovelhas e por acertos | Alta |
| RF05 | Disparar a funda com a barra cheia, pegando tudo de um lado | Alta |
| RF06 | Ovelhas teimosas com movimento próprio | Alta |
| RF07 | Vida em corações e ponto de controle | Alta |
| RF08 | Inimigos comuns com ataque e reação ao golpe | Alta |
| RF09 | Chefes com ataques avisados e derrota | Alta |
| RF10 | Golias cai somente com a funda | Alta |
| RF11 | Trocar cajado por espada depois de Golias | Alta |
| RF12 | Contador de 100 filisteus em ondas | Alta |
| RF13 | Reações cômicas do exército | Média |
| RF14 | Salvar a fase alcançada no aparelho | Média |
| RF15 | Ovelha mascote nas fases 3 e 4 | Baixa |
| RF16 | Guardar ovelha na pochete, com cena completa e versão curta | Média |
| RF17 | Cena do sentinela uma única vez, no início da fase 3 | Média |
| RF18 | Ovelha antes da pedra no golpe final em Golias | Média |
| RF19 | Fila de ovelhas saindo da pochete no final | Média |
| RF20 | Davi fica mais forte automaticamente a cada chefe vencido | Alta |
| RF21 | Animais abraçam, tremem ou oram quando a funda é acionada | Média |
| RF22 | Escolher o lado da funda em até 2 segundos | Alta |
| RF23 | Leão e Urso caem com um golpe de funda, com ovelhas na luta | Alta |
| RF24 | Golias cai com três golpes de funda | Alta |

**Requisitos de mobile:**

| Área | Requisito |
| --- | --- |
| Toque | Vários dedos ao mesmo tempo, sem depender de mouse ou teclado |
| Botões | Pelo menos 44×44 pt, com área de toque maior que o desenho |
| Telas | Testar em 16:9 e 20:9, respeitando notch e área segura |
| Pausa | Pausar sozinho ao trocar de app ou receber notificação |
| Offline | Funcionar sem internet depois de instalado |
| Tamanho | Build abaixo de 50 MB |

## Base técnica e repositório

O jogo continua em Godot, e o código atual do repositório quase todo será substituído [Proposto].

| Item atual | Destino [Proposto] |
| --- | --- |
| Tratamento de toque e foco em `David.gd` | Reaproveitar a lógica como referência |
| Mira, trajetória e tiras do estilingue | Remover |
| `Stone.gd` | Reaproveitar a ideia na pedra da funda |
| Phaser em `js/` e `index.html` | Arquivar |
| Artes atuais e de 2013 | Arquivar; só valem como referência de ideia |
| Fontes `.ttf` e textura de 2013 | Não usar sem confirmar a licença |

**Mudanças de projeto no Godot** [Proposto]:

- Viewport de 640×360, escala inteira e filtro de textura Nearest.
- Física de plataforma com `CharacterBody2D`, sem física de projétil como centro do jogo.
- Animações em `AnimatedSprite2D`, com camada separada para a arma.

**Higiene do repositório** [Proposto]: criar `.gitignore`, tirar do versionamento `.godot` e `.fennara/tmp`.

## Marcos e evidência

O primeiro marco testa o controle em Android real, ainda com retângulos no lugar da arte [Proposto]. Essa ordem protege o maior custo do projeto: só se anima o que já se provou divertido.

| Marco | Entrega | Portão |
| --- | --- | --- |
| 1. Controle | Mover, pular e golpear; um lobo | Crianças jogam no Android |
| 2. Leão | Ovelhas, barra, funda e chefe | Diverte sem arte final |
| 3. Arte | Davi, Leão e um cenário finais | Processo e custo aceitos |
| 4. Fases 1 a 3 | Conteúdo, Golias e as gags | Jogo de ponta a ponta |
| 5. Fase final | Os 100 filisteus e o acabamento | Estável em Android real |

Um marco só termina quando o portão dele passa; se o portão falhar, o escopo é revisto antes de seguir.

**Níveis de evidência** [Proposto]: cada resultado registra de onde veio, sem misturar os níveis.

| Nível | Vale para | Não comprova |
| --- | --- | --- |
| Revisão de código | Lógica lida e coerente | Comportamento em execução |
| Execução no desktop | Regras e fluxo de jogo | Toque, desempenho e notch |
| Android real | Toque, FPS, tela e pausa | Diversão para crianças |
| Teste com crianças | Entendimento, frustração e diversão | Estabilidade em outros aparelhos |

**Métricas iniciais** [Proposto]:

| Métrica | Meta |
| --- | --- |
| Desempenho em Android intermediário | Pelo menos 30 FPS constantes |
| Crashes nas fases da v1 | Nenhum conhecido |
| Duração de cada fase | 5 a 8 minutos |
| Tamanho do build | Abaixo de 50 MB |
| Criança entende os controles | Sem explicação de um adulto |

## Publicação

Publicar em loja é o objetivo principal, e a Google Play vem primeiro [Proposto]. Isso acrescenta exigências que precisam entrar no plano antes do lançamento.

| Exigência | O que significa para o jogo |
| --- | --- |
| [Teste fechado](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en) | Conta pessoal criada depois de 13/11/2023 precisa de 12 testadores por 14 dias seguidos antes de ir para produção |
| [Público infantil](https://support.google.com/googleplay/android-developer/answer/9893335?hl=en) | Política de privacidade, dados declarados, sem identificadores do aparelho, e anúncios só com SDK certificado |
| [Taxas](https://www.choicely.com/tutorials/how-much-does-it-cost-to-publish-an-app) | Google Play: US$ 25, pagamento único. Apple: US$ 99 por ano |

A regra de crianças varia por país, e o texto da Google recomenda orientação jurídica. O jogo será gratuito inicialmente [Decidido]. Para simplificar a v1, a proposta é não usar anúncios nem coletar dados [Proposto]. Os 14 dias de teste entram depois do Marco 5.

## Riscos

O maior risco é o volume de animação, seguido da sensação dos botões virtuais.

| Risco | Impacto | Mitigação [Proposto] |
| --- | --- | --- |
| Volume de animação e gags atrasar o jogo | Alto | Inventário fechado, limite de ataques e reaproveitamento de camadas |
| Botões virtuais frustrarem crianças | Alto | Marco 1 em Android real, com ajudas de controle |
| Arte gerada por IA sair inconsistente entre quadros | Alto | Testar o processo em um só personagem antes do elenco |
| Fase 4 repetitiva ou pesada no celular | Médio | Ondas, limite na tela e novidade a cada 25 derrotados |
| Humor desrespeitar a história | Médio | Seguir os limites do humor e revisar as cutscenes |
| Visual próximo demais da imagem de referência | Médio | Usá-la só como direção; criar paleta e sprites próprios |
| Mercado cheio de jogos em pixel art | Médio | Destaque no tema, no humor e nas ovelhas |
| Escopo crescer com novas ideias | Alto | Toda ideia nova entra primeiro em “Fora da v1” |
| Hiena parecida demais com as de O Rei Leão | Médio | Hiena-listrada, com desenho e nome próprios |

## Decisões pendentes

Duas decisões ainda dependem de Danilo; a primeira trava a produção de arte, mas não o Marco 1.

- [ ] **Ferramentas de arte:** quais plataformas de IA serão usadas?
- [ ] **Anúncios:** a v1 gratuita fica sem anúncios?
