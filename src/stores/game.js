import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    player: {
      id: '',
      username: '',
      photoUrl: '',
      tokens: 0,
      health: 100,
      experience: 0,
      level: 1,
      inventory: [],
      stats: {
        battlesWon: 0,
        regionsExplored: 0,
        totalTokens: 0
      }
    },
    currentRegion: null,
    regions: {
      frostbyteVault: {
        name: "Frostbyte Vault",
        description: "Home to HODL Yetis who freeze players mid-battle",
        enemies: ["HODL Yeti", "Ice Goblin", "Frozen Trader"],
        difficulty: 1
      },
      fomoForest: {
        name: "FOMO Forest",
        description: "Trees whisper fake rumors about legendary loot ahead",
        enemies: ["Shill Spirit", "FUD Phantom", "FOMO Fox"],
        difficulty: 2
      },
      pumpDumpCaverns: {
        name: "Pump & Dump Caverns",
        description: "Run by Shill Goblins who inflate prices",
        enemies: ["Shill Goblin", "Pump Knight", "Dump Dragon"],
        difficulty: 3
      }
    },
    currentEnemy: null,
    inCombat: false,
    telegramApp: null,
    lastSaveTime: 0
  }),

  actions: {
    initGame(tg) {
      this.telegramApp = tg
      
      // Get user data from Telegram
      if (tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user
        this.player.id = user.id
        this.player.username = user.username || 'Anonymous Player'
        this.player.photoUrl = user.photo_url
      }

      // Load saved data from server
      this.loadGameData()
    },

    async loadGameData() {
      if (!this.player.id) return

      try {
        const response = await fetch(`/api/users/${this.player.id}`)
        const data = await response.json()
        if (data.success) {
          this.player = {
            ...this.player,
            ...data.userData
          }
        }
      } catch (error) {
        console.error('Failed to load game data:', error)
      }
    },

    async saveGameData() {
      if (!this.player.id || Date.now() - this.lastSaveTime < 5000) return
      
      try {
        const response = await fetch(`/api/users/${this.player.id}/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            initData: this.telegramApp.initData,
            gameData: {
              username: this.player.username,
              tokens: this.player.tokens,
              health: this.player.health,
              experience: this.player.experience,
              level: this.player.level,
              stats: this.player.stats
            }
          })
        })

        if (response.ok) {
          this.lastSaveTime = Date.now()
        }
      } catch (error) {
        console.error('Failed to save game data:', error)
      }
    },

    enterRegion(regionKey) {
      this.currentRegion = this.regions[regionKey]
      this.telegramApp.BackButton.show()
      
      // Update stats
      this.player.stats.regionsExplored++
      this.saveGameData()
      
      // Random encounter chance
      if (Math.random() > 0.3) {
        this.startCombat()
      }
    },

    startCombat() {
      const enemies = this.currentRegion.enemies
      const enemyName = enemies[Math.floor(Math.random() * enemies.length)]
      const difficulty = this.currentRegion.difficulty

      this.currentEnemy = {
        name: enemyName,
        attack: Math.floor(Math.random() * 10 + 10) * difficulty,
        defense: Math.floor(Math.random() * 5 + 5) * difficulty,
        health: 100 * difficulty
      }
      this.inCombat = true
    },

    handleCombatAction(action) {
      if (!this.currentEnemy) return

      let damage = 0
      let tokenReward = 0
      let expReward = 0

      switch(action) {
        case 'attack':
          damage = Math.floor(Math.random() * 20 + 10)
          tokenReward = Math.floor(Math.random() * 5 + 1)
          expReward = 10
          break
          
        case 'defend':
          if (this.player.tokens >= 10) {
            this.player.tokens -= 10
            this.player.health = Math.min(100, this.player.health + 20)
            damage = Math.floor(Math.random() * 10 + 5)
            expReward = 5
          } else {
            this.telegramApp.showAlert("Not enough tokens! Need 10 ")
            return
          }
          break
          
        case 'special':
          if (this.player.tokens >= 20) {
            this.player.tokens -= 20
            damage = Math.floor(Math.random() * 40 + 20)
            expReward = 20
          } else {
            this.telegramApp.showAlert("Not enough tokens! Need 20 ")
            return
          }
          break
      }

      // Apply damage and rewards
      this.currentEnemy.health -= damage
      this.player.tokens += tokenReward
      this.player.experience += expReward
      
      // Level up check
      if (this.player.experience >= this.player.level * 100) {
        this.player.level++
        this.telegramApp.showAlert(`Level Up! You are now level ${this.player.level}! `)
      }

      // Enemy counterattack
      const enemyDamage = Math.max(0, this.currentEnemy.attack - (action === 'defend' ? 10 : 0))
      this.player.health = Math.max(0, this.player.health - enemyDamage)

      // Check battle end conditions
      if (this.currentEnemy.health <= 0) {
        this.endCombat(true)
      } else if (this.player.health <= 0) {
        this.endCombat(false)
      }

      // Save progress
      this.saveGameData()
    },

    endCombat(victory) {
      this.inCombat = false
      
      if (victory) {
        const bonus = this.currentRegion.difficulty * 10
        const loot = Math.floor(Math.random() * bonus + bonus)
        this.player.tokens += loot
        this.player.stats.battlesWon++
        this.player.stats.totalTokens += loot
        this.telegramApp.showAlert(`Victory! You earned ${loot}  tokens!`)
      } else {
        this.telegramApp.showAlert("Defeat! You've been knocked out!")
        this.player.health = 50 // Revive with half health
      }

      this.currentEnemy = null
      this.saveGameData()
    },

    exitRegion() {
      this.currentRegion = null
      this.inCombat = false
      this.currentEnemy = null
      this.telegramApp.BackButton.hide()
      this.saveGameData()
    }
  }
})
