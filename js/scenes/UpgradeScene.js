export class UpgradeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UpgradeScene' });
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.cameras.main.fadeIn(500, 15, 15, 27);

        // Título principal
        this.add.text(width / 2, height / 3, 'MELHORIAS DO PERSONAGEM', {
            fontFamily: 'Outfit',
            fontSize: '32px',
            fontWeight: '800',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);

        // Mensagem provisória (RF13 e RF14 do PRD)
        this.add.text(width / 2, height / 2, 'Sistema de Upgrades (XP / Pedras / Dano)\nDisponível no MVP Completo!', {
            fontFamily: 'Outfit',
            fontSize: '18px',
            fill: '#feb47b',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);

        // Botão Continuar
        const continueBtn = this.add.text(width / 2, height * 0.7, 'CONTINUAR', {
            fontFamily: 'Outfit',
            fontSize: '24px',
            fontWeight: '700',
            fill: '#0f0f1b',
            backgroundColor: '#ff7e5f',
            padding: { x: 35, y: 12 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        continueBtn.on('pointerover', () => {
            continueBtn.setStyle({ fill: '#ffffff', backgroundColor: '#feb47b' });
        });

        continueBtn.on('pointerout', () => {
            continueBtn.setStyle({ fill: '#0f0f1b', backgroundColor: '#ff7e5f' });
        });

        continueBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 15, 15, 27);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('LevelSelectScene');
            });
        });
    }
}
