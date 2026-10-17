# Artes utilizadas no protótipo

## Fontes preservadas

- `davi/Davi-v3.png`: prancha original de Davi.
- `leao/Leão.png`: prancha original do leão.
- `../scenarios/cenario.png`: cenário existente; a faixa de interface superior é excluída por um frame no Phaser, sem editar o arquivo.

## Imagens preparadas

- `davi/davi-idle-cutout-v1.png`: primeira versão isolada da pose completa de Davi, com transparência.
- `davi/davi-idle-skin-v2.png`: versão usada pelo jogo. Braços e pernas recebem o tom de pele do rosto; luvas, sapatos, roupa, funda e pose são preservados.
- `leao/lion-idle-cutout-v1.png`: pose completa do leão, com transparência.

As imagens foram preparadas com edição de imagens baseada nas pranchas existentes. Elas são poses estáticas, sem sequência de animação. `BootScene` carrega os PNGs e define frames para excluir as margens transparentes. Davi é espelhado para olhar à direita; o leão, para olhar à esquerda. O corpo físico do leão é independente da imagem e cobre cabeça, tronco e pés; a cauda é visual.

## Verificações da integração

Com Phaser 3.60.0 no Edge: entrada pelo menu, carregamento dos assets, direção dos personagens, pés alinhados ao chão, lançamento, consumo de pedra, recarga, reinício e exibição das colisões por `?debug`. A derrota foi acionada diretamente para verificar sua animação sem depender do balanceamento. O avanço do leão foi pausado apenas durante a captura e os testes isolados de imagem/controle.

As chamadas de sensor no lançamento e na derrota foram corrigidas para permitir essas verificações. O resultado não estabelece validação completa da mecânica: a precisão da mira, as condições de vitória/derrota, o balanceamento e os erros da fase 3 continuam pendentes. Os demais personagens permanecem com visuais provisórios.
