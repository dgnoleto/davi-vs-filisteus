# PRD — Davi vs Filisteus
*Product Requirements Document — versão mobile*

> Como usar este template: preencha os campos entre `[ ]`. Os exemplos já preenchidos refletem o que conversamos até aqui — ajuste conforme o projeto evoluir. Esse documento não precisa ficar perfeito na v1; o valor dele é te forçar a decidir coisas *antes* de programar, e servir de referência quando você (ou alguém revisando seu portfólio) perguntar "por que essa decisão?".

---

## 1. Visão geral

| Campo | Valor |
|---|---|
| Nome do jogo | Davi vs Filisteus |
| Gênero | Híbrido: physics-puzzle de estilingue (estilo Angry Birds) **+** duelo de projéteis com inimigos avançando (estilo Worms) |
| Plataforma alvo | Mobile (Android/iOS) via [Capacitor / Godot export] + navegador (PWA) |
| Motor/Stack | [Phaser 3 + Matter.js] ou [Godot 4] |
| Status atual | Protótipo antigo (Phaser + Matter.js, mecânica "estrutura parada" estilo Angry Birds) **descontinuado** — o jogo será reconstruído do zero com a nova mecânica híbrida (seção 4.1). O protótipo antigo fica só como referência de aprendizado (bugs já resolvidos lá — ver seção 12). Arte de 2013 recuperada e elenco completo redesenhado (seção 6.1). |
| Motivação do projeto | Aprendizado de game dev + peça de portfólio no GitHub |

**Resumo de uma frase:** jogo mobile de física onde o jogador usa um estilingue contra inimigos que avançam e atacam de volta (alguns à distância), inspirado na história de Davi e Golias.

---

## 2. Objetivos e métricas de sucesso

**Objetivos do produto:**
- [ ] Demonstrar domínio de física 2D, lógica de jogo e controles touch
- [ ] Ter um build jogável publicado (GitHub Pages e/ou APK de teste)
- [ ] Servir como projeto âncora do portfólio (código limpo, histórico de commits/PRs organizado)

**Métricas de sucesso (mensuráveis):**
| Métrica | Meta |
|---|---|
| FPS mínimo em dispositivo médio (ex: Android intermediário) | ≥ 30 fps constante |
| Tempo de carregamento inicial | < [3]s em conexão 4G |
| Tamanho do build mobile | < [50] MB |
| Fases jogáveis no MVP | [3] a [5] |
| Taxa de crash | 0 crashes conhecidos nas fases do MVP |

---

## 3. Público-alvo

- **Faixa etária:** crianças de 8 a 12 anos (acompanhadas ou não por um adulto)
- **Contexto de uso:** sessões curtas, mobile, provavelmente sem fone de ouvido
- **Nível de habilidade:** jogadores casuais, primeiro contato com jogos de física
- **Implicações de design:** controles simples (um dedo só), feedback visual claro (linha de mira), tolerância a erro (várias pedras por fase), sem texto complexo / dependência de leitura pesada

---

## 3.1 Direção de arte

**Decisão:** redesign visual completo no estilo **rubber hose animation** (técnica de animação do final dos anos 20/início dos 30, era Fleischer Studios/Disney — referência popular atual: Cuphead). Os assets de 2013 deixam de ser arte final e passam a valer só como **referência de pose e composição** (ver seção 6.1).

**Características do estilo a seguir:**
- Contorno preto grosso em todos os elementos
- Membros tubulares, sem cotovelo/joelho rígido — curvam como mangueira
- Olhos grandes em formato "pie-cut" (fatia de torta)
- Mãos com 4 dedos e luva branca (convenção clássica do estilo)
- Squash & stretch constante — até em pose de descanso, o personagem "respira"
- Opcional: filtro sépia/grão leve simulando filme antigo

**Por que faz sentido aqui:** público de 8–12 anos, visual redondo e nada ameaçador, e é um diferencial forte de portfólio — pouca gente usa esse estilo em projeto de aprendizado.

**Risco de escopo a monitorar:** o estilo parece simples mas é trabalhoso — squash & stretch contínuo exige mais variações de pose por personagem do que o vetor "parado" que já existia. Mitigação: validar o estilo num personagem piloto (Leão, que já precisa de arte nova) antes de redesenhar quem já tinha animação pronta (Davi, Golias, Urso, soldados).

---

**Dentro do escopo (v1):**
- [ ] Mecânica de estilingue com linha de mira
- [ ] Sistema de vitória/derrota por fase
- [ ] **Estrutura de fases narrativas** (substitui o "3–5 fases genéricas" da v1 do PRD):
  - Fase 1 — Davi pastor enfrenta o **Leão**
  - Fase 2 — Davi pastor enfrenta o **Urso**
  - Fase 3+ — segue a ideia original: exército filisteu (soldados, arqueiros) culminando no confronto com **Golias**
