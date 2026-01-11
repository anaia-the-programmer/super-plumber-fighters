const canvas = document.querySelector('#gameCanvas');
const SCREEN_WIDTH = 1024;
const SCREEN_HEIGHT = 576;
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;

const game = new Game(canvas);
const charManager = new CharacterManager();
const networkManager = new NetworkManager();
let isHost = false;

document.querySelector('#p1-preset').addEventListener('change', (e) => {
    const customUI = document.querySelector('#p1-custom');
    customUI.style.display = e.target.value === 'custom' ? 'block' : 'none';
});

function getP1Config() {
    const p1Type = document.querySelector('#p1-preset').value;
    if (p1Type === 'custom') {
        const speed = parseInt(document.querySelector('#p1-speed').value);
        const power = parseInt(document.querySelector('#p1-power').value);
        const defense = parseInt(document.querySelector('#p1-def').value);

        const attack1Dmg = 5 + power;
        const attack2Dmg = 10 + power;
        const speedStat = 3 + (speed / 2);

        return charManager.createCustomCharacter('Custom', {
            health: 100, speed: speedStat, jumpPower: 20, defense: defense
        }, {
            attack1: { damage: attack1Dmg, range: 100, duration: 400, type: 'punch' },
            attack2: { damage: attack2Dmg, range: 80, duration: 600, type: 'kick' }
        });
    } else {
        return charManager.getCharacter(p1Type);
    }
}

document.querySelector('#game-mode').addEventListener('change', async (e) => {
    const mode = e.target.value;
    const joinUI = document.querySelector('#online-join-ui');
    const hostUI = document.querySelector('#online-host-ui');
    const p2Setup = document.querySelector('.p2-setup'); // Note: might need ID selector if class not unique

    // Reset UI visibility
    if (joinUI) joinUI.style.display = 'none';
    if (hostUI) hostUI.style.display = 'none';
    // p2Setup might be hidden in online modes
    const p2Container = document.querySelector('#p2-setup-container');
    if (p2Container) p2Container.style.display = 'block';

    if (mode === 'online-host') {
        if (hostUI) hostUI.style.display = 'block';
        if (p2Container) p2Container.style.display = 'none';

        await networkManager.init();
        const id = await new Promise(resolve => networkManager.peer.on('open', resolve));
        document.querySelector('#host-id-display').innerText = id;

        networkManager.on('onOpen', () => {
            document.querySelector('#host-id-display').innerText = "CONNECTED!";
            isHost = true;
        });

        networkManager.on('onData', (data) => {
            if (data.type === 'start_req') {
                startGameAsHost(data.p2Config);
            } else if (data.type === 'input') {
                if (game.enemyController instanceof NetworkController) {
                    game.enemyController.onNetworkInput(data);
                }
            }
        });

    } else if (mode === 'online-join') {
        if (joinUI) joinUI.style.display = 'block';
        if (p2Container) p2Container.style.display = 'none';

        await networkManager.init();
    }
});

document.querySelector('#start-btn').addEventListener('click', () => {
    const mode = document.querySelector('#game-mode').value;
    const p1Config = getP1Config();

    if (mode === 'online-join') {
        const hostId = document.querySelector('#join-id').value;
        networkManager.connect(hostId);
        networkManager.on('onOpen', () => {
            networkManager.send({
                type: 'start_req',
                p2Config: p1Config
            });
            startGameAsGuest(p1Config);
        });
        return;
    }

    if (mode === 'online-host') {
        if (!isHost) {
            alert('Waiting for a player to join...');
            return;
        }
        return;
    }

    const p2Type = document.querySelector('#p2-preset').value;
    const p2Config = charManager.getCharacter(p2Type);

    document.querySelector('#lobby-overlay').style.display = 'none';

    // Update HUD Names
    const p1Select = document.querySelector('#p1-preset');
    const p2Select = document.querySelector('#p2-preset');
    const p1Name = p1Select.options[p1Select.selectedIndex].text.split(' ')[0].toUpperCase();
    // Default P2 name logic (might need adjustment if p2Select is hidden/not used in online, but safe for local)
    let p2Name = "OPPONENT";
    if (p2Select && p2Select.offsetParent !== null) {
        p2Name = p2Select.options[p2Select.selectedIndex].text.split(' ')[0].toUpperCase();
    }

    const p1NameEl = document.getElementById('p1-name');
    const p2NameEl = document.getElementById('p2-name');
    if (p1NameEl) p1NameEl.innerText = p1Name;
    if (p2NameEl) p2NameEl.innerText = p2Name;

    game.startMatch(p1Config, p2Config, mode);
});

function startGameAsHost(guestConfig) {
    const p1Config = getP1Config();
    document.querySelector('#lobby-overlay').style.display = 'none';
    game.startMatch(p1Config, guestConfig, 'online-host');

    // Hook up network sender
    const originalUpdate = game.update.bind(game);
    game.update = (dt) => {
        const keys = {
            left: game.input.isKeyDown('KeyA'),
            right: game.input.isKeyDown('KeyD'),
            up: game.input.isKeyDown('KeyW'),
            down: game.input.isKeyDown('KeyS'),
            attack1: game.input.isKeyDown('KeyJ'),
            attack2: game.input.isKeyDown('KeyK')
        };
        networkManager.send({ type: 'input', state: keys });
        originalUpdate(dt);
    };
}

function startGameAsGuest(myConfig) {
    const hostConfig = charManager.getCharacter('mario'); // Placeholder
    document.querySelector('#lobby-overlay').style.display = 'none';

    networkManager.on('onData', (data) => {
        if (data.type === 'input') {
            if (game.playerController instanceof NetworkController) {
                game.playerController.onNetworkInput(data);
            }
        }
    });

    game.startMatch(hostConfig, myConfig, 'online-guest');

    const originalUpdate = game.update.bind(game);
    game.update = (dt) => {
        const keys = {
            left: game.input.isKeyDown('KeyA'),
            right: game.input.isKeyDown('KeyD'),
            up: game.input.isKeyDown('KeyW'),
            down: game.input.isKeyDown('KeyS'),
            attack1: game.input.isKeyDown('KeyJ'),
            attack2: game.input.isKeyDown('KeyK')
        };
        networkManager.send({ type: 'input', state: keys });
        originalUpdate(dt);
    };
}

console.log('Game Initialized');
