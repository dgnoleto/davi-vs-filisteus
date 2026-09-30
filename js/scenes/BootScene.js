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

        this.load.image('david-art', 'assets/characters/davi/davi-idle-skin-v2.png');
        this.load.image('lion-art', 'assets/characters/leao/lion-idle-cutout-v1.png');
        this.load.image('landscape-art', 'assets/scenarios/cenario.png');
    }

    create() {
        // Frames removem a margem transparente sem alterar os PNGs originais.
        this.textures.get('david-art').add('standing', 0, 130, 10, 680, 1516);
        this.textures.get('lion-art').add('standing', 0, 78, 24, 808, 1496);
        // A faixa superior do cenário antigo contém sua própria interface.
        const landscape = this.textures.get('landscape-art');
        const source = landscape.getSourceImage();
        landscape.add('landscape', 0, 0, 38, source.width, source.height - 38);

        // A pedra mantém uma textura simples para facilitar a leitura do disparo.
        this.createPlaceholderTextures();
        
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

    }
}
