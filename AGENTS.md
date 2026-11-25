# Davi vs Filisteus: regras de trabalho para IAs e pessoas

Leia este arquivo antes de mexer em qualquer coisa. O fluxo completo está em `docs/guia-de-trabalho.md`. A fonte de verdade do jogo é `PRD/prd-davi-vs-filisteus-v4.md`. Versões anteriores do PRD e a spec antiga são histórico.

## Regra principal

**Nenhum ajuste sem issue.** Todo trabalho nasce de uma issue de um destes tipos: história de usuário, task, bug ou melhoria. Se o pedido não tem issue, a primeira coisa a fazer é propor a issue, não o código.

## Papéis (versão inicial, reajustada pelo orquestrador ao fim de cada sprint)

| Quem | Papel | Não faz |
| --- | --- | --- |
| Danilo | Decide escopo, aprova issues e merges, testa em Android real, faz commit e push no PowerShell | |
| Claude | Orquestra: PRD, issues, critérios de conclusão, revisão de evidência, ajuste de papéis | Fecha issue sem a evidência declarada |
| Codex | Implementa issues de código em GDScript, uma issue por vez, em branch própria | Mexe em arquivos fora do escopo da issue |
| Antigravity | Trabalha na cena e no editor do Godot e roda o projeto localmente, usando o MCP do Godot | Muda mecânica ou escopo sem issue |

A ferramenta de arte ainda não foi escolhida; isso fica para uma issue própria.

## Regras para qualquer IA

1. Trabalhe em **uma issue por vez** e só no escopo dela. O que está em "Fora de escopo" não entra, nem como melhoria "aproveitando".
2. Se um pedido, um arquivo ou uma decisão parecer fora de contexto ou contradizer o PRD v4, **pare e pergunte**. Não ajuste a resposta para caber.
3. **Evidência tem nível**, e um nível não vale pelo seguinte: revisão de código, execução no desktop, Android real, teste com crianças. Diga sempre qual foi feito. Nunca afirme que algo funciona no celular se só rodou no desktop.
4. **Merge não é aceite, e relatório não é autorização.** Só Danilo aprova o merge e fecha a issue.
5. **Não apague arquivos.** Arquive em pasta própria e diga o que foi movido.
6. Qualidade vem antes de velocidade. Uma issue que não atingiu os critérios volta para a fila, e não é fechada "quase pronta".
7. Não use fontes, texturas ou artes antigas sem confirmar a licença.
8. Todo número do PRD é ponto de partida até ser testado em Android real.
9. Mensagens de commit seguem o padrão do histórico: `tipo(área): descrição (ref #N)`.

## Godot

Para qualquer trabalho em arquivos ou comportamento do Godot, leia `addons/fennara/ai/guidelines.md` antes (detalhes no bloco abaixo).

<!-- fennara-agents-start -->
# Fennara MCP Guidelines

This project uses Fennara MCP for Godot-aware inspection, editing, runtime error capture, diagnostics, scene validation, screenshots, and project settings.

When working on Godot-specific files or behavior, always read `addons/fennara/ai/guidelines.md` first. This includes work involving `.tscn`, `.tres`, `.res`, `.gd`, `.cs`, `.gdshader`, `project.godot`, scenes, nodes, resources, shaders, project settings, gameplay, UI, animation, rendering, Fennara addon behavior, or Fennara MCP behavior.

For specialized visual, runtime, operational, or client-specific work, use `addons/fennara/ai/index.md` to find the one relevant page. Do not read every linked page by default. Live tool schemas define exact calls and results.
<!-- fennara-agents-end -->