- [ ] **Sistema de progressão do personagem** (substitui o limite fixo de "5 pedras por fase"): o jogador evolui o Davi entre fases — mais pedras disponíveis, dano maior, ou habilidades novas. Detalhar nas próximas iterações deste PRD: o que sobe de nível (pedras, força, precisão?), e o que desbloqueia isso (completar fase, pontos acumulados, ambos?)
- [ ] Tela de menu inicial
- [ ] Tela de vitória/derrota com opção de reiniciar/avançar
- [ ] Controles touch (substituir mouse por touch nativo)
- [ ] Guia de estilo visual (rubber hose) validado num personagem piloto antes de redesenhar o restante

**Fora do escopo (v1) — guardar pra depois:**
- Loja/customização visual do personagem (já existe arte de menu de customização de 2013 — avaliar se entra na v1 ou fica pra depois)
- Multiplayer ou ranking online
- Mais fases além da progressão Leão → Urso → Filisteus → Golias
- Editor de fases

---

## 4.1 Mecânica de combate (Angry Birds + Worms)

**Mudança importante em relação à v1 deste PRD:** não existem blocos/estruturas paradas para derrubar. Em vez disso, os inimigos **avançam continuamente em direção à tenda de Davi**, e alguns atacam de volta à distância — por isso a referência passa a ser também o **Worms** (duelo de projéteis), não só Angry Birds (física de impacto).

**Tipos de inimigo e comportamento:**
| Inimigo | Tipo de ataque | Comportamento de avanço |
|---|---|---|
| Leão | Corpo a corpo | Avança direto até alcançar a tenda/Davi |
| Urso | Corpo a corpo (cômico) | Avança "desengonçado", mesma lógica do Leão |
| Soldado Lanceiro | À distância (lança) | Avança e lança a lança quando em alcance |
| Soldado Arqueiro | À distância (flecha) | Avança e dispara a flecha quando em alcance |
| Soldado Escudeiro | Nenhum ataque direto | Avança na frente de Golias e **reduz a velocidade de avanço dele** enquanto estiver vivo |
| Golias | À distância (lança) e corpo a corpo (espada) | Avança mais lento enquanto o Escudeiro estiver vivo; mais rápido depois que ele for derrotado |

**Sistema de vida de Davi — a Tenda:** Davi não perde "vida" diretamente. Atrás dele fica a **tenda do acampamento**, e é ela que sofre o dano dos ataques inimigos que acertam o jogador. A tenda tem estágios visuais de dano (ex: intacta → danificada → destruída) e a fase é perdida quando ela é destruída. *(Asset já existe da recuperação de 2013 — `tenda.ai` — precisa de redesign no estilo rubber hose e de variações de dano; ver seção 6.1.)*

**Ovelhas (papel narrativo/visual, não jogável diretamente):**
- Posicionadas entre Davi e o predador na fase do Leão e do Urso
- Comportamento por proximidade: calmas/"good vibes" perto de Davi, assustadas e tentando fugir perto do predador
- Quando o predador correspondente é derrotado, alternam de quadrúpede para bípede e correm em disparada até Davi (referência: Papa-Léguas/Looney Tunes)

**Decisões de design ainda pendentes (preencher antes de programar):**
- [ ] Quantos impactos a tenda aguenta antes de ser destruída? (definir por fase ou fixo?)
- [ ] Todo impacto de projétil inimigo acerta a tenda, ou só os que "passam" pelo Davi? (afeta se o jogador pode ativamente proteger a tenda)
- [ ] Velocidade de avanço de cada inimigo (valores numéricos, não só "rápido/lento")
- [ ] Distância de alcance em que Lanceiro/Arqueiro/Golias disparam o ataque à distância

---

