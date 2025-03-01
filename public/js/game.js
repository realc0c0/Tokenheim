const tg = window.Telegram.WebApp;

class Game {
    constructor() {
        this.player = {
            tokens: 0,
            health: 100,
            inventory: []
        };
        
        this.currentRegion = null;
        this.regions = {
            frostbyteVault: {
                name: "Frostbyte Vault",
                description: "Home to HODL Yetis who freeze players mid-battle",
                enemies: ["HODL Yeti", "Ice Goblin", "Frozen Trader"]
            },
            fomoForest: {
                name: "FOMO Forest",
                description: "Trees whisper fake rumors about legendary loot ahead",
                enemies: ["Shill Spirit", "FUD Phantom", "FOMO Fox"]
            },
            pumpDumpCaverns: {
                name: "Pump & Dump Caverns",
                description: "Run by Shill Goblins who inflate prices",
                enemies: ["Shill Goblin", "Pump Knight", "Dump Dragon"]
            }
        };

        this.initTelegram();
        this.initUI();
        this.bindEvents();
    }

    initTelegram() {
        tg.ready();
        tg.expand();
        
        // Set theme colors
        document.documentElement.style.setProperty('--background', tg.themeParams.bg_color);
        document.documentElement.style.setProperty('--text', tg.themeParams.text_color);
    }

    initUI() {
        this.tokenDisplay = document.getElementById('token-display');
        this.healthDisplay = document.getElementById('health-display');
        this.sceneContainer = document.getElementById('scene-container');
        this.updateStats();
    }

    bindEvents() {
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.classList[1];
                this.handleCombatAction(action);
            });
        });

        // Handle Telegram back button
        tg.BackButton.onClick(() => this.handleBackButton());
    }

    updateStats() {
        this.tokenDisplay.textContent = `🪙 ${this.player.tokens}`;
        this.healthDisplay.textContent = `❤️ ${this.player.health}`;
    }

    async enterRegion(regionKey) {
        this.currentRegion = this.regions[regionKey];
        
        // Show region transition
        this.sceneContainer.innerHTML = `
            <div class="region-intro">
                <h2>${this.currentRegion.name}</h2>
                <p>${this.currentRegion.description}</p>
            </div>
        `;

        // Enable back button
        tg.BackButton.show();

        // Random encounter chance
        if (Math.random() > 0.5) {
            await this.startCombat();
        }
    }

    async startCombat() {
        const enemy = this.getRandomEnemy();
        document.getElementById('combat-ui').classList.remove('hidden');
        document.getElementById('enemy-info').innerHTML = `
            <div class="enemy-card">
                <h3>${enemy}</h3>
                <div class="enemy-stats">
                    ⚔️ Attack: ${Math.floor(Math.random() * 20) + 10}
                    🛡️ Defense: ${Math.floor(Math.random() * 15) + 5}
                </div>
            </div>
        `;
    }

    handleCombatAction(action) {
        switch(action) {
            case 'attack':
                this.player.tokens += Math.floor(Math.random() * 10) + 1;
                break;
            case 'defend':
                if (this.player.tokens >= 10) {
                    this.player.tokens -= 10;
                    this.player.health = Math.min(100, this.player.health + 20);
                } else {
                    tg.showAlert("Not enough tokens! Need 10 🪙");
                    return;
                }
                break;
            case 'special':
                if (this.player.tokens >= 20) {
                    this.player.tokens -= 20;
                    // Special attack animation and effects would go here
                } else {
                    tg.showAlert("Not enough tokens! Need 20 🪙");
                    return;
                }
                break;
        }
        
        this.updateStats();
        
        // 20% chance to end combat
        if (Math.random() < 0.2) {
            this.endCombat();
        }
    }

    endCombat() {
        document.getElementById('combat-ui').classList.add('hidden');
        const loot = Math.floor(Math.random() * 30) + 10;
        this.player.tokens += loot;
        this.updateStats();
        tg.showAlert(`Victory! You earned ${loot} 🪙 tokens!`);
    }

    getRandomEnemy() {
        const enemies = this.currentRegion.enemies;
        return enemies[Math.floor(Math.random() * enemies.length)];
    }

    handleBackButton() {
        if (this.currentRegion) {
            this.currentRegion = null;
            this.sceneContainer.innerHTML = '';
            document.getElementById('combat-ui').classList.add('hidden');
            tg.BackButton.hide();
        }
    }
}

// Initialize game when document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
