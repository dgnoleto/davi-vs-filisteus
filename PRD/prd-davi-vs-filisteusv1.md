# PRD — Davi vs Filisteus
*Product Requirements Document — versão mobile*

> Como usar este template: preencha os campos entre `[ ]`. Os exemplos já preenchidos refletem o que conversamos até aqui — ajuste conforme o projeto evoluir. Esse documento não precisa ficar perfeito na v1; o valor dele é te forçar a decidir coisas *antes* de programar, e servir de referência quando você (ou alguém revisando seu portfólio) perguntar "por que essa decisão?".

---

## 1. Visão geral

| Campo | Valor |
|---|---|
| Nome do jogo | Davi vs Filisteus |
| Gênero | Puzzle de física / estilingue (estilo Angry Birds) |
| Plataforma alvo | Mobile (Android/iOS) via [Capacitor / Godot export] + navegador (PWA) |
| Motor/Stack | [Phaser 3 + Matter.js] ou [Godot 4] |
| Status atual | Protótipo jogável (1 fase, mecânica de lançamento funcionando) |
| Motivação do projeto | Aprendizado de game dev + peça de portfólio no GitHub |

**Resumo de uma frase:** jogo mobile de física onde o jogador usa um estilingue para derrubar estruturas e inimigos inspirados na história de Davi e Golias.

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

## 4. Escopo do MVP

**Dentro do escopo (v1):**
- [ ] Mecânica de estilingue com linha de mira
- [ ] Sistema de vitória/derrota por fase
- [ ] [3–5] fases com dificuldade crescente
- [ ] Tela de menu inicial
- [ ] Tela de vitória/derrota com opção de reiniciar/avançar
- [ ] Controles touch (substituir mouse por touch nativo)

**Fora do escopo (v1) — guardar pra depois:**
- Sistema de pontuação/estrelas por desempenho
- Loja/desbloqueio de personagens
- Multiplayer ou ranking online
- Som e música (ou: versão mínima só com efeitos básicos)
- Mais de [5] fases
- Editor de fases

---

## 5. Requisitos funcionais

| ID | Requisito | Prioridade |
|---|---|---|
| RF01 | Jogador arrasta a pedra no estilingue e solta para lançar | Alta |
| RF02 | Linha de mira pontilhada visível durante o arrasto | Alta |
| RF03 | Estrutura de blocos reage à física (queda, colisão) | Alta |
| RF04 | Inimigos são eliminados ao cair da estrutura | Alta |
| RF05 | Jogo detecta vitória (todos os inimigos derrotados) | Alta |
| RF06 | Jogo detecta derrota (pedras esgotadas) | Alta |
| RF07 | Botão de reiniciar fase | Alta |
| RF08 | Progressão entre fases | Média |
| RF09 | Persistência de progresso (fase alcançada) | Média |
| RF10 | [adicionar conforme necessário] | — |

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

---

## 11. Roadmap de alto nível

| Etapa | Entregável |
|---|---|
| 1 | Mecânica de estilingue + física estável (✅ em andamento) |
| 2 | Sistema de vitória/derrota (✅ feito) |
| 3 | Linha de mira (✅ feito) |
| 4 | Controles touch nativos (substituir mouse) |
| 5 | 3–5 fases jogáveis |
| 6 | Empacotamento mobile (build de teste instalável) |
| 7 | Polimento visual (sprites no lugar das formas geométricas) |
| 8 | Publicação no portfólio (README, GIF/vídeo de gameplay, link do Pages) |

---

## 12. Notas de aprendizado (seção pessoal, opcional)

> Espaço pra registrar decisões e o "porquê" delas — ótimo material pra explicar o projeto numa entrevista ou no README.

- [Ex: "Optei por clampar o puxão do estilingue em vez de usar isSensor sozinho porque..."]
- [Ex: "Escolhi Phaser em vez de Godot porque..."]
