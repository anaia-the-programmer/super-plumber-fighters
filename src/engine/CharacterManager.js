class CharacterManager {
    constructor() {
        this.presets = {
            mario: {
                name: 'Mario',
                imageSrc: './assets/mario.png',
                stats: { health: 100, speed: 7, jumpPower: 20 },
                moveSet: {
                    attack1: { damage: 10, range: 100, duration: 400, type: 'punch' },
                    attack2: { damage: 15, range: 80, duration: 600, type: 'kick' }
                }
            },
            luigi: {
                name: 'Luigi',
                imageSrc: './assets/luigi.png',
                stats: { health: 100, speed: 5, jumpPower: 18 },
                moveSet: {
                    attack1: { damage: 8, range: 100, duration: 400, type: 'punch' },
                    attack2: { damage: 12, range: 80, duration: 600, type: 'kick' }
                }
            },
            spiderman: {
                name: 'Spider-Man',
                imageSrc: './assets/spiderman.png',
                stats: { health: 90, speed: 9, jumpPower: 25 },
                moveSet: {
                    attack1: { damage: 8, range: 120, duration: 300, type: 'web_punch' }, // Fast
                    attack2: { damage: 18, range: 150, duration: 700, type: 'web_kick' } // Long range
                }
            }
        };
    }

    getCharacter(name) {
        return this.presets[name.toLowerCase()] || this.presets['mario'];
    }

    createCustomCharacter(name, stats, moveSet) {
        return {
            name,
            imageSrc: './assets/mario.png', // Default or need a custom asset uploader/selector
            stats,
            moveSet
        };
    }
}
