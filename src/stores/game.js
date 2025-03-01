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
        player.value.stats = stats
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
      await playerService.updatePlayerStats(player.value.id, player.value.stats)
    } catch (error) {
      console.error('Failed to save progress:', error)
    }
  }

  // Combat actions
  const startCombat = async () => {
    inCombat.value = true
    currentEnemy.value = generateEnemy()
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
      }

      // Save battle result
      await playerService.saveBattleResult(player.value.id, {
        won: true,
        tokensEarned,
        region: currentRegion.value,
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
  const exploreRegion = async (region) => {
    currentRegion.value = region
    player.value.stats.regionsExplored++
    await saveProgress()
  }

  const exitRegion = () => {
    currentRegion.value = null
    inCombat.value = false
    currentEnemy.value = null
  }

  // Helper functions
  const generateEnemy = () => {
    const enemies = ['Goblin', 'Orc', 'Skeleton', 'Dark Elf', 'Troll']
    return {
      type: enemies[Math.floor(Math.random() * enemies.length)],
      health: 100,
      maxHealth: 100
    }
  }

  return {
    player,
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
