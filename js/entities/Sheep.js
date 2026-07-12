export class Sheep extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        scene.add.existing(this);

        this.scene = scene;
        this.initialY = y;
        this.initialX = x;

        // Corpo da ovelha (elipse branca)
        this.bodyPart = scene.add.arc(0, 0, 16, 0, 360, false, 0xffffff);
        this.bodyPart.setStrokeStyle(2, 0x000000);

        // Cabeça da ovelha (círculo cinza claro posicionado à direita)
        this.headPart = scene.add.arc(14, -8, 8, 0, 360, false, 0xeeeeee);
        this.headPart.setStrokeStyle(2, 0x000000);

        // Pernas (linhas pretas estendendo para baixo)
        this.leg1 = scene.add.line(-8, 16, 0, 0, 0, 10, 0x000000).setLineWidth(3);
        this.leg2 = scene.add.line(8, 16, 0, 0, 0, 10, 0x000000).setLineWidth(3);

        this.add([this.bodyPart, this.headPart, this.leg1, this.leg2]);

        this.state = 'CALM'; // Estados: CALM, SCARED, FLEEING
        this.shakeTween = null;
        
        // Pequena animação de "respirar" (squash & stretch) no corpo
        scene.tweens.add({
            targets: this.bodyPart,
            scaleY: 1.15,
            duration: 800 + Math.random() * 400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    update(predator) {
        if (this.state === 'FLEEING') {
            // Corre rapidamente para a esquerda (fuga bípede)
            this.x -= 6.5;
            
            // Simula pulinhos de fuga usando o tempo
            this.y = this.initialY - Math.abs(Math.sin(this.scene.time.now * 0.015) * 16);

            // Destroi a ovelha ao sair da tela (esquerda de Davi)
            if (this.x < -50) {
                this.destroy();
            }
            return;
        }

        // Se o predador não existe mais (derrotado), foge!
        if (!predator || !predator.active || (predator.hp !== undefined && predator.hp <= 0)) {
            if (this.state === 'SCARED' || this.state === 'CALM') {
                this.flee();
            }
            return;
        }

        // Calcula distância física até o predador
        const distance = Phaser.Math.Distance.Between(this.x, this.y, predator.x, predator.y);

        if (distance < 220 && this.state === 'CALM') {
            this.state = 'SCARED';
            
            // Inicia tremorzinho de medo em loop
            this.shakeTween = this.scene.tweens.add({
                targets: this,
                x: this.x + 3,
                yoyo: true,
                repeat: -1,
                duration: 60,
                ease: 'Linear'
            });
        } else if (distance >= 220 && this.state === 'SCARED') {
            this.state = 'CALM';
            if (this.shakeTween) {
                this.shakeTween.stop();
                this.shakeTween = null;
            }
            this.x = this.initialX; // Restaura a posição X original
            this.y = this.initialY;
        }
    }

    flee() {
        this.state = 'FLEEING';
        if (this.shakeTween) {
            this.shakeTween.stop();
            this.shakeTween = null;
        }
        this.x = this.x; // Mantém onde estava tremendo
        this.y = this.initialY;

        // Animação de se colocar "em pé" (mudar ângulo e esticar verticalmente - fuga bípede)
        this.scene.tweens.add({
            targets: this,
            angle: -15,
            scaleY: 1.35,
            scaleX: 0.9,
            duration: 180,
            ease: 'Back.easeOut'
        });
    }
}
