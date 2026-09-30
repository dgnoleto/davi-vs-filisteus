# Davi vs Filisteus 🪨

Jogo mobile de física com mecânica híbrida: você usa um estilingue para derrotar inimigos que **avançam em direção à tenda de Davi** e **atiram de volta** — inspirado na história bíblica de Davi e Golias.

> Projeto de portfólio e aprendizado de game dev — construído do zero, com ênfase em aprender JavaScript/Phaser antes de usar qualquer IA para gerar código.

### Estado atual do protótipo

A primeira fase utiliza poses estáticas de Davi e do leão preparadas a partir das pranchas existentes, além do cenário recuperado em `assets/scenarios/cenario.png`. Os braços e as pernas de Davi usam o mesmo tom de pele do rosto; as luvas e os sapatos mantêm suas cores. As pranchas originais foram preservadas. Consulte [a preparação das artes](assets/characters/README-artes.md).

Ovelhas, tenda e os outros inimigos ainda usam visuais provisórios. Animações por quadros, ataques à distância, XP e melhorias permanecem planejados; as seções abaixo descrevem a proposta de jogo. O balanceamento e as regras de vitória/derrota ainda precisam dos ajustes identificados na revisão.

As pranchas de animação de Davi (giro da funda), leão (caminhada e reação à pedrada) e ovelhas (expressões e fuga cômica) foram aprovadas e estão disponíveis nos assets. Consulte [as artes de animação](assets/characters/README-animacoes.md) e [a prévia independente dos movimentos](prototypes/animacoes/index.html). A integração desses quadros no jogo ainda é a próxima etapa.

Para testar, execute um servidor HTTP na raiz, por exemplo `python -m http.server 8000`, e abra `http://localhost:8000`. As áreas de colisão ficam disponíveis em `http://localhost:8000/?debug`.

---

## 🎮 Como jogar

- Arraste a pedra no estilingue e solte para lançar
- Uma linha de mira pontilhada indica a trajetória antes de lançar
- Acerte os inimigos antes que eles cheguem à tenda de Davi
- Cuidado: Lanceiros, Arqueiros e Golias **atiram de volta**
- A tenda atrás de Davi é sua vida — se for destruída, a fase acaba

---

## 🎨 Estilo visual

Arte em **rubber hose animation** — linguagem visual dos desenhos animados Fleischer Studios e Disney dos anos 20/30 (mesma referência do Cuphead): contorno preto grosso, membros tubulares, cores chapadas, expressões exageradas e squash & stretch constante.

Todos os personagens compartilham uma **cor de identidade visual** (`#56837E`) em algum acessório:

| Personagem | Acessório teal |
|---|---|
| Davi | Bandana + cinto + funda |
| Leão | Coleira |
| Urso | Lenço no pescoço |
| Ovelha | Sininho |
| Soldado Lanceiro | Gema no capacete |
| Soldado Arqueiro | Gema no capacete |
| Soldado Escudeiro | Detalhe no cinto |
| Golias | Gema no capacete |

---

## 🗺️ Progressão de fases

O jogo segue a narrativa bíblica de 1 Samuel:

```
Fase 1 → Leão        (Davi pastor, protegendo o rebanho)
Fase 2 → Urso        (segundo animal que Davi enfrenta)
Fase 3+ → Exército Filisteu  (Soldados avançam em grupo)
Fase Final → Golias  (chefão — anda mais devagar enquanto o Escudeiro viver)
```

Entre fases, Davi ganha XP e pode evoluir: mais pedras disponíveis e mais dano por acerto.

---

## 👾 Elenco e comportamento

| Personagem | Tipo | Ataque | Vida |
|---|---|---|---|
| **Davi** | Protagonista | Estilingue (jogador) | Via tenda (2 estágios) |
| **Leão** | Inimigo — corpo a corpo | Alcança e ataca a tenda | 2 acertos |
| **Urso** | Inimigo — corpo a corpo (cômico) | Alcança e ataca a tenda | 2 acertos |
| **Soldado Lanceiro** | Inimigo — distância | Lança quando a 35% da tela | 1 acerto |
| **Soldado Arqueiro** | Inimigo — distância | Flecha quando a 60% da tela | 1 acerto |
| **Soldado Escudeiro** | Inimigo — suporte | Sem ataque; atrasa o Golias | 1 acerto |
| **Golias** | Chefão final | Lança (distância) + Espada (corpo a corpo) | 4 acertos |
| **Ovelha** | NPC neutro | Sem ataque | — |

