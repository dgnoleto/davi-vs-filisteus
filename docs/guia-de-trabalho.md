# Guia de trabalho

Como uma ideia vira jogo neste repositório. Curto de propósito: se uma regra não cabe aqui, ela não vale.

## Fluxo de uma issue

1. **Issue primeiro.** Crie a issue pelo modelo certo (história, task, bug ou melhoria). Sem modelo não abre: é de propósito.
2. **Branch própria**, uma por issue, com o número no nome: `feat/12-golpe-de-cajado`, `fix/21-pulo-duplo`, `chore/7-preparar-repositorio`.
3. **Implementação só no escopo.** O que está em "Fora de escopo" vira outra issue.
4. **Evidência.** Antes de pedir aprovação, registre na issue o que foi comprovado e em qual nível (ver abaixo).
5. **Pull request** ligado à issue, com a lista de critérios de conclusão marcada ou explicada.
6. **Aprovação do Danilo.** Só ele faz o merge e fecha a issue.

## Rótulos

| Rótulo | Quando usar |
| --- | --- |
| `história` | Muda o que o jogador faz ou percebe |
| `task` | Trabalho técnico ou de organização |
| `bug` | Algo que devia funcionar e não funciona |
| `melhoria` | Algo que funciona e pode ficar melhor |
| `gameplay`, `ui`, `arte`, `áudio` | Área afetada |
| `bloqueado` | Está esperando outra issue ou uma decisão |

## Níveis de evidência

Cada resultado diz de onde veio. Um nível não comprova o seguinte.

| Nível | Vale para | Não comprova |
| --- | --- | --- |
| Revisão de código | Lógica lida e coerente | Comportamento em execução |
| Execução no desktop | Regras e fluxo de jogo | Toque, desempenho e notch |
| Android real | Toque, FPS, tela e pausa | Diversão para crianças |
| Teste com crianças | Entendimento, frustração e diversão | Estabilidade em outros aparelhos |

## Marcos

O PRD v4 divide o trabalho em cinco marcos (Controle, Leão, Arte, Fases 1 a 3, Fase final). Um marco só termina quando o portão dele passa. Se o portão falhar, o escopo é revisto antes de seguir.

## Como publicar (PowerShell)

Na pasta do projeto:

```powershell
git status
git switch -c feat/12-golpe-de-cajado
git add .
git commit -m "feat(gameplay): golpe de cajado (ref #12)"
git push -u origin feat/12-golpe-de-cajado
```

Depois, no GitHub, abra o pull request da branch. Para voltar à branch principal e trazer as novidades:

```powershell
git switch main
git pull
```

Se aparecer uma mensagem que você não entende, pare e copie ela na conversa com a IA antes de tentar de novo.

## Arquivos que não vão para o Git

Pastas geradas pelo Godot e pelo Fennara (`.godot/` e `.fennara/tmp/`) ficam fora do versionamento, e o `.gitignore` cuida disso. Na primeira vez que o Godot abrir o projeto, ele recria essas pastas e reimporta as imagens; isso é normal.
