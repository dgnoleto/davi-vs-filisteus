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

        // A pose vem da prancha Davi-v3. A imagem fica separada da pedra física.
        this.davidSprite = scene.add.image(anchorX - 30, scene.cameras.main.height, 'david-art', 'standing');
        this.davidSprite.setOrigin(0.5, 1).setFlipX(true).setDepth(1);
        this.davidSprite.setScale(170 / this.davidSprite.height);

        this.setupInputListeners();
    }

    spawnStone() {
        // Remover a pedra anterior apenas se ela existir e tiver corpo válido
        if (this.stone) {
            if (this.stone.body) {
                this.scene.matter.world.remove(this.stone.body);
            }
            this.stone.destroy();
        }
        this.stone = null; // Limpa a referência antiga para evitar erros

        // Adiciona a pedra física com formato circular e densidade padrão de voo
        this.stone = this.scene.matter.add.image(this.anchor.x, this.anchor.y, 'stone-placeholder', null, {
            shape: { type: 'circle', radius: 15 },
            density: 0.001, // Densidade física padrão para voo responsivo
            restitution: 0.4,
            friction: 0.1,
            label: 'stone'
        });
        this.stone.setDepth(2);

        // Adiciona o elástico (worldConstraint) do Matter.js entre o CORPO da pedra e o estilingue
        this.slingshotJoint = this.scene.matter.add.worldConstraint(this.stone.body, 0, 0.05, {
            pointA: { x: this.anchor.x, y: this.anchor.y },
            render: { visible: true, lineColor: 0xffffff, lineThickness: 3 }
        });

        this.canDrag = true;
    }

    setupInputListeners() {
        this.scene.input.on('pointerdown', (pointer) => {
            if (!this.stone || !this.stone.body) return; // Evita erros se a pedra estiver ausente

            console.log("[David] Click em:", pointer.x, pointer.y);
            if (!this.canDrag || this.scene.gameState !== 'playing') {
                console.log("[David] Arrastar desativado. canDrag:", this.canDrag, "gameState:", this.scene.gameState);
                return;
            }

            // Detecta clique próximo o suficiente da pedra (coordenadas reais da pedra)
            const distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.stone.x, this.stone.y);
            console.log("[David] Posição da Pedra:", this.stone.x, this.stone.y, "Distância:", distance);
            if (distance < 50) { 
                console.log("[David] Pedra agarrada com sucesso!");
                this.isDragging = true;
                this.scene.matter.body.setStatic(this.stone.body, true);
                this.stone.setSensor(true);
            }
        });

        this.scene.input.on('pointermove', (pointer) => {
            if (!this.isDragging || !this.stone || !this.stone.body) return;

            // Restringir a distância de arrasto a um raio limite
            const distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, this.anchor.x, this.anchor.y);
            let newPos = { x: pointer.x, y: pointer.y };

            if (distance > this.MAX_PULL_RADIUS) {
                const angle = Phaser.Math.Angle.Between(this.anchor.x, this.anchor.y, pointer.x, pointer.y);
                newPos.x = this.anchor.x + Math.cos(angle) * this.MAX_PULL_RADIUS;
                newPos.y = this.anchor.y + Math.sin(angle) * this.MAX_PULL_RADIUS;
            }

            // Evitar puxar muito para baixo
            newPos.y = Math.min(newPos.y, this.anchor.y + this.MAX_PULL_DOWN);

            // Atualiza a posição física da pedra
            this.scene.matter.body.setPosition(this.stone.body, newPos);
            this.stone.setPosition(newPos.x, newPos.y); 
            
            this.drawTrajectory(newPos);
        });

        this.scene.input.on('pointerup', () => {
            if (!this.isDragging || !this.stone || !this.stone.body) return;
            this.isDragging = false;
            this.canDrag = false;
            this.aimGraphics.clear();

            // Libera a física dinâmica e reativa as colisões normais
            this.scene.matter.body.setStatic(this.stone.body, false);
            this.stone.setSensor(false);

            // Calcular vetor de puxão
            const pull = { x: this.anchor.x - this.stone.x, y: this.anchor.y - this.stone.y };
            
            // Lançamento com força física manual (mesmo cálculo da linha de trajetória)
            const vx = pull.x * this.LAUNCH_MULTIPLIER;
            const vy = pull.y * this.LAUNCH_MULTIPLIER;
            
            this.scene.matter.body.setVelocity(this.stone.body, { x: vx, y: vy });

            // Remove o elástico imediatamente para não prender a pedra
            if (this.slingshotJoint) {
                this.scene.matter.world.remove(this.slingshotJoint);
                this.slingshotJoint = null;
            }

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
            this.scene.matter.world.remove(this.slingshotJoint);
        }
        this.davidSprite.destroy();
    }
}
