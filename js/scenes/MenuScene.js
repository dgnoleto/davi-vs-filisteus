export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Resetar câmera (caso venha de um fade)
        this.cameras.main.fadeIn(500, 15, 15, 27);

        // Título Principal com Estilo Premium
        const titleText = this.add.text(width / 2, height / 3, 'DAVI VS FILISTEUS', {
            fontFamily: 'Outfit',
            fontSize: '52px',
            fontWeight: '800',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Efeito de sombra/brilho no título
        titleText.setShadow(0, 4, 'rgba(255, 126, 95, 0.6)', 15, true, true);

        // Animação suave de pulsar do título (remete ao Squash & Stretch do Rubber Hose)
        this.tweens.add({
            targets: titleText,
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Subtítulo
        this.add.text(width / 2, height / 3 + 55, 'A Batalha da Física', {
            fontFamily: 'Outfit',
            fontSize: '22px',
            fill: '#feb47b',
            align: 'center'
        }).setOrigin(0.5);

        // Botão Jogar
        const playBtn = this.add.text(width / 2, height * 0.65, 'JOGAR', {
            fontFamily: 'Outfit',
            fontSize: '32px',
            fontWeight: '700',
            fill: '#0f0f1b',
            backgroundColor: '#ff7e5f',
            padding: { x: 50, y: 15 },
            align: 'center'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Micro-animações no botão (Hover)
        playBtn.on('pointerover', () => {
            playBtn.setStyle({ fill: '#ffffff', backgroundColor: '#feb47b' });
            this.tweens.add({
                targets: playBtn,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 150,
                ease: 'Back.easeOut'
            });
        });

        playBtn.on('pointerout', () => {
            playBtn.setStyle({ fill: '#0f0f1b', backgroundColor: '#ff7e5f' });
            this.tweens.add({
                targets: playBtn,
                scaleX: 1.0,
                scaleY: 1.0,
                duration: 150,
                ease: 'Back.easeOut'
            });
        });

        // Clique e Transição de Cena com Fade Out
        playBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 15, 15, 27);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('LevelSelectScene');
            });
        });

        // Rodapé de Versão
        this.add.text(20, height - 30, 'v3.0.0 Protótipo Modular', {
            fontFamily: 'Outfit',
            fontSize: '14px',
            fill: '#4a4a6a'
        });
    }
}
