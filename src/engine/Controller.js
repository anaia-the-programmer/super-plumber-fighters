class Controller {
    constructor() {
        this.input = {
            left: false,
            right: false,
            up: false,
            down: false,
            attack1: false,
            attack2: false
        };
    }

    update(fighter, opponent, gameState) {
        // Override me
    }
}

class PlayerController extends Controller {
    constructor(inputHandler, keyMap) {
        super();
        this.inputHandler = inputHandler;
        this.keyMap = keyMap || {
            left: 'KeyA',
            right: 'KeyD',
            up: 'KeyW',
            down: 'KeyS',
            attack1: 'Space',
            attack2: 'KeyF' // Secondary attack
        };
    }

    update() {
        this.input.left = this.inputHandler.isKeyDown(this.keyMap.left);
        this.input.right = this.inputHandler.isKeyDown(this.keyMap.right);
        this.input.up = this.inputHandler.isKeyDown(this.keyMap.up);
        this.input.down = this.inputHandler.isKeyDown(this.keyMap.down);
        this.input.attack1 = this.inputHandler.isKeyDown(this.keyMap.attack1);
        this.input.attack2 = this.inputHandler.isKeyDown(this.keyMap.attack2);
    }
}

class AIController extends Controller {
    constructor() {
        super();
        this.changeActionTimer = 0;
        this.reactionTime = 500; // ms
        this.targetDistance = 100;
    }

    update(fighter, opponent, deltaTime) {
        this.changeActionTimer += deltaTime * 1000;

        if (this.changeActionTimer > this.reactionTime) {
            this.changeActionTimer = 0;
            this.decideMove(fighter, opponent);
        }
    }

    decideMove(fighter, opponent) {
        // Reset inputs
        this.input.left = false;
        this.input.right = false;
        this.input.up = false;
        this.input.attack1 = false;
        this.input.attack2 = false;

        const distance = Math.abs(fighter.position.x - opponent.position.x);

        if (distance > this.targetDistance) {
            // Move towards opponent
            if (fighter.position.x < opponent.position.x) {
                this.input.right = true;
            } else {
                this.input.left = true;
            }
        } else {
            // Attack!
            if (Math.random() > 0.5) {
                this.input.attack1 = true;
            } else {
                this.input.attack2 = true;
            }
        }
    }
}
