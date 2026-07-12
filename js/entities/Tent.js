export class Tent extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        // Retângulo vertical como placeholder da Tenda (80px largura, 120px altura)
        super(scene, x, y, 80, 120, 0x1f4e5b);
        scene.add.existing(this);

        this.scene = scene;
        this.maxHp = 3;
        this.hp = this.maxHp;

        // Adiciona corpo estático do Matter.js associado a este Game Object
        scene.matter.add.gameObject(this, {
            isStatic: true,
            label: 'tent'
        });

        // Contorno branco para remeter ao estilo cartunesco/rubber hose
        this.setStrokeStyle(3, 0xffffff);

        this.updateVisuals();
    }

    takeDamage(amount = 1) {
        this.hp = Math.max(this.hp - amount, 0);
        this.updateVisuals();

        // Tremida na tela e flash de dano
        this.scene.cameras.main.shake(150, 0.015);
        this.scene.tweens.add({
            targets: this,
            alpha: 0.3,
            duration: 80,
            yoyo: true,
            repeat: 1
        });

        if (this.hp <= 0) {
            this.scene.triggerGameOver(false);
        }
    }

    updateVisuals() {
        // Estágios visuais simples de dano conforme HP
        if (this.hp === 3) {
            this.setFillStyle(0x1f4e5b, 1); // Tenda intacta
        } else if (this.hp === 2) {
            this.setFillStyle(0xd9a05b, 1); // Tenda danificada (tom amarelado/laranja)
        } else if (this.hp === 1) {
            this.setFillStyle(0x8c2d19, 1); // Tenda prestes a cair (tom avermelhado)
        } else {
            this.setVisible(false); // Destruída
        }
    }
}
