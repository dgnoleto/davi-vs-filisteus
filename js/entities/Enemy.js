export class Enemy extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, label, hp, maxSpeed, customBody = null) {
        super(scene, x, y);
        scene.add.existing(this);

        this.scene = scene;
        this.label = label;
        this.hp = hp;
        this.maxHp = hp;
        this.maxSpeed = maxSpeed;
        this.speed = maxSpeed;
        this.isDefeated = false;

        if (customBody) {
            // Se um corpo composto ou customizado for providenciado, vincula-o diretamente ao GameObject
            this.scene.matter.add.gameObject(this, customBody);
        } else {
            // Configuração padrão do corpo físico retangular no Matter.js
            this.scene.matter.add.gameObject(this, {
                shape: { type: 'rectangle', width: width, height: height },
                label: label,
                density: 0.005,
                friction: 0.1,
                restitution: 0.1
            });
        }

        // Impede a rotação física para que o inimigo ande sempre "em pé"
        this.scene.matter.body.setInertia(this.body, Infinity);
    }

    applyDamage(amount = 1) {
        if (this.isDefeated) return;

        this.hp = Math.max(this.hp - amount, 0);

        // Flash visual vermelho para indicar dano
        this.scene.tweens.add({
            targets: this,
            alpha: 0.4,
            duration: 80,
            yoyo: true,
            repeat: 1
        });

        // Efeito físico de empurrão leve para a direita ao ser atingido
        this.scene.matter.body.applyForce(this.body, this.body.position, { x: 0.08, y: -0.05 });

        // Redução da velocidade atual (desaceleração por pedrada)
        // Reduz a velocidade proporcionalmente ao dano recebido
        this.speed = Math.max(this.speed - (this.maxSpeed * 0.3), this.maxSpeed * 0.1);

        if (this.hp <= 0) {
            this.defeat();
        }
    }

    defeat() {
        this.isDefeated = true;

        // Animação de derrota: girar e cair
        this.body.parts.forEach(part => { part.isSensor = true; });
        this.scene.matter.body.setVelocity(this.body, { x: 5, y: -8 }); // Salta levemente para a direita/cima
        
        this.scene.tweens.add({
            targets: this,
            angle: 180,
            scaleX: 0.1,
            scaleY: 0.1,
            alpha: 0,
            duration: 1000,
            ease: 'Power2.easeOut',
            onComplete: () => {
                this.destroy();
            }
        });
    }

    update() {
        if (this.isDefeated) return;

        // Forçar movimentação constante para a esquerda (tenda de Davi)
        // Preserva a velocidade vertical atual (gravidade)
        this.scene.matter.body.setVelocity(this.body, { 
            x: -this.speed, 
            y: this.body.velocity.y 
        });
    }

    destroy() {
        // Garantir remoção física do Matter ao destruir o objeto do Phaser
        if (this.body) {
            this.scene.matter.world.remove(this.body);
        }
        super.destroy();
    }
}
