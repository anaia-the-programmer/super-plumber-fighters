class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.input = new InputHandler();

        this.lastTime = 0;
        this.loop = this.loop.bind(this);

        this.background = new Image();
        this.background.src = './assets/background.png';

        // Default Fighters (Placeholder)
        this.player = new Fighter({ position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, imageSrc: '' });
        this.enemy = new Fighter({ position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, imageSrc: '' });
        this.timers = [];
    }

    startMatch(playerConfig, enemyConfig, mode) {
        // Reset timers
        if (this.timers) this.timers.forEach(t => clearTimeout(t));

        // Mode Setup
        if (mode === 'ai') {
            this.playerController = new PlayerController(this.input);
            this.enemyController = new AIController();
        } else if (mode === 'online-host') {
            // Host Controls P1, Network Controls P2
            this.playerController = new PlayerController(this.input);
            this.enemyController = new NetworkController();
        } else if (mode === 'online-guest') {
            // Network Controls P1, Guest Controls P2 (locally)
            this.playerController = new NetworkController();
            // We use standard player Controller for P2 but mapped to WASD for convenience if logic allows, 
            // or just use default WASD and mapped in main.js as "guestKeys" that we send.
            // But for local control of the Fighter instance:
            this.enemyController = new PlayerController(this.input, {
                left: 'KeyA', right: 'KeyD', up: 'KeyW', down: 'KeyS', attack1: 'Space', attack2: 'KeyF'
            });
        } else {
            // Local PvP: P1 uses WASD, P2 uses Arrows
            this.playerController = new PlayerController(this.input, {
                left: 'KeyA', right: 'KeyD', up: 'KeyW', down: 'KeyS', attack1: 'Space', attack2: 'KeyF'
            });
            this.enemyController = new PlayerController(this.input, {
                left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown', attack1: 'ControlRight', attack2: 'ShiftRight' // Example keys
            });
        }

        // Initialize Fighters
        this.player = new Fighter({
            position: { x: 100, y: 0 },
            velocity: { x: 0, y: 0 },
            imageSrc: playerConfig.imageSrc,
            offset: { x: 0, y: 0 },
            stats: playerConfig.stats,
            moveSet: playerConfig.moveSet
        });

        this.enemy = new Fighter({
            position: { x: 800, y: 0 },
            velocity: { x: 0, y: 0 },
            imageSrc: enemyConfig.imageSrc,
            offset: { x: 0, y: 0 },
            stats: enemyConfig.stats,
            moveSet: enemyConfig.moveSet
        });

        this.start();

        // Reset Health UI
        document.querySelector('#playerHealth').style.width = '100%';
        document.querySelector('#enemyHealth').style.width = '100%';
        document.querySelector('#timer').innerHTML = 60;
        document.querySelector('#timer').style.width = '100px';
    }

    loop(timestamp) {
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        if (this.timer > 0) {
            requestAnimationFrame(this.loop);
        }
    }

    update(deltaTime) {
        // Update Controllers
        this.playerController.update(this.player, this.enemy, deltaTime);
        this.enemyController.update(this.enemy, this.player, deltaTime);

        // Update Fighters
        this.player.update(deltaTime, this.canvas.height, this.playerController);
        this.enemy.update(deltaTime, this.canvas.height, this.enemyController);

        // Collision Detection
        if (this.player.isAttacking && this.player.framesCurrent === 4) { // frame check logic placeholder
            // Actually, simplified check for now
        }

        // Attack Checks (Simple overlap for now, should rely on specific frame in future)
        if (this.player.isAttacking && this.player.currentAttackType) {
            this.checkCollision(this.player, this.enemy);
        }

        if (this.enemy.isAttacking && this.enemy.currentAttackType) {
            this.checkCollision(this.enemy, this.player);
        }
    }

    checkCollision(attacker, defender) {
        if (
            attacker.attackBox.position.x + attacker.attackBox.width >= defender.position.x &&
            attacker.attackBox.position.x <= defender.position.x + defender.width &&
            attacker.attackBox.position.y + attacker.attackBox.height >= defender.position.y &&
            attacker.attackBox.position.y <= defender.position.y + defender.height
        ) {
            // attacker.isAttacking is already true if we are here, but we need to ensure not to multi-hit
            // So we use a flag or just check if it's the right "frame" conceptually. 
            // For MVP refactor:

            // If already hit this attack instance, return. 
            // (We need a way to track "hasHit" per attack. Adding to Fighter temporarily)
            if (attacker.hasHit) return;

            attacker.hasHit = true; // Needs reset on attack end

            const attackType = attacker.currentAttackType;
            const damage = attacker.moveSet[attackType].damage;

            defender.takeDamage(damage);

            // Update UI
            // TODO: Move UI updates to a UI Manager
            if (attacker === this.player) {
                document.querySelector('#enemyHealth').style.width = defender.stats.currentHealth + '%';
            } else {
                document.querySelector('#playerHealth').style.width = defender.stats.currentHealth + '%';
            }

            if (defender.stats.currentHealth <= 0) {
                this.determineWinner({ player: this.player, enemy: this.enemy });
            }
        }
    }

    determineWinner({ player, enemy }) {
        clearTimeout(this.timerId);
        document.querySelector('#timer').innerHTML = 'Game Over';
        document.querySelector('#timer').style.width = '300px';

        if (player.stats.currentHealth === enemy.stats.currentHealth) {
            document.querySelector('#timer').innerHTML = 'Tie';
        } else if (player.stats.currentHealth > enemy.stats.currentHealth) {
            document.querySelector('#timer').innerHTML = 'Player 1 Wins';
        } else {
            document.querySelector('#timer').innerHTML = 'Player 2 Wins';
        }
        this.timer = 0; // Stop loop
    }

    decreaseTimer() {
        if (this.timer > 0) {
            this.timerId = setTimeout(() => this.decreaseTimer(), 1000);
            this.timer--;
            document.querySelector('#timer').innerHTML = this.timer;
        }

        if (this.timer === 0) {
            this.determineWinner({ player: this.player, enemy: this.enemy });
        }
    }

    start() {
        this.timer = 60;
        this.decreaseTimer();
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop);
    }

    draw() {
        // Clear screen
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Background
        if (this.background.complete) {
            this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
        }

        this.player.draw(this.ctx);
        this.enemy.draw(this.ctx);
    }
}
