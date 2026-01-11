class Fighter {
    constructor({ position, velocity, imageSrc, scale = 1, offset = { x: 0, y: 0 }, stats = {}, moveSet = {} }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.offset = offset;

        // Stats
        this.stats = {
            maxHealth: stats.health || 100,
            currentHealth: stats.health || 100,
            speed: stats.speed || 5,
            jumpPower: stats.jumpPower || 20,
            defense: stats.defense || 1
        };

        // Move Set
        this.moveSet = moveSet || {
            attack1: { damage: 10, range: 100, duration: 100, type: 'hit' },
            attack2: { damage: 20, range: 80, duration: 200, type: 'hit' } // Slower but stronger
        };

        this.lastKey;
        this.attackBox = {
            position: { x: this.position.x, y: this.position.y },
            offset: { x: 0, y: 0 },
            width: 100,
            height: 50
        };
        this.isAttacking = false;
        this.currentAttackType = null;

        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5; // animation speed
    }

    draw(ctx) {
        // Temporary Hitbox drawing
        ctx.fillStyle = this.isAttacking ? 'yellow' : 'red';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        // Draw Image (Placeholder for full sprite logic)
        // ctx.drawImage(this.image, this.position.x, this.position.y);
    }

    update(deltaTime, canvasHeight, controller) {


        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Apply Logic from Controller
        this.velocity.x = 0;
        if (controller.input.left) {
            this.velocity.x = -this.stats.speed;
        } else if (controller.input.right) {
            this.velocity.x = this.stats.speed;
        }

        if (controller.input.up && this.velocity.y === 0) {
            this.velocity.y = -this.stats.jumpPower;
        }

        if (controller.input.attack1 && !this.isAttacking) {
            this.attack('attack1');
        } else if (controller.input.attack2 && !this.isAttacking) {
            this.attack('attack2');
        }


        // Gravity
        if (this.position.y + this.height + this.velocity.y >= canvasHeight - 96) {
            this.velocity.y = 0;
            this.position.y = 330; // Ground hack
        } else {
            this.velocity.y += 0.7; // Gravity
        }
    }

    attack(type) {
        this.isAttacking = true;
        this.hasHit = false;
        this.currentAttackType = type;
        const move = this.moveSet[type];

        // Update attack box based on move
        this.attackBox.width = move.range;

        setTimeout(() => {
            this.isAttacking = false;
            this.currentAttackType = null;
            this.hasHit = false;
        }, move.duration);
    }

    takeDamage(amount) {
        const damage = Math.max(1, amount - (this.stats.defense * 0.5)); // Simple defense formula
        this.stats.currentHealth -= damage;
    }
}
