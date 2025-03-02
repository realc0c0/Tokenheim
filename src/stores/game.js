import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { playerService } from '../services/supabase'

export const useGameStore = defineStore('game', () => {
  const player = ref({
    id: '',
    username: '',
    tokens: 0,
    level: 1,
    exp_points: 0,
    stats: {
      battlesWon: 0,
      regionsExplored: 0,
      totalTokens: 0
    }
  })

  const regions = {
    frostbyteVault: {
      name: "Frostbyte Vault",
      description: "Home to HODL Yetis who freeze players mid-battle",
      enemies: ["HODL Yeti", "Ice Goblin", "Frozen Trader"],
      difficulty: 1,
      minLevel: 1
    },
    fomoForest: {
      name: "FOMO Forest",
      description: "Trees whisper fake rumors about legendary loot ahead",
      enemies: ["Shill Spirit", "FUD Phantom", "FOMO Fox"],
      difficulty: 2,
      minLevel: 2
    },
    pumpDumpCaverns: {
      name: "Pump & Dump Caverns",
      description: "Run by Shill Goblins who inflate prices",
      enemies: ["Shill Goblin", "Pump Knight", "Dump Dragon"],
      difficulty: 3,
      minLevel: 3
    }
  }

  const currentRegion = ref(null)
  const inCombat = ref(false)
  const currentEnemy = ref(null)
  const loading = ref(false)

  // Initialize player data from database
  const initializePlayer = async (userData) => {
    try {
      loading.value = true
      const savedData = await playerService.getPlayer(userData.id)
      if (savedData) {
        player.value = {
          ...player.value,
          ...savedData,
          id: userData.id,
          username: userData.username
        }
      } else {
        // Create new player
        await playerService.updatePlayer(userData.id, {
          username: userData.username,
          tokens: player.value.tokens,
          level: player.value.level,
          exp_points: player.value.exp_points
        })
      }

      const stats = await playerService.getPlayerStats(userData.id)
      if (stats) {
        player.value.stats = {
          battlesWon: stats.battles_won,
          regionsExplored: stats.regions_explored,
          totalTokens: stats.total_tokens
        }
      } else {
        await playerService.updatePlayerStats(userData.id, player.value.stats)
      }
    } catch (error) {
      console.error('Failed to initialize player:', error)
    } finally {
      loading.value = false
    }
  }

  // Save player progress
  const saveProgress = async () => {
    try {
      await playerService.updatePlayer(player.value.id, {
        tokens: player.value.tokens,
        level: player.value.level,
        exp_points: player.value.exp_points
      })
      await playerService.updatePlayerStats(player.value.id, {
        battlesWon: player.value.stats.battlesWon,
        regionsExplored: player.value.stats.regionsExplored,
        totalTokens: player.value.stats.totalTokens
      })
    } catch (error) {
      console.error('Failed to save progress:', error)
    }
  }

  // Combat actions
  const startCombat = async () => {
    if (!currentRegion.value) return
    inCombat.value = true
    currentEnemy.value = generateEnemy(currentRegion.value)
  }

  const attack = async () => {
    if (!inCombat.value || !currentEnemy.value) return

    const damage = Math.floor(Math.random() * 20) + 10
    currentEnemy.value.health -= damage

    if (currentEnemy.value.health <= 0) {
      const tokensEarned = Math.floor(Math.random() * 30) + 20
      const expEarned = Math.floor(Math.random() * 20) + 10
      
      player.value.tokens += tokensEarned
      player.value.exp_points += expEarned
      player.value.stats.battlesWon++
      player.value.stats.totalTokens += tokensEarned

      // Level up check
      if (player.value.exp_points >= player.value.level * 100) {
        player.value.level++
        const tg = window.Telegram?.WebApp
        if (tg) {
          tg.showPopup({
            title: 'Level Up!',
            message: `Congratulations! You've reached level ${player.value.level}!`
          })
        }
      }

      // Save battle result
      await playerService.saveBattleResult(player.value.id, {
        won: true,
        tokensEarned,
        region: currentRegion.value.name,
        enemy: currentEnemy.value.type
      })

      // Save updated progress
      await saveProgress()

      inCombat.value = false
      currentEnemy.value = null
      return { won: true, tokens: tokensEarned, exp: expEarned }
    }

    return { won: false, damage }
  }

  // Region exploration
  const exploreRegion = async (regionKey) => {
    const region = regions[regionKey]
    if (!region) return

    if (player.value.level < region.minLevel) {
      const tg = window.Telegram?.WebApp
      if (tg) {
        tg.showPopup({
          title: 'Level Required',
          message: `You need to be level ${region.minLevel} to enter this region!`
        })
      }
      return false
    }

    currentRegion.value = region
    player.value.stats.regionsExplored++
    await saveProgress()
    return true
  }

  const exitRegion = () => {
    currentRegion.value = null
    inCombat.value = false
    currentEnemy.value = null
  }

  // Helper functions
  const generateEnemy = (region) => {
    const enemies = region.enemies
    const enemyType = enemies[Math.floor(Math.random() * enemies.length)]
    const difficulty = region.difficulty || 1
    
    return {
      type: enemyType,
      health: 100 * difficulty,
      maxHealth: 100 * difficulty
    }
  }

  return {
    player,
    regions,
    currentRegion,
    inCombat,
    currentEnemy,
    loading,
    initializePlayer,
    startCombat,
    attack,
    exploreRegion,
    exitRegion,
    saveProgress
  }
})
