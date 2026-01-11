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
            offset: { x: 0, y: 0 },
            width: 180, // Made wider to ensure hits
            height: 50
        };
        this.isAttacking = false;
        this.currentAttackType = null;

        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5; // animation speed
    }

    draw(ctx) {

        // Hitbox debug (optional, disabling for production feel)
        // ctx.fillStyle = this.isAttacking ? 'yellow' : 'red';
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        // Draw Character Image
        if (this.image && this.image.complete) {
            ctx.drawImage(
                this.image,
                this.position.x - this.offset.x,
                this.position.y - this.offset.y,
                this.image.width * this.scale,
                this.image.height * this.scale
            );
        } else {
            // Fallback
            ctx.fillStyle = 'red';
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        }

        // Draw Attack Box (Visual Feedback)
        if (this.isAttacking) {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.5)'; // Transparent yellow
            // Draw box in front of player
            ctx.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            );
        }
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

        // Update Attack Box Position
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        // Turn attack box based on direction (basic implementation)
        // For now, checks are generic, but eventually we'd flip offset based on facing direction
    }

    attack(type) {
        this.isAttacking = true;
        this.hasHit = false;
        this.currentAttackType = type;
        const move = this.moveSet[type];

        // Update attack box based on move
        this.attackBox.width = move.range;

        // VISUAL DISTINCTION:
        // Punch (High) vs Kick (Low)
        if (move.type.includes('kick')) {
            // Lower hitbox for kick
            this.attackBox.offset.y = 50;
        } else {
            // Default/High hitbox for punch
            this.attackBox.offset.y = 0;
        }

        setTimeout(() => {
            this.isAttacking = false;
            this.currentAttackType = null;
            this.hasHit = false;
            // Reset offset
            this.attackBox.offset.y = 0;
        }, move.duration);
    }

    takeDamage(amount) {
        const damage = Math.max(1, amount - (this.stats.defense * 0.5)); // Simple defense formula
        this.stats.currentHealth -= damage;
    }
}
