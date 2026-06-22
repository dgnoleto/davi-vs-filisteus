# Davi vs Filisteus - Protótipo de Mecânica Física 2D

Este é um protótipo funcional de jogo mobile/web 2D baseado em física, fortemente inspirado na mecânica clássica de *Angry Birds*. O projeto foi desenvolvido de forma nativa utilizando a biblioteca **Phaser 3** e o motor de física **Matter.js**, com foco em simulação de impactos reais e destruição de estruturas.

---

## 🎯 Visão do Produto e Público-Alvo

O objetivo do projeto é validar a jogabilidade e a física para um futuro jogo educativo e casual voltado para crianças de **8 a 12 anos**. 

A temática tradicional foi adaptada para o contexto bíblico de forma lúdica e cartunesca:
* **O Herói:** Jovem Davi operando sua fona (estilingue/funda).
* **Os Projéteis:** Diferentes tipos de pedras físicas arremessadas.
* **Os Inimigos:** Guerreiros Filisteus e o chefe gigante Golias (com maior resistência a impactos) posicionados estrategicamente dentro de fortificações destrutíveis de madeira e pedra.

---

## 🛠️ Stack Técnica e Arquitetura

Para garantir alto controle de escopo e facilidade de deploy para o portfólio, optou-se por uma arquitetura estática limpa, sem necessidade de etapas complexas de compilação (build tools):

* **Engine:** Phaser 3 (v3.60.0 via CDN)
* **Physics Engine:** Matter.js (integrado ao Phaser, gerenciando corpos rígidos, massa, densidade e gravidade)
* **Linguagem:** JavaScript moderno (ES6+) e HTML5 nativo

### Estrutura de Pastas
```text
davi-vs-filisteus/
├── index.html          # Ponto de entrada do jogo (estrutura HTML e canvas)
├── js/
│   └── game.js         # Lógica pura do jogo, configurações e física do Phaser
└── assets/             # Diretório reservado para recursos visuais e sonoros
    ├── images/
    └── sounds/