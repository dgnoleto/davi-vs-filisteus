import { Enemy } from './Enemy.js';

// ==========================================
// 1. ENTIDADE: LEÃO (FASE 1)
// ==========================================
export class Lion extends Enemy {
    constructor(scene, x, y) {
        // HP = 2, MaxSpeed = 2.0 (Inimigo rápido)
        super(scene, x, y, 60, 140, 'enemy_lion', 2, 2.0);

        // O corpo cobre cabeça, tronco e pés; a cauda é apenas visual.
        this.artSprite = scene.add.image(0, 70, 'lion-art', 'standing');
        this.artSprite.setOrigin(0.5, 1).setFlipX(true);
        this.artSprite.setScale(154 / this.artSprite.height);
        this.add(this.artSprite);
    }
}

// ==========================================
// 2. ENTIDADE: URSO (FASE 2)
// ==========================================
export class Bear extends Enemy {
    constructor(scene, x, y) {
        // HP = 3, MaxSpeed = 1.3 (Inimigo mais lento e pesado)
        super(scene, x, y, 70, 70, 'enemy_bear', 3, 1.3);

        // Orelhas
        const earL = scene.add.arc(-20, -32, 10, 0, 360, false, 0x5c4033).setStrokeStyle(2, 0x000000);
        const earR = scene.add.arc(20, -32, 10, 0, 360, false, 0x5c4033).setStrokeStyle(2, 0x000000);

        // Corpo Gordo
        const bodyPart = scene.add.rectangle(0, 0, 60, 65, 0x5c4033);
        bodyPart.setStrokeStyle(3, 0x000000);

        // Rosto
        const snout = scene.add.arc(0, -10, 14, 0, 360, false, 0x8c6d58).setStrokeStyle(2, 0x000000);

        // Olhos Pie-cut
        const eyeL = scene.add.text(-10, -22, '▼', { font: '11px Arial', fill: '#000000' }).setOrigin(0.5);
        const eyeR = scene.add.text(10, -22, '▼', { font: '11px Arial', fill: '#000000' }).setOrigin(0.5);

        this.add([earL, earR, bodyPart, snout, eyeL, eyeR]);
    }

    update() {
        if (this.isDefeated) return;

        // Animação cômica de caminhada (rebolado/oscilação vertical do Urso)
        this.scaleY = 1.0 + Math.abs(Math.sin(this.scene.time.now * 0.01) * 0.08);
        super.update();
    }
}

// ==========================================
// 3. ENTIDADE: SOLDADO COMUM (FILA)
// ==========================================
export class Soldier extends Enemy {
    constructor(scene, x, y) {
        // HP = 2, MaxSpeed = 1.1
        super(scene, x, y, 45, 60, 'enemy_soldier', 2, 1.1);

        // Armadura/Corpo Vermelho
        const bodyPart = scene.add.rectangle(0, 5, 38, 50, 0xd93636);
        bodyPart.setStrokeStyle(2, 0x000000);

        // Capacete Metálico
        const helmet = scene.add.arc(0, -20, 16, 180, 360, false, 0x88889f);
        helmet.setStrokeStyle(2, 0x000000);

        // Olhar sob o capacete
        const eyeL = scene.add.text(-6, -15, '●', { font: '8px Arial', fill: '#000000' }).setOrigin(0.5);
        const eyeR = scene.add.text(6, -15, '●', { font: '8px Arial', fill: '#000000' }).setOrigin(0.5);

        this.add([bodyPart, helmet, eyeL, eyeR]);
    }

    update() {
        if (this.isDefeated) return;

        // --- Lógica de Fila Indiana ---
        let blocked = false;
        let frontSpeed = this.maxSpeed;

        const myX = this.x;
        const myY = this.y;

        // Percorre os inimigos da fase para ver se há alguém logo à frente
        this.scene.enemies.forEach(other => {
            if (other === this || other.isDefeated) return;

            const dx = myX - other.x;
            const dy = Math.abs(myY - other.y);

            // Se o inimigo da frente está a menos de 75px de distância e no mesmo plano vertical (dy < 30)
            if (dx > 0 && dx < 75 && dy < 30) {
                blocked = true;
                frontSpeed = Math.min(frontSpeed, other.speed); // Limita à velocidade dele
            }
        });

        if (blocked) {
            this.speed = frontSpeed; // Fila travada/desacelerada
        } else {
            // Recupera gradualmente a velocidade se o caminho estiver livre
            if (this.speed < this.maxSpeed && this.hp === this.maxHp) {
                this.speed = Math.min(this.speed + 0.05, this.maxSpeed);
            }
        }

        super.update();
    }
}

