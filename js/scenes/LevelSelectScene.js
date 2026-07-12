export class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Efeito de entrada fade-in
        this.cameras.main.fadeIn(500, 15, 15, 27);

        // Título da Tela
        this.add.text(width / 2, 80, 'SELECIONE A FASE', {
            fontFamily: 'Outfit',
            fontSize: '36px',
            fontWeight: '800',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Dados das fases
        const levelData = [
            { id: 1, name: 'Fase 1: O Leão', desc: 'Proteja as ovelhas do predador faminto', unlocked: true },
            { id: 2, name: 'Fase 2: O Urso', desc: 'Defenda o rebanho do ataque do urso', unlocked: false },
            { id: 3, name: 'Fase 3: Golias', desc: 'Enfrente o gigante filisteu e seu exército', unlocked: false }
        ];

        const cardWidth = 260;
        const cardHeight = 220;
        const startX = width / 2 - cardWidth - 30; // Centralização horizontal
        const spacingX = cardWidth + 30;
        const posY = height / 2;

        levelData.forEach((level, index) => {
            const x = startX + index * spacingX;

            // Desenhando o fundo do card com Graphics (para bordas arredondadas e cores ricas)
            const cardBg = this.add.graphics();
            const color = level.unlocked ? 0x2d2d44 : 0x1d1d2b;
            const borderCol = level.unlocked ? 0xff7e5f : 0x3b3b55;
            
            cardBg.fillStyle(color, 0.9);
            cardBg.fillRoundedRect(x - cardWidth/2, posY - cardHeight/2, cardWidth, cardHeight, 16);
            cardBg.lineStyle(3, borderCol, 1);
            cardBg.strokeRoundedRect(x - cardWidth/2, posY - cardHeight/2, cardWidth, cardHeight, 16);

            // Container para agrupar e animar textos simultaneamente
            const cardContainer = this.add.container(x, posY);

            // Título da fase no card
            const title = this.add.text(0, -50, level.name, {
                fontFamily: 'Outfit',
                fontSize: '22px',
                fontWeight: '700',
                fill: level.unlocked ? '#ffffff' : '#5c5c7a',
                align: 'center'
            }).setOrigin(0.5);

            // Descrição da fase
            const desc = this.add.text(0, 10, level.desc, {
                fontFamily: 'Outfit',
                fontSize: '14px',
                fill: level.unlocked ? '#feb47b' : '#3d3d5c',
                align: 'center',
                wordWrap: { width: cardWidth - 40 }
            }).setOrigin(0.5);

            // Botão/Status da fase
            const statusText = this.add.text(0, 65, level.unlocked ? 'JOGAR' : 'BLOQUEADO 🔒', {
                fontFamily: 'Outfit',
                fontSize: '15px',
                fontWeight: '700',
                fill: level.unlocked ? '#0f0f1b' : '#3d3d5c',
                backgroundColor: level.unlocked ? '#ff7e5f' : '#252538',
                padding: { x: 25, y: 8 }
            }).setOrigin(0.5);

            cardContainer.add([title, desc, statusText]);

            if (level.unlocked) {
                // Interações e micro-animações de hover
                const hitArea = new Phaser.Geom.Rectangle(-cardWidth/2, -cardHeight/2, cardWidth, cardHeight);
                cardContainer.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);
                
                cardContainer.on('pointerover', () => {
                    this.tweens.add({
                        targets: cardContainer,
                        scaleX: 1.05,
                        scaleY: 1.05,
                        y: posY - 10,
                        duration: 150,
                        ease: 'Power2.easeOut'
                    });
                });

                cardContainer.on('pointerout', () => {
                    this.tweens.add({
                        targets: cardContainer,
                        scaleX: 1.0,
                        scaleY: 1.0,
                        y: posY,
                        duration: 150,
                        ease: 'Power2.easeOut'
                    });
                });

                cardContainer.on('pointerdown', () => {
                    this.cameras.main.fadeOut(500, 15, 15, 27);
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.start('GameScene', { level: level.id });
                    });
                });
            }
        });

        // Botão Voltar
        const backBtn = this.add.text(width / 2, height - 60, 'VOLTAR', {
            fontFamily: 'Outfit',
            fontSize: '18px',
            fontWeight: '600',
            fill: '#ff7e5f',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => {
            backBtn.setStyle({ fill: '#ffffff' });
        });

        backBtn.on('pointerout', () => {
            backBtn.setStyle({ fill: '#ff7e5f' });
        });

        backBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 15, 15, 27);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('MenuScene');
            });
        });
    }
}
