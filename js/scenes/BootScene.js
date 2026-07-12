export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 30,
            text: 'Carregando...',
            style: {
                font: '24px Outfit',
                fill: '#feb47b'
            }
        }).setOrigin(0.5);

        // Criar texturas temporárias para o estilingue e pedras enquanto não temos sprites
        // Isso nos permite programar a física de forma visual
        this.createPlaceholderTextures();
    }

    create() {
        // Transição imediata para o Menu Principal
        this.scene.start('MenuScene');
    }

    createPlaceholderTextures() {
        // Textura da Pedra (Círculo cinza de 15px de raio)
        const stoneGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        stoneGraphics.fillStyle(0x888888, 1);
        stoneGraphics.fillCircle(15, 15, 15);
        stoneGraphics.lineStyle(2, 0xffffff, 1);
        stoneGraphics.strokeCircle(15, 15, 14);
        stoneGraphics.generateTexture('stone-placeholder', 30, 30);

        // Textura do Estilingue (Pilar simples de madeira)
        const slingshotGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        slingshotGraphics.fillStyle(0x5c4033, 1);
        slingshotGraphics.fillRect(0, 0, 20, 80);
        slingshotGraphics.fillStyle(0x3d2b1f, 1);
        slingshotGraphics.fillRect(4, 0, 12, 10); // Parte superior
        slingshotGraphics.generateTexture('slingshot-placeholder', 20, 80);
    }
}
