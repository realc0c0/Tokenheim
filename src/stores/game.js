import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    player: {
      tokens: 0,
      health: 100,
      inventory: []
    },
    currentRegion: null,
    regions: {
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
    },
    currentEnemy: null,
    inCombat: false,
    telegramApp: null
  }),

  actions: {
    initGame(tg) {
      this.telegramApp = tg
    },

    enterRegion(regionKey) {
      this.currentRegion = this.regions[regionKey]
      this.telegramApp.BackButton.show()
      
      // Random encounter chance
      if (Math.random() > 0.5) {
        this.startCombat()
      }
    },

    startCombat() {
      const enemies = this.currentRegion.enemies
      this.currentEnemy = {
        name: enemies[Math.floor(Math.random() * enemies.length)],
        attack: Math.floor(Math.random() * 20) + 10,
        defense: Math.floor(Math.random() * 15) + 5
      }
      this.inCombat = true
    },

    handleCombatAction(action) {
      switch(action) {
        case 'attack':
          this.player.tokens += Math.floor(Math.random() * 10) + 1
          break
        case 'defend':
          if (this.player.tokens >= 10) {
            this.player.tokens -= 10
            this.player.health = Math.min(100, this.player.health + 20)
          } else {
            this.telegramApp.showAlert("Not enough tokens! Need 10 🪙")
            return
          }
          break
        case 'special':
          if (this.player.tokens >= 20) {
            this.player.tokens -= 20
          } else {
            this.telegramApp.showAlert("Not enough tokens! Need 20 🪙")
            return
          }
          break
      }

      // 20% chance to end combat
      if (Math.random() < 0.2) {
        this.endCombat()
      }
    },

    endCombat() {
      this.inCombat = false
      this.currentEnemy = null
      const loot = Math.floor(Math.random() * 30) + 10
      this.player.tokens += loot
      this.telegramApp.showAlert(`Victory! You earned ${loot} 🪙 tokens!`)
    },

    exitRegion() {
      this.currentRegion = null
      this.inCombat = false
      this.currentEnemy = null
      this.telegramApp.BackButton.hide()
    }
  }
})
