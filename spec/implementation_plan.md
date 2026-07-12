# Plano de Implementação — Reestruturação do Jogo Davi vs Filisteus

Este plano descreve a reestruturação do jogo "Davi vs Filisteus" a partir do zero, saindo do modelo antigo de " Angry Birds clássico" (fase estática) para a mecânica híbrida descrita no **PRD v3** (inimigos avançando contra a tenda, com sistema de vida da tenda, contra-ataques à distância e ovelhas dinâmicas). 

Esta primeira iteração foca na **infraestrutura básica, sistema de cenas do Phaser 3, modularidade de código e recriação da física do estilingue (Fase 2 e 3 do Roadmap)**.

---

## Perguntas Abertas / Decisões Requeridas

> [!IMPORTANT]
> Por favor, avalie os pontos abaixo antes de aprovar a execução:
>
> 1. **Preservação do Protótipo Antigo:** *(Recomendado)* Mover os arquivos atuais `index.html` e `js/game.js` para uma pasta `old-prototype/`. Isso documentará a evolução do projeto no seu portfólio GitHub, mantendo o histórico de aprendizado visível.
> 2. **Arquitetura modular via ES Modules (ESM):** *(Recomendado)* Utilizaremos módulos ES6 nativos do navegador (`import` / `export`). Isso elimina a necessidade de ferramentas de compilação pesadas (Webpack/Vite), mantém o código limpo, modular e é excelente para mostrar conhecimento moderno de JS. Requer rodar o jogo sob um servidor HTTP local (o que o Phaser já exige por padrão para carregar assets).
> 3. **Debug Físico do Matter.js:** Manteremos a propriedade `debug: true` ativada por padrão nas fases iniciais de desenvolvimento para podermos visualizar as caixas de colisão e o estilingue claramente.

---

## Arquitetura Proposta

Para garantir que o código seja limpo, extensível e profissional para o portfólio, dividiremos o projeto em **Cenas (Scenes)** e **Entidades (Entities)**:

```text
davi-vs-filisteus/
├── index.html                   # Novo entry point modular
├── old-prototype/               # Protótipo antigo preservado para referência
│   ├── index.html
│   └── js/
│       └── game.js
├── js/
│   ├── main.js                  # Inicialização do Phaser e configurações gerais
│   ├── scenes/
│   │   ├── BootScene.js         # Carregamento de todos os assets
│   │   ├── MenuScene.js         # Menu Principal do jogo
│   │   ├── LevelSelectScene.js  # Tela de seleção de fases
│   │   ├── GameScene.js         # Gerenciamento da gameplay, física, colisões
│   │   └── UpgradeScene.js      # Tela de upgrades entre fases
│   └── entities/
│       ├── David.js             # Classe responsável pelo controle do Estilingue e Pedras
│       ├── Tent.js              # Tenda do acampamento (vida e estágios de dano)
│       ├── Enemy.js             # Classe base (abstrata) para comportamento comum de inimigos
│       ├── Enemies.js           # Implementações específicas (Leão, Urso, Lanceiro, Golias)
│       └── Sheep.js             # Comportamento cômico das ovelhas
```

---

## Proposta de Alterações

### [Novo Projeto & Estrutura de Pastas]

Separação do protótipo antigo e montagem da estrutura base do jogo modular.

#### [NEW] [old-prototype/index.html](file:///d:/Github/davi-vs-filisteus/old-prototype/index.html)
* Cópia do `index.html` original para preservação.

#### [NEW] [old-prototype/js/game.js](file:///d:/Github/davi-vs-filisteus/old-prototype/js/game.js)
* Cópia do `js/game.js` original para preservação.

#### [MODIFY] [index.html](file:///d:/Github/davi-vs-filisteus/index.html)
* Atualizado para apontar para `js/main.js` como `<script type="module">`.
* Limpeza e estilização básica do container de jogo.

#### [NEW] [js/main.js](file:///d:/Github/davi-vs-filisteus/js/main.js)
* Arquivo de inicialização do Phaser configurado com o motor de física **Matter.js** e carregando a lista de cenas (`BootScene`, `MenuScene`, `LevelSelectScene`, `GameScene`, `UpgradeScene`).

#### [NEW] [js/scenes/BootScene.js](file:///d:/Github/davi-vs-filisteus/js/scenes/BootScene.js)
* Criação da cena de carregamento (preload) onde colocaremos recursos temporários (formas geométricas/linhas) e prepararemos o carregamento de fontes e assets futuros.

#### [NEW] [js/scenes/MenuScene.js](file:///d:/Github/davi-vs-filisteus/js/scenes/MenuScene.js)
* Menu inicial simples com botão "Jogar" usando texto estilizado do Phaser 3 e transição suave de cena.

#### [NEW] [js/scenes/LevelSelectScene.js](file:///d:/Github/davi-vs-filisteus/js/scenes/LevelSelectScene.js)
* Tela de seleção de fase (bloqueando fases futuras e permitindo selecionar Fase 1).

#### [NEW] [js/scenes/GameScene.js](file:///d:/Github/davi-vs-filisteus/js/scenes/GameScene.js)
* O núcleo do jogo. Nesta primeira etapa, implementará:
  * Inicialização dos limites do mundo físico Matter.js.
  * Chamada para a entidade `David` para construir o estilingue e gerenciar os lançamentos físicos.
  * Loop básico de atualização (`update`).

#### [NEW] [js/entities/David.js](file:///d:/Github/davi-vs-filisteus/js/entities/David.js)
* Classe especializada em encapsular a física do estilingue:
  * Posição do ponto de ancoragem.
  * Criação da pedra atual como corpo físico Matter.js.
  * Junta restritiva (`worldConstraint`) simulando a borracha/funda.
  * Eventos de arrastar (`pointermove`), calcular limite de puxão (`MAX_PULL_RADIUS`), e lançamento (`pointerup`).
  * Renderização em tempo real da linha pontilhada de trajetória utilizando vetores e física simples (semelhante ao protótipo antigo, mas encapsulado).

---

## Plano de Verificação

### Testes Manuais
Para testar a infraestrutura modular sem build tools:
1. Rodar um servidor HTTP local na raiz do projeto (ex: `python -m http.server 8000` ou extensão Live Server).
2. Abrir o navegador no endereço local.
3. Verificar no console de desenvolvedor (F12) se:
   - Não há erros de CORS ou importação de módulos.
   - O Phaser inicializa corretamente exibindo o menu.
4. Testar a transição Menu -> Seleção de Fase -> Game.
5. Testar a física do estilingue:
   - Arrastar a pedra, observar o limite de puxão.
   - Observar se a linha de trajetória atualiza de acordo com o puxão.
   - Soltar e garantir que a pedra é arremessada fisicamente e o elástico do estilingue é liberado corretamente.