**Ovelha:** reage à proximidade do predador (calma → alerta → assustada). Quando o predador é derrotado, vira bípede e corre em disparada até o Davi — estilo Papa-Léguas.

**Escudeiro:** o alívio cômico — carrega o escudo do próprio Golias, enorme demais pra ele. Se a pedra acertar o topo do escudo, ele desmorona com o escudo em cima de forma cômica. Enquanto vivo, mantém o Golias na velocidade mínima.

---

## 🏕️ Sistema de vida — A Tenda

Davi não perde vida diretamente. A **tenda do acampamento** atrás dele é que recebe o dano:

```
Intacta → Danificada → Destruída (= Derrota)
```

Projetéis que chegam sem ser interceptados acertam a tenda automaticamente. A defesa é **indireta**: derrotar o inimigo antes que ele ataque.

---

## 🛠️ Tech stack

- **Motor:** [Phaser 3](https://phaser.io/) + Matter.js (física)
- **Linguagem:** JavaScript (ES6+)
- **Distribuição web:** GitHub Pages
- **Distribuição mobile (planejado):** [Capacitor](https://capacitorjs.com/)

---

## 📁 Estrutura do projeto

```
davi-vs-filisteus/
├── index.html
├── README.md
├── .gitignore
├── assets/
│   ├── characters/
│   │   ├── davi/
│   │   ├── golias/
│   │   ├── leao/
│   │   ├── urso/
│   │   ├── arqueiro/
│   │   ├── soldados/
│   │   └── ovelhas/
│   ├── scenarios/
│   ├── props/           ← tenda e outros elementos de fase
│   ├── ui/
│   └── fonts/
└── src/
    └── game.js
```

---

## 🗂️ Documentação

| Documento | Descrição |
|---|---|
| [`docs/prd.md`](docs/prd.md) | Product Requirements Document — o quê e por quê |
| [`docs/spec-mecanica.md`](docs/spec-mecanica.md) | Game Design Document — regras e valores numéricos de cada sistema |

---

## 🚀 Como rodar localmente

```bash
git clone https://github.com/seuusuario/davi-vs-filisteus.git
cd davi-vs-filisteus
# Abra o index.html num servidor local (ex: extensão Live Server no VS Code)
# Não funciona direto pelo sistema de arquivos por restrições de CORS do Phaser
```

---

## 📍 Roadmap

- [x] Elenco completo de personagens desenhado (estilo rubber hose)
- [x] PRD e spec de mecânica documentados
- [ ] Mecânica de estilingue + linha de mira
- [ ] Sistema de avanço de inimigos
- [ ] Sistema de vida via tenda
- [ ] Ataque à distância dos inimigos
- [ ] Comportamento das Ovelhas
- [ ] Controles touch nativos
- [ ] Fase 1 — Leão completa
- [ ] Fase 2 — Urso completa
- [ ] Sistema de progressão (XP + upgrade)
- [ ] Fases 3+ — Filisteus e Golias
- [ ] Build mobile (Capacitor)
- [ ] Publicação no GitHub Pages

---

## 📖 Contexto bíblico

A história é baseada em **1 Samuel 17**: Davi, um jovem pastor, enfrenta o gigante Golias com apenas um estilingue e cinco pedras. Antes desse confronto, Davi havia derrotado um leão e um urso enquanto guardava o rebanho de seu pai (1 Samuel 17:34-36).

---

## 👤 Autor

Danilo — projeto de aprendizado de JavaScript e game dev.  
[GitHub](https://github.com/seuusuario) · [LinkedIn](https://linkedin.com/in/seuusuario)

---

> *"O Senhor, que me livrou das garras do leão e do urso, me livrará também da mão desse filisteu."*  
> — 1 Samuel 17:37
