class InputHandler {
    constructor() {
        this.keys = new Set();
        this.setupListeners();
        this.setupTouchControls();
    }

    setupListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys.add(e.code);
        });

        window.addEventListener('keyup', (e) => {
            this.keys.delete(e.code);
        });
    }

    setupTouchControls() {
        const bindTouch = (id, code) => {
            const btn = document.getElementById(id);
            if (!btn) return;

            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.keys.add(code);
            });

            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys.delete(code);
            });
        };

        bindTouch('btn-left', 'KeyA');
        bindTouch('btn-right', 'KeyD');
        bindTouch('btn-up', 'KeyW');
        bindTouch('btn-down', 'KeyS');
        bindTouch('btn-attack1', 'Space');
        bindTouch('btn-attack2', 'KeyF');
    }

    isKeyDown(code) {
        return this.keys.has(code);
    }
}