## 5. Requisitos funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF01 | Jogador arrasta a pedra no estilingue e solta para lançar | Alta |
| RF02 | Linha de mira pontilhada visível durante o arrasto | Alta |
| RF03 | Inimigos avançam continuamente em direção à tenda/Davi, cada tipo com velocidade própria | Alta |
| RF04 | Inimigos são eliminados ao serem atingidos (quantidade de acertos a definir por tipo) | Alta |
| RF05 | Jogo detecta vitória (todos os inimigos da fase derrotados antes de atingir a tenda) | Alta |
| RF06 | Inimigos à distância (Lanceiro, Arqueiro, Golias) disparam projétil próprio em direção à tenda/Davi ao entrar em alcance | Alta |
| RF07 | Sistema de vida via Tenda: estágios visuais de dano (intacta → danificada → destruída) | Alta |
| RF08 | Jogo detecta derrota quando a tenda é destruída | Alta |
| RF09 | Soldado Escudeiro reduz a velocidade de avanço do Golias enquanto estiver vivo | Média |
| RF10 | Botão de reiniciar fase | Alta |
| RF11 | Progressão entre fases (Leão → Urso → Filisteus → Golias) | Alta |
| RF12 | Persistência de progresso (fase alcançada, nível do personagem) | Média |
| RF13 | Sistema de progressão do personagem: pontos/XP por fase concluída desbloqueiam upgrade (mais pedras, mais dano, etc.) | Alta |
| RF14 | Tela/menu de status do personagem mostrando nível e upgrades atuais | Média |
| RF15 | Ovelhas mudam de comportamento/expressão conforme proximidade do predador (calma perto de Davi, assustada perto do predador) | Média |
| RF16 | Ovelhas alternam de quadrúpede para bípede e fogem em direção a Davi quando o predador correspondente é derrotado | Baixa (polimento) |
| RF17 | [adicionar conforme necessário] | — |

---

## 6. Requisitos específicos de mobile

Essa seção é a diferença entre "roda no meu navegador" e "funciona como app":

| Área | Requisito |
|---|---|
| **Controles** | Touch único (drag/release); nenhuma dependência de mouse, hover ou teclado |
| **Orientação** | [Paisagem fixa] — recomendado pra jogos de física horizontal como este |
| **Telas/resolução** | Testar em pelo menos 2 aspect ratios (ex: 16:9 e 19.5:9); canvas deve escalar sem cortar UI importante |
| **Área de toque** | Botões com no mínimo ~44x44px (referência de acessibilidade mobile), mesmo que visualmente pareçam menores no desktop |
| **Performance** | Física otimizada para dispositivos médios/fracos; evitar acúmulo de corpos físicos não usados |
| **Tamanho do build** | Monitorar tamanho de assets (sprites, áudio) desde o início |
| **Funcionamento offline** | [Definir: precisa funcionar sem internet após instalado?] |
| **Feedback tátil** | [Opcional: vibração leve ao acertar um inimigo, via Capacitor Haptics] |
| **Pausar/retomar** | Jogo deve pausar corretamente se o app for minimizado (troca de app, notificação, etc.) |
| **Empacotamento** | [Capacitor (wrap do HTML/JS) / export nativo do Godot] |

---

## 6.1 Inventário de assets recuperados (2013)

> Com a decisão de redesign completo (seção 3.1), **nenhum asset abaixo é arte final** — todos passam a valer só como referência de pose/composição pro redesenho no estilo rubber hose.

| Personagem | Concept art (2013) | Animações de referência (2013) | Situação no redesign |
|---|---|---|---|
| Davi | ✅ | Atirando, Descanso, Morrendo | Redesenhar — poses de 2013 servem de referência |
| Golias | ✅ | Andando, Batendo, Morrendo | Redesenhar — poses de 2013 servem de referência |
| Urso | ✅ | Andando, Batendo, Morrendo | Redesenhar — poses de 2013 servem de referência |
| **Leão** | ✅ (revisar — ver nota abaixo) | ❌ nenhuma | **Redesenhar do zero — sem referência de pose de 2013. Candidato a personagem piloto do novo estilo** |
| Soldados 1–4 / escudo | ✅ | Andando, Batendo, Morrendo | Redesenhar — poses de 2013 servem de referência |
| Arqueiro | ✅ | Andando, Atirando, Morrendo | Redesenhar — poses de 2013 servem de referência |
| Ovelhas | ✅ | Comendo, Dormindo | Redesenhar — poses de 2013 servem de referência |
| **Tenda** | ✅ (`tenda.ai`, recuperada) | ❌ nenhuma | **Redesenhar + criar estágios de dano (intacta/danificada/destruída) — agora é a peça central do sistema de vida (seção 4.1), não só cenário** |

⚠️ **Atenção — direitos de imagem antes de publicar:**
- A pasta de referências/moodboard de 2013 (capturas de outros jogos, fotos de banco de imagem) **não deve ir para o repositório público** — é material de estudo, não asset original.
- O arquivo de concept art do Leão contém uma imagem de referência com marca d'água de banco de imagens — revisar e não usar como base de pose, mesmo internamente, sem confirmar a origem.
- Uma pasta de textura (papel kraft) usada nos menus de 2013 parece ser de um pacote de vetores grátis de terceiros — confirmar licença ou refazer a textura antes de publicar.
- As fontes (`.ttf`) também precisam ter a licença confirmada antes de ir para um repositório público (nem toda fonte "grátis" permite redistribuição como arquivo).

---

## 7. Requisitos técnicos

