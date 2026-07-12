import { David } from '../entities/David.js';
import { Tent } from '../entities/Tent.js';
import { Sheep } from '../entities/Sheep.js';
import { Lion, Bear, Soldier, ShieldSoldier, Goliath } from '../entities/Enemies.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.levelId = data.level || 1;
        this.shotsRemaining = 5;
        this.gameState = 'playing';
        this.oldStones = [];
        this.enemies = [];
        this.sheeps = [];
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        this.cameras.main.fadeIn(500, 15, 15, 27);

        // Limites físicos do mundo no Matter.js (chão, teto e paredes com espessura de 64px)
        this.matter.world.setBounds(0, 0, width, height, 64, true, true, true, true);

        // 1. Tenda de Israel (Vida)
        this.tent = new Tent(this, 70, 420);

        // 2. Instancia Davi (Estilingue)
        this.david = new David(this, 180, 400);
        this.david.spawnStone();

        // 3. Spawn das entidades específicas do nível (Inimigos e Ovelhas)
        this.spawnLevelEntities(width, height);

        // 4. Configurar manipuladores de colisão física
        this.setupCollisionHandlers();

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

    spawnLevelEntities(width, height) {
        if (this.levelId === 1) {
            // Fase 1: O Leão
            this.sheeps.push(new Sheep(this, 420, 440));
            this.sheeps.push(new Sheep(this, 490, 440));
            
            // Leão começa à direita
            this.enemies.push(new Lion(this, 880, 440));
        } else if (this.levelId === 2) {
            // Fase 2: O Urso
            this.sheeps.push(new Sheep(this, 400, 440));
            this.sheeps.push(new Sheep(this, 470, 440));
            this.sheeps.push(new Sheep(this, 540, 440));
            
            // Urso começa à direita
            this.enemies.push(new Bear(this, 880, 440));
        } else if (this.levelId === 3) {
            // Fase 3: Golias e o Exército Filisteu
            this.sheeps.push(new Sheep(this, 350, 440));

            // Fila indiana: Soldado 1 -> Soldado 2 -> Escudeiro -> Golias
            this.enemies.push(new Soldier(this, 580, 440));
            this.enemies.push(new Soldier(this, 660, 440));
            this.enemies.push(new ShieldSoldier(this, 740, 440));
            this.enemies.push(new Goliath(this, 850, 440));
        }
    }

    setupCollisionHandlers() {
        this.matter.world.on('collisionstart', (event) => {
            event.pairs.forEach(pair => {
                const bodyA = pair.bodyA;
                const bodyB = pair.bodyB;

                // --- 1. Detectar Impacto de Pedra em Inimigos ---
                let stoneBody = null;
                let enemyPart = null;

                if (bodyA.label === 'stone') {
                    stoneBody = bodyA;
                    enemyPart = bodyB;
                } else if (bodyB.label === 'stone') {
                    stoneBody = bodyB;
                    enemyPart = bodyA;
                }

                if (stoneBody && enemyPart) {
                    const enemy = enemyPart.gameObject;
                    if (enemy && typeof enemy.applyDamage === 'function') {
                        // Impedir dano duplo na mesma pedra no mesmo frame
                        if (stoneBody.gameObject && stoneBody.gameObject.hasHitEnemy) return;
                        if (stoneBody.gameObject) stoneBody.gameObject.hasHitEnemy = true;

                        // Se o colisor atingido for a cabeça de Golias
                        if (enemyPart.label === 'goliath_head') {
                            // Verifica se o Escudeiro protetor de Golias ainda está vivo
                            const shieldAlive = this.enemies.some(other => other.label === 'enemy_shield' && !other.isDefeated);
                            
                            if (!shieldAlive) {
                                // TIRO CERTEIRO FATAL! (Easter Egg/Charada bíblica)
                                enemy.applyDamage(100); 
                                this.showFloatingText(enemy.x, enemy.y - 70, 'TIRO CERTEIRO! 🎯', '#00ffff');
                            } else {
                                // Protegido pelo Escudeiro
                                enemy.applyDamage(1);
                                this.showFloatingText(enemy.x, enemy.y - 70, 'PROTEGIDO 🛡️', '#ffffff');
                            }
                        } else {
                            // Dano comum a qualquer inimigo
                            enemy.applyDamage(1);
                            this.showFloatingText(enemy.x, enemy.y - 50, '-1 HP', '#ff3333');
                        }
                    }
                }

                // --- 2. Detectar Inimigo Alcançando a Tenda ---
                let tentBody = null;
                let attackingPart = null;

                if (bodyA.label === 'tent') {
                    tentBody = bodyA;
                    attackingPart = bodyB;
                } else if (bodyB.label === 'tent') {
                    tentBody = bodyB;
                    attackingPart = bodyA;
                }

                if (tentBody && attackingPart) {
                    const enemy = attackingPart.gameObject;
                    if (enemy && typeof enemy.applyDamage === 'function' && !enemy.isDefeated) {
                        this.tent.takeDamage(1);
                        enemy.defeat(); // Inimigo é derrotado ao se chocar e causar dano
                    }
                }
            });
        });
    }

    showFloatingText(x, y, text, color) {
        const txt = this.add.text(x, y, text, {
            fontFamily: 'Outfit',
            fontSize: '18px',
            fontWeight: '700',
            fill: color,
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(20);

        this.tweens.add({
            targets: txt,
            y: y - 45,
            alpha: 0,
            duration: 1000,
            ease: 'Power1.easeOut',
            onComplete: () => txt.destroy()
        });
    }

    onStoneReleased(stone) {
        this.shotsRemaining--;
        this.shotsText.setText(`Pedras: ${Math.max(this.shotsRemaining, 0)}`);
        
        // Mantém referência da pedra lançada
        this.oldStones.push(stone);

        // Agendamento para recarga ou derrota
        this.time.delayedCall(2500, () => {
            if (this.gameState !== 'playing') return;

            if (this.shotsRemaining > 0) {
                this.clearOldStones();
                this.david.spawnStone();
            } else {
                // Ao acabar as pedras, espera mais 1.5s para ver se o último inimigo morre antes de dar derrota
                this.time.delayedCall(1500, () => {
                    if (this.gameState === 'playing') {
                        this.triggerGameOver(false);
                    }
                });
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
        if (this.gameState !== 'playing') return;
        this.gameState = isVictory ? 'won' : 'lost';

        if (isVictory) {
            this.messageText.setText('VITÓRIA!\nIsrael está seguro!');
            this.messageText.setFill('#2ec4b6');
            
            // Avança para tela de upgrades
            this.time.delayedCall(2500, () => {
                this.cameras.main.fadeOut(500, 15, 15, 27);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('UpgradeScene');
                });
            });
        } else {
            this.messageText.setText('FIM DE JOGO\nA tenda foi destruída!');
            this.messageText.setFill('#e71d36');

            // Botão centralizado de Tentar Novamente
            const retryBtn = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 100, 'TENTAR NOVAMENTE', {
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
        if (this.gameState !== 'playing') return;

        // Atualizar todos os inimigos ativos
        this.enemies.forEach(enemy => {
            if (enemy && enemy.active) {
                enemy.update();
            }
        });

        // Encontrar o predador ativo mais próximo para as ovelhas reagirem
        const activePredator = this.enemies.find(e => !e.isDefeated);

        // Atualizar todas as ovelhas ativas
        this.sheeps.forEach(sheep => {
            if (sheep && sheep.active) {
                sheep.update(activePredator);
            }
        });

        // Condição de Vitória: Todos os inimigos marcados como derrotados
        const allDefeated = this.enemies.every(e => e.isDefeated);
        if (allDefeated && this.enemies.length > 0) {
            this.triggerGameOver(true);
        }
    }

    shutdown() {
        if (this.david) {
            this.david.destroy();
        }
        this.clearOldStones();
        this.enemies.forEach(e => { if (e && e.active) e.destroy(); });
        this.sheeps.forEach(s => { if (s && s.active) s.destroy(); });
    }
}
