<template>
  <div class="home-container">
    <div v-if="loading" class="loading">
      Loading...
    </div>
    <div v-else>
      <Dashboard 
        :userData="userData"
        @play="startGame"
        @showLeaderboard="showLeaderboard"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import { useGameStore } from '../stores/game'

const router = useRouter()
const gameStore = useGameStore()
const loading = ref(true)
const userData = ref({
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

onMounted(async () => {
  try {
    loading.value = true
    const tg = window.Telegram?.WebApp

    if (!tg) {
      console.error('Telegram WebApp is not available')
      return
    }

    // Get user data from Telegram
    if (tg.initDataUnsafe.user) {
      const user = tg.initDataUnsafe.user
      userData.value = {
        ...userData.value,
        id: user.id.toString(),
        username: user.username || 'Anonymous Player'
      }

      // Initialize player in game store
      await gameStore.initializePlayer({
        id: user.id.toString(),
        username: user.username || 'Anonymous Player'
      })

      // Update local userData from game store
      userData.value = {
        ...userData.value,
        tokens: gameStore.player.tokens,
        level: gameStore.player.level,
        exp_points: gameStore.player.exp_points,
        stats: gameStore.player.stats
      }
    }
  } catch (error) {
    console.error('Failed to load user data:', error)
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.showPopup({
        title: 'Error',
        message: 'Failed to load game data. Please try again.'
      })
    }
  } finally {
    loading.value = false
  }
})

const startGame = () => {
  router.push('/game')
}

const showLeaderboard = () => {
  router.push('/leaderboard')
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: var(--tg-theme-text-color, #000);
}
</style>