- **Stack principal:** [Phaser 3 + Matter.js / Godot 4]
- **Distribuição web:** GitHub Pages (build estático)
- **Distribuição mobile:** [Capacitor → APK de teste] ou [export Android/iOS direto do Godot]
- **Compatibilidade mínima:** [Android 8+ / iOS 14+] *(ajustar conforme testes reais)*
- **Armazenamento local:** progresso salvo via [localStorage do navegador / Capacitor Preferences / Godot user://]
- **Versionamento:** Git + GitHub, fluxo de branch por feature + PR (ver fluxo já combinado)

---

## 8. Fluxo de telas (UX)

```
[Menu Inicial] → [Seleção de Fase] → [Fase em jogo] → [Vitória] → próxima fase
                                            ↓
                                        [Derrota] → reiniciar fase
```

- [ ] Wireframe ou rascunho de cada tela (pode ser desenho à mão, foto, ou Figma simples)
- [ ] Definir paleta de cores e fonte (mesmo que provisória)

---

## 9. Critérios de aceite (Definition of Done)

Uma fase é considerada "pronta" quando:
- [ ] Carrega sem erros no console
- [ ] Funciona em pelo menos um dispositivo Android real (não só emulador/desktop)
- [ ] Vitória e derrota disparam corretamente em todos os ângulos de lançamento testados
- [ ] Não há corpos físicos "fantasmas" acumulando após múltiplas tentativas
- [ ] UI legível e clicável em tela pequena (testar em ~5.5")

---

## 10. Riscos e dependências

| Risco | Impacto | Mitigação |
|---|---|---|
| Física se comportar diferente entre desktop e mobile (performance) | Médio | Testar em dispositivo real desde as primeiras fases, não só no navegador do PC |
| Complexidade de empacotar pra mobile (Capacitor/Godot export) consumir tempo do aprendizado de gameplay | Médio | Validar o pipeline de build cedo, com uma fase simples, antes de polir o jogo todo |
| Escopo crescer demais (sistema de pontuação, loja, etc.) e o MVP nunca terminar | Alto | Revisar a seção 4 (fora de escopo) sempre que surgir uma ideia nova |
| Redesign completo em rubber hose consumir muito mais tempo que o esperado (squash & stretch é trabalhoso) | Alto | Validar o estilo só no Leão antes de redesenhar os demais; se o ritmo for inviável, reavaliar para um estilo híbrido |
| Reconstruir o jogo do zero perder correções de física já resolvidas no protótipo antigo (estilingue, limpeza de corpos, etc.) | Médio | Consultar a seção 12 (notas de aprendizado) e o histórico de commits do protótipo antigo como referência ao reimplementar |
| Mecânica de avanço + ataque à distância (estilo Worms) ser significativamente mais complexa que o "Angry Birds parado" original, atrasando o MVP | Alto | Implementar primeiro com 1 só tipo de inimigo (ex: Leão) e validar o "loop" completo (avançar → atacar → tenda toma dano → derrota) antes de adicionar os demais tipos |

---

## 11. Roadmap de alto nível

| Etapa | Entregável |
|---|---|
| 1 | Elenco de personagens redesenhado (✅ feito — Davi, Leão, Urso, Ovelha, Soldados, Golias) |
| 2 | Projeto novo do zero: estrutura de pastas + `index.html`/`src` (consultar o protótipo antigo só como referência de bugs já resolvidos) |
| 3 | Mecânica de estilingue + linha de mira (reimplementar, aproveitando aprendizados do protótipo antigo) |
| 4 | Sistema de avanço de inimigo (1 tipo só, ex: Leão) — validar o "loop" completo de ponta a ponta |
| 5 | Tenda como sistema de vida: estágios de dano + condição de derrota |
| 6 | Ataque à distância (Lanceiro/Arqueiro/Golias disparando projétil) |
| 7 | Comportamento das Ovelhas (proximidade + fuga cômica bípede) |
| 8 | Controles touch nativos (substituir mouse) |
| 9 | Fase 1 — Leão completa (arte + mecânica) |
| 10 | Fase 2 — Urso completa |
| 11 | Sistema de progressão do personagem (upgrade entre fases) |
| 12 | Fases 3+ — Filisteus (Lanceiro/Arqueiro/Escudeiro) e Golias |
| 13 | Empacotamento mobile (build de teste instalável) |
| 14 | Publicação no portfólio (README, GIF/vídeo de gameplay, link do Pages) |

---

## 12. Notas de aprendizado (seção pessoal, opcional)

> Espaço pra registrar decisões e o "porquê" delas — ótimo material pra explicar o projeto numa entrevista ou no README.

- [Ex: "Optei por clampar o puxão do estilingue em vez de usar isSensor sozinho porque..."]
- [Ex: "Escolhi Phaser em vez de Godot porque..."]
