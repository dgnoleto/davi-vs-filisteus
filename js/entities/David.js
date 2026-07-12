export class David {
    constructor(scene, anchorX, anchorY) {
        this.scene = scene;
        this.anchor = { x: anchorX, y: anchorY };
        this.stone = null;
        this.slingshotJoint = null;
        this.isDragging = false;
        this.canDrag = true;
        this.aimGraphics = scene.add.graphics();
        
        // Parâmetros de força física e mira
        this.LAUNCH_MULTIPLIER = 0.18;
        this.GRAVITY_PER_FRAME = 0.5; // Aproximação física de queda por frame
        this.AIM_DOTS = 12;
        this.AIM_FRAMES_PER_DOT = 4;
        this.MAX_PULL_RADIUS = 120;
        this.MAX_PULL_DOWN = 70;

        // Sprite base do estilingue
        this.slingshotSprite = scene.add.image(anchorX, anchorY + 30, 'slingshot-placeholder');
        this.slingshotSprite.setDepth(1);

        this.setupInputListeners();
    }

    spawnStone() {
        // Remover a pedra anterior caso ainda exista fisicamente
        if (this.stone) {
            this.scene.matter.world.remove(this.stone.body);
            this.stone.destroy();
        }

        // Adiciona a pedra física com sprite
        this.stone = this.scene.matter.add.image(this.anchor.x, this.anchor.y, 'stone-placeholder', null, {
            density: 0.05,
            restitution: 0.4,
            friction: 0.1,
            label: 'stone'
        });
        this.stone.setDepth(2);

        // Adiciona o elástico (worldConstraint) do Matter.js entre a pedra e o estilingue
        this.slingshotJoint = this.scene.matter.add.worldConstraint(this.stone, 0, 0.05, {
            pointA: { x: this.anchor.x, y: this.anchor.y },
            render: { visible: true, lineColor: 0xffffff, lineThickness: 3 }
        });

        this.canDrag = true;
    }

    setupInputListeners() {
        this.scene.input.on('pointerdown', (pointer) => {
            if (!this.canDrag || this.scene.gameState !== 'playing') return;

            // Detecta clique próximo o suficiente da pedra
            const distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.stone.x, this.stone.y);
            if (distance < 40) {
                this.isDragging = true;
                this.scene.matter.body.setStatic(this.stone.body, true);
                this.stone.body.isSensor = true; // Desabilita colisões físicas temporariamente durante arrasto
            }
        });

        this.scene.input.on('pointermove', (pointer) => {
            if (!this.isDragging) return;

            // Restringir a distância de arrasto a um raio limite
            const distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.anchor.x, this.anchor.y);
            let newPos = { x: pointer.x, y: pointer.y };

            if (distance > this.MAX_PULL_RADIUS) {
                const angle = Phaser.Math.Angle.Between(this.anchor.x, this.anchor.y, pointer.x, pointer.y);
                newPos.x = this.anchor.x + Math.cos(angle) * this.MAX_PULL_RADIUS;
                newPos.y = this.anchor.y + Math.sin(angle) * this.MAX_PULL_RADIUS;
            }

            // Evitar puxar muito para baixo (proteção física básica contra impacto no próprio chão do estilingue)
            newPos.y = Math.min(newPos.y, this.anchor.y + this.MAX_PULL_DOWN);

            // Atualiza a posição física da pedra
            this.scene.matter.body.setPosition(this.stone.body, newPos);
            this.stone.setPosition(newPos.x, newPos.y); // Sincroniza a posição visual da sprite
            
            this.drawTrajectory(newPos);
        });

        this.scene.input.on('pointerup', () => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.canDrag = false;
            this.aimGraphics.clear();

            // Libera a física dinâmica e reativa as colisões normais
            this.scene.matter.body.setStatic(this.stone.body, false);
            this.stone.body.isSensor = false;

            // Remove o elástico um pouco após a liberação (impulso de lançamento elástico)
            this.scene.time.delayedCall(100, () => {
                if (this.slingshotJoint) {
                    this.scene.matter.world.removeConstraint(this.slingshotJoint);
                    this.slingshotJoint = null;
                }
            });

            // Dispara evento na cena para descontar a jogada
            this.scene.onStoneReleased(this.stone);
        });
    }

    drawTrajectory(currentPos) {
        this.aimGraphics.clear();
        this.aimGraphics.fillStyle(0xffffff, 0.6);

        // Vetor de força invertido baseado no quanto o jogador puxou
        const pull = { x: this.anchor.x - currentPos.x, y: this.anchor.y - currentPos.y };

        let x = currentPos.x;
        let y = currentPos.y;
        let vx = pull.x * this.LAUNCH_MULTIPLIER;
        let vy = pull.y * this.LAUNCH_MULTIPLIER;

        for (let i = 0; i < this.AIM_DOTS; i++) {
            for (let f = 0; f < this.AIM_FRAMES_PER_DOT; f++) {
                vy += this.GRAVITY_PER_FRAME / this.AIM_FRAMES_PER_DOT;
                x += vx / this.AIM_FRAMES_PER_DOT;
                y += vy / this.AIM_FRAMES_PER_DOT;
            }
            this.aimGraphics.fillCircle(x, y, 4);
        }
    }

    destroy() {
        this.aimGraphics.destroy();
        if (this.stone) {
            this.scene.matter.world.remove(this.stone.body);
            this.stone.destroy();
        }
        if (this.slingshotJoint) {
            this.scene.matter.world.removeConstraint(this.slingshotJoint);
        }
        this.slingshotSprite.destroy();
    }
}
