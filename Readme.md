# Davi vs Filisteus

Jogo mobile de plataforma e ação em pixel art, cheio de humor, inspirado na história de Davi em 1 Samuel 17 e 18.

> **Status:** o projeto mudou de direção em novembro de 2026. O novo jogo está definido no [PRD v4](PRD/prd-davi-vs-filisteus-v4.md), mas **ainda não foi implementado**. O código atual em Godot é um protótipo da mecânica antiga de funda.

## O jogo

Davi vai de pastor a herói de Israel, com cajado, funda e uma pochete que guarda muito mais ovelhas do que deveria.

| Fase | Desafio | Clímax |
|---|---|---|
| 1. O pastor | Coletar ovelhas teimosas entre hienas e chacais | Chefe Leão |
| 2. A ravina | Enfrentar hienas e lobos | Chefe Urso |
| 3. Vale de Elá | Chegar ao exército e encarar o gigante | Chefe Golias, derrotado com a funda |
| 4. Os 100 filisteus | Sobreviver com a espada de Golias | Contador chega a 100 |

O tom vem de jogos como Earthworm Jim e Metal Slug: ação simples e muitas reações cômicas. O público é infantil, então o humor fica sem sangue nem violência explícita.

## Como jogar (planejado)

- Botões na tela para mover Davi.
- Botão de pulo.
- Golpe básico com o cajado, que derrota inimigos comuns e atordoa chefes. Na fase final, ele dá lugar à espada.
- Ovelhas resgatadas enchem a barra de energia.
- Com a barra cheia, Davi solta o especial da funda, que pega todo um lado da tela.

Os controles detalhados ainda serão validados em Android real. Consulte o PRD para ver o que está decidido, proposto ou pendente.

## Tecnologia

- **Motor:** Godot 4 (o projeto atual está na versão 4.7)
- **Linguagem:** GDScript
- **Plataforma inicial:** Android

Para abrir o protótipo atual, importe `project.godot` no Godot. A cena principal é `scenes/main.tscn`.

## Estrutura do repositório

| Caminho | Conteúdo | Situação |
|---|---|---|
| `PRD/prd-davi-vs-filisteus-v4.md` | Requisitos do novo jogo | **Atual** |
| `PRD/` (v1 a v3) | Versões anteriores do PRD | Histórico |
| `spec/` | Spec e plano da mecânica antiga | Histórico |
| `scenes/`, `scripts/` | Protótipo em Godot da funda antiga | Será substituído |
| `js/`, `index.html`, `old-prototype/`, `prototypes/` | Protótipos em Phaser | Legado |
| `assets/` | Artes rubber hose e de 2013 | Legado; o jogo terá nova arte |
| `addons/fennara/` | Plugin de MCP para o Godot | Ferramenta |

## Próximos marcos

- [ ] Controle: mover, pular e golpear em Android real
- [ ] Leão: ovelhas, barra, funda e chefe, sem arte final
- [ ] Arte: Davi, Leão e um cenário finais em pixel art
- [ ] Fases 1 a 3: conteúdo, Golias e as piadas
- [ ] Fase final: os 100 filisteus e o acabamento

## Contexto bíblico

Davi protegia o rebanho de leões e ursos (1 Samuel 17:34-36) e enfrentou Golias com cajado, funda e cinco pedras (1 Samuel 17:40).

## Autor

Danilo Gomes Nolêto · [GitHub](https://github.com/dgnoleto)