// ==========================================
// 4. ENTIDADE: SOLDADO ESCUDEIRO (PROTETOR DE GOLIAS)
// ==========================================
export class ShieldSoldier extends Enemy {
    constructor(scene, x, y) {
        // HP = 4 (Mais resistente), MaxSpeed = 0.8 (Lento devido ao peso do escudo)
        super(scene, x, y, 50, 65, 'enemy_shield', 4, 0.8);

        // Armadura cinza
        const bodyPart = scene.add.rectangle(5, 5, 36, 52, 0x5c5c7a);
        bodyPart.setStrokeStyle(2, 0x000000);

        // Grande escudo na esquerda (frente de combate)
        const shield = scene.add.rectangle(-18, 0, 16, 62, 0x8b8b8b);
        shield.setStrokeStyle(3, 0x000000);
        
        // Detalhe dourado no escudo
        const symbol = scene.add.rectangle(-18, 0, 6, 20, 0xd9a05b);

        this.add([bodyPart, shield, symbol]);
    }
}

// ==========================================
// 5. ENTIDADE: GOLIAS (CHEFE COM CORPO COMPOSTO)
// ==========================================
export class Goliath extends Enemy {
    constructor(scene, x, y) {
        // --- Criar Corpo Composto no Matter.js usando a biblioteca nativa do Matter ---
        const Matter = scene.matter.world.lib;

        const mainPart = Matter.Bodies.circle(0, 15, 34, { 
            label: 'goliath_main',
            density: 0.08
        });
        
        const headPart = Matter.Bodies.circle(0, -32, 16, { 
            label: 'goliath_head',
            isSensor: true, // Sensor detecta impacto mas não atrapalha a caminhada física do corpo
            density: 0.01
        });

        // Junta as partes no corpo composto
        const compoundBody = Matter.Body.create({
            parts: [mainPart, headPart],
            friction: 0.2,
            restitution: 0.1,
            label: 'enemy_goliath'
        });

        // Chama o construtor base passando o corpo composto personalizado
        super(scene, x, y, 70, 90, 'enemy_goliath', 5, 0.8, compoundBody);

        // Crucial: Apontar a referência do game object de volta para este container em todas as partes
        compoundBody.parts.forEach(part => {
            part.gameObject = this;
        });

        // --- Visual de Golias (Estilo Gigante Cartoon) ---
        // Corpo Gigante com armadura de bronze
        const giantBody = scene.add.rectangle(0, 15, 66, 66, 0xb87333);
        giantBody.setStrokeStyle(3, 0x000000);

        // Cabeça
        const head = scene.add.arc(0, -32, 16, 0, 360, false, 0xd9a05b);
        head.setStrokeStyle(2, 0x000000);

        // Elmo com pluma vermelha
        const helmet = scene.add.arc(0, -42, 18, 180, 360, false, 0x88889f).setStrokeStyle(2, 0x000000);
        const plume = scene.add.arc(0, -50, 8, 0, 360, false, 0xd93636).setStrokeStyle(1, 0x000000);

        // Expressão malvada
        const eyeL = scene.add.text(-7, -36, '▼', { font: '9px Arial', fill: '#000000' }).setOrigin(0.5);
        const eyeR = scene.add.text(7, -36, '▼', { font: '9px Arial', fill: '#000000' }).setOrigin(0.5);

        this.add([giantBody, head, helmet, plume, eyeL, eyeR]);
    }

    update() {
        if (this.isDefeated) return;

        // --- Verifica se o Escudeiro de Golias está Vivo ---
        let shieldAlive = false;
        this.scene.enemies.forEach(other => {
            if (other.label === 'enemy_shield' && !other.isDefeated) {
                shieldAlive = true;
            }
        });

        if (shieldAlive) {
            // Caminha lentamente atrás da proteção do Escudeiro
            this.speed = 0.4;
        } else {
            // Escudeiro caiu! Golias avança rápido em fúria a 2.0 (2.5x a velocidade base de 0.8)
            this.speed = 2.0;
            
            // Efeito visual de tremor na cabeça indicando fúria
            this.scaleX = 1.0 + Math.sin(this.scene.time.now * 0.03) * 0.03;
        }

        super.update();
    }
}
