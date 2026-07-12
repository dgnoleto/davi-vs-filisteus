import { David } from '../entities/David.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.levelId = data.level || 1;
        this.shotsRemaining = 5;
        this.gameState = 'playing';
        this.oldStones = [];
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.cameras.main.fadeIn(500, 15, 15, 27);

        // Limites físicos do mundo no Matter.js (chão, teto e paredes com espessura de 64px)
        this.matter.world.setBounds(0, 0, width, height, 64, true, true, true, true);

        // Instancia Davi (Estilingue) na posição inicial
        this.david = new David(this, 180, 380);
        this.david.spawnStone();

        // UI - Título da Fase e Contador de Jogadas
        this.levelText = this.add.text(20, 20, `FASE ${this.levelId}`, {
            fontFamily: 'Outfit',
            fontSize: '20px',
            fontWeight: '700',
            fill: '#ffffff'
        });

        this.shotsText = this.add.text(20, 50, `Pedras: ${this.shotsRemaining}`, {
            fontFamily: 'Outfit',
            fontSize: '18px',
            fill: '#feb47b'
        });

        // Botão Reiniciar na UI
        const restartBtn = this.add.text(width - 130, 20, 'Reiniciar', {
            fontFamily: 'Outfit',
            fontSize: '16px',
            fontWeight: '600',
            fill: '#ff7e5f',
            backgroundColor: '#1d1d2b',
            padding: { x: 15, y: 8 }
        }).setOrigin(1, 0).setInteractive({ useHandCursor: true });

        restartBtn.on('pointerover', () => restartBtn.setStyle({ fill: '#ffffff' }));
        restartBtn.on('pointerout', () => restartBtn.setStyle({ fill: '#ff7e5f' }));
        restartBtn.on('pointerdown', () => this.scene.restart({ level: this.levelId }));

        // Botão Sair na UI
        const exitBtn = this.add.text(width - 20, 20, 'Sair', {
            fontFamily: 'Outfit',
            fontSize: '16px',
            fontWeight: '600',
            fill: '#ff7e5f',
            backgroundColor: '#1d1d2b',
            padding: { x: 15, y: 8 }
        }).setOrigin(1, 0).setInteractive({ useHandCursor: true });

        exitBtn.on('pointerover', () => exitBtn.setStyle({ fill: '#ffffff' }));
        exitBtn.on('pointerout', () => exitBtn.setStyle({ fill: '#ff7e5f' }));
        exitBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 15, 15, 27);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('LevelSelectScene');
            });
        });

        // Texto centralizado para anúncios de Vitória / Derrota
        this.messageText = this.add.text(width / 2, height / 2, '', {
            fontFamily: 'Outfit',
            fontSize: '44px',
            fontWeight: '800',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5).setDepth(10);
    }

    onStoneReleased(stone) {
        this.shotsRemaining--;
        this.shotsText.setText(`Pedras: ${Math.max(this.shotsRemaining, 0)}`);
        
        // Mantém referência da pedra lançada para limpeza posterior
        this.oldStones.push(stone);

        // Agendamento para recarga ou derrota
        this.time.delayedCall(2500, () => {
            if (this.gameState !== 'playing') return;

            if (this.shotsRemaining > 0) {
                // Limpa corpos do chão antes de spawnar nova pedra para não acumular lixo físico
                this.clearOldStones();
                this.david.spawnStone();
            } else {
                this.triggerGameOver(false);
            }
        });
    }

    clearOldStones() {
        this.oldStones.forEach(stone => {
            if (stone && stone.body) {
                this.matter.world.remove(stone.body);
                stone.destroy();
            }
        });
        this.oldStones = [];
    }

    triggerGameOver(isVictory) {
        this.gameState = isVictory ? 'won' : 'lost';

        if (isVictory) {
            this.messageText.setText('VITÓRIA!');
            this.messageText.setFill('#2ec4b6');
            
            // Avança para tela de upgrades após 2 segundos
            this.time.delayedCall(2000, () => {
                this.cameras.main.fadeOut(500, 15, 15, 27);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('UpgradeScene');
                });
            });
        } else {
            this.messageText.setText('FIM DE JOGO\nAcabaram as pedras!');
            this.messageText.setFill('#e71d36');

            // Botão centralizado de Tentar Novamente
            const retryBtn = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 90, 'TENTAR NOVAMENTE', {
                fontFamily: 'Outfit',
                fontSize: '22px',
                fontWeight: '700',
                fill: '#0f0f1b',
                backgroundColor: '#ff7e5f',
                padding: { x: 30, y: 12 }
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            retryBtn.on('pointerover', () => retryBtn.setStyle({ fill: '#ffffff', backgroundColor: '#feb47b' }));
            retryBtn.on('pointerout', () => retryBtn.setStyle({ fill: '#0f0f1b', backgroundColor: '#ff7e5f' }));
            retryBtn.on('pointerdown', () => this.scene.restart({ level: this.levelId }));
        }
    }

    update() {
        // O loop principal será usado no futuro para avanço de inimigos e detecção de colisões
    }

    // Função executada automaticamente pelo Phaser ao destruir a cena (mudança de fase/reinício)
    shutdown() {
        if (this.david) {
            this.david.destroy();
        }
        this.clearOldStones();
    }
}
