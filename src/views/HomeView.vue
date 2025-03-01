<template>
  <div class="home-container">
    <Dashboard 
      v-if="!isPlaying" 
      :userData="userData"
      @play="startGame"
      @showLeaderboard="showLeaderboard"
    />
    <GameView v-else />

    <div v-if="showingLeaderboard" class="leaderboard-overlay">
      <div class="leaderboard-content">
        <h2>Top Players 🏆</h2>
        <div class="leaderboard-list">
          <div v-for="(player, index) in leaderboardData" 
               :key="player.id"
               class="leaderboard-item"
               :class="{ 'current-user': player.id === userData.id }">
            <span class="rank">{{ index + 1 }}</span>
            <span class="username">{{ player.username }}</span>
            <span class="tokens">🪙 {{ player.tokens }}</span>
          </div>
        </div>
        <button class="close-btn" @click="showingLeaderboard = false">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Dashboard from '../components/Dashboard.vue'
import GameView from './GameView.vue'
import { useGameStore } from '../stores/game'

const gameStore = useGameStore()
const isPlaying = ref(false)
const showingLeaderboard = ref(false)
const userData = ref({
  id: '',
  username: '',
  photoUrl: '',
  tokens: 0,
  level: 1,
  rank: null,
  stats: {
    battlesWon: 0,
    regionsExplored: 0,
    totalTokens: 0
  }
})
const leaderboardData = ref([])

onMounted(async () => {
  const tg = window.Telegram.WebApp
  
  // Get user data from initData
  if (tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user
    userData.value = {
      ...userData.value,
      id: user.id,
      username: user.username || 'Anonymous Player',
      photoUrl: user.photo_url
    }
  }

  // Load user data from server
  try {
    const response = await fetch(`/api/users/${userData.value.id}`)
    const data = await response.json()
    if (data.success) {
      userData.value = {
        ...userData.value,
        ...data.userData
      }
      gameStore.initializeFromSave(data.userData)
    }
  } catch (error) {
    console.error('Failed to load user data:', error)
  }
})

const startGame = () => {
  isPlaying.value = true
}

const showLeaderboard = async () => {
  try {
    const response = await fetch('/api/leaderboard')
    const data = await response.json()
    if (data.success) {
      leaderboardData.value = data.leaderboard
    }
    showingLeaderboard.value = true
  } catch (error) {
    console.error('Failed to load leaderboard:', error)
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  position: relative;
}

.leaderboard-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.leaderboard-content {
  background: var(--background);
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
}

.leaderboard-content h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.leaderboard-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

.leaderboard-item.current-user {
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid var(--primary);
}

.rank {
  font-weight: bold;
  min-width: 24px;
}

.close-btn {
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: var(--primary);
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  filter: brightness(1.1);
}
</style>
