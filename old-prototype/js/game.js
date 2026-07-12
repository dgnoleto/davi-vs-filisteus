const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    parent: 'game-container',
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 1 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let stone;
let slingshotJoint;
let isDragging = false;
let canDrag = true;
let anchor = { x: 200, y: 400 };

let enemies = [];
let oldStones = [];        
let shotsRemaining = 5;
let gameState = 'playing';

let shotsText;
let messageText;
let aimGraphics;           

// --- Parâmetros da mira ---
const LAUNCH_MULTIPLIER = 0.18;   
const GRAVITY_PER_FRAME = 0.5;    
const AIM_DOTS = 10;               
const AIM_FRAMES_PER_DOT = 4;      

const MAX_PULL_RADIUS = 120;      
const MAX_PULL_DOWN = 70;         

function preload() {}

function create() {
    enemies = [];
    oldStones = [];
    shotsRemaining = 5;
    gameState = 'playing';
    isDragging = false;
    canDrag = true;

    this.matter.world.setBounds(0, 0, 960, 540, 64, true, true, true, true);

    const blockOptions = { density: 0.01, friction: 0.5, restitution: 0.1 };
    this.matter.add.rectangle(700, 480, 40, 80, blockOptions);
    this.matter.add.rectangle(780, 480, 40, 80, blockOptions);
    this.matter.add.rectangle(740, 420, 140, 40, blockOptions);

    const philistine = this.matter.add.circle(740, 380, 20, { label: 'enemy', density: 0.005 });
    const goliath = this.matter.add.circle(860, 480, 35, { label: 'goliath', density: 0.08 });

    enemies.push({ body: philistine, initialY: 380, alive: true });
    enemies.push({ body: goliath, initialY: 480, alive: true });

    spawnStone(this);

    aimGraphics = this.add.graphics();

    this.input.on('pointerdown', (pointer) => {
        if (!canDrag || gameState !== 'playing') return;

        const distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, stone.position.x, stone.position.y);
        if (distance < 40) {
            isDragging = true;
            this.matter.body.setStatic(stone, true);
            stone.isSensor = true; 
        }
    });

    this.input.on('pointermove', (pointer) => {
        if (!isDragging) return;

        const distance = Phaser.Math.Distance.Between(pointer.x, pointer.y, anchor.x, anchor.y);
        let newPos;
        if (distance < MAX_PULL_RADIUS) {
            newPos = { x: pointer.x, y: pointer.y };
        } else {
            const angle = Phaser.Math.Angle.Between(anchor.x, anchor.y, pointer.x, pointer.y);
            newPos = {
                x: anchor.x + Math.cos(angle) * MAX_PULL_RADIUS,
                y: anchor.y + Math.sin(angle) * MAX_PULL_RADIUS
            };
        }

        newPos.y = Math.min(newPos.y, anchor.y + MAX_PULL_DOWN);

        this.matter.body.setPosition(stone, newPos);
        drawTrajectory(newPos);
    });

    this.input.on('pointerup', () => {
        if (!isDragging) return;
        isDragging = false;
        canDrag = false;
        aimGraphics.clear();

        this.matter.body.setStatic(stone, false);
        stone.isSensor = false; 

        this.time.delayedCall(100, () => {
            this.matter.world.removeConstraint(slingshotJoint);
        });

        shotsRemaining--;
        updateShotsText();
        oldStones.push(stone);

        this.time.delayedCall(2500, () => {
            if (gameState !== 'playing') return;
            if (shotsRemaining > 0) {
                spawnStone(this);
            } else {
                this.time.delayedCall(1000, () => { checkLossCondition(); });
            }
        });
    });

    shotsText = this.add.text(20, 20, '', { fill: '#0f0', fontSize: '20px' });
    updateShotsText();

    this.add.text(20, 50, 'Reiniciar Fase', { fill: '#0f0', fontSize: '20px' })
        .setInteractive()
        .on('pointerdown', () => this.scene.restart());

    messageText = this.add.text(480, 270, '', { fill: '#fff', fontSize: '32px', fontStyle: 'bold', align: 'center' })
        .setOrigin(0.5);
}

function spawnStone(scene) {
    oldStones.forEach(oldBody => scene.matter.world.remove(oldBody));
    oldStones = [];

    stone = scene.matter.add.circle(anchor.x, anchor.y, 15, {
        density: 0.05,
        restitution: 0.4,
        friction: 0.1
    });

    slingshotJoint = scene.matter.add.worldConstraint(stone, 0, 0.05, {
        pointA: { x: anchor.x, y: anchor.y },
        render: { visible: true, lineColor: 0xffffff, lineThickness: 3 }
    });

    canDrag = true;
}

function drawTrajectory(currentPos) {
    aimGraphics.clear();
    aimGraphics.fillStyle(0xffffff, 0.6);

    const pull = { x: anchor.x - currentPos.x, y: anchor.y - currentPos.y };

    let x = currentPos.x;
    let y = currentPos.y;
    let vx = pull.x * LAUNCH_MULTIPLIER;
    let vy = pull.y * LAUNCH_MULTIPLIER;

    for (let i = 0; i < AIM_DOTS; i++) {
        for (let f = 0; f < AIM_FRAMES_PER_DOT; f++) {
            vy += GRAVITY_PER_FRAME / AIM_FRAMES_PER_DOT;
            x += vx / AIM_FRAMES_PER_DOT;
            y += vy / AIM_FRAMES_PER_DOT;
        }
        aimGraphics.fillCircle(x, y, 4);
    }
}

function updateShotsText() {
    if (shotsText) shotsText.setText('Pedras restantes: ' + Math.max(shotsRemaining, 0));
}

function checkWinCondition() {
    if (gameState !== 'playing') return;
    const allDead = enemies.every(e => !e.alive);
    if (allDead) {
        gameState = 'won';
        messageText.setText('VITÓRIA!\nOs filisteus foram derrotados.');
        messageText.setColor('#0f0');
    }
}

function checkLossCondition() {
    if (gameState !== 'playing') return;
    const allDead = enemies.every(e => !e.alive);
    if (!allDead) {
        gameState = 'lost';
        messageText.setText('DERROTA!\nAcabaram as pedras.');
        messageText.setColor('#f00');
    }
}

function update() {
    if (gameState !== 'playing') return;

    enemies.forEach(enemy => {
        if (enemy.alive) {
            const fellFromStructure = enemy.body.position.y - enemy.initialY > 60;
            const rolledOnGround = enemy.body.position.y > 490;
            if (fellFromStructure || rolledOnGround) {
                enemy.alive = false;
            }
        }
    });

    checkWinCondition();
}