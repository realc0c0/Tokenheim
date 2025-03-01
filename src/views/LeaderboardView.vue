<template>
  <div class="leaderboard">
    <div class="header">
      <h1>🏆 Tokenheim Leaderboard</h1>
      <div class="refresh-btn" @click="refreshLeaderboard">
        <span class="icon" :class="{ 'refreshing': isRefreshing }">🔄</span>
      </div>
    </div>

    <div class="stats-summary">
      <div class="stat">
        <span class="label">Your Rank</span>
        <span class="value">#{{ userRank }}</span>
      </div>
      <div class="stat">
        <span class="label">Total Players</span>
        <span class="value">{{ totalPlayers }}</span>
      </div>
    </div>

    <div class="leaderboard-list" ref="leaderboardList">
      <div v-for="(player, index) in players" 
           :key="player.id"
           class="player-card"
           :class="{ 
             'current-user': player.id === currentUserId,
             'top-3': index < 3 
           }">
        <div class="rank">
          {{ index + 1 }}
          <span v-if="index < 3" class="medal">
            {{ medals[index] }}
          </span>
        </div>
        
        <div class="player-info">
          <div class="name-level">
            <span class="name">{{ player.username }}</span>
            <span class="level">Lvl {{ player.level }}</span>
          </div>
          <div class="stats">
            <span class="tokens">🪙 {{ player.tokens }}</span>
            <span class="battles">⚔️ {{ player.stats.battlesWon }}</span>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="loading">
        Loading leaderboard...
      </div>

      <div v-if="!isLoading && players.length === 0" class="no-data">
        No players found
      </div>
    </div>

    <button class="back-btn" @click="goBack">
      ← Back to Game
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import { supabase } from '../supabase'

const router = useRouter()
const gameStore = useGameStore()

const players = ref([])
const isLoading = ref(true)
const isRefreshing = ref(false)
const currentUserId = ref('')
const userRank = ref('--')
const totalPlayers = ref(0)
const leaderboardList = ref(null)

const medals = ['🥇', '🥈', '🥉']

onMounted(async () => {
  currentUserId.value = gameStore.player.id
  await fetchLeaderboard()
  subscribeToUpdates()
})

onUnmounted(() => {
  unsubscribeFromUpdates()
})

const fetchLeaderboard = async () => {
  try {
    isLoading.value = true
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('tokens', { ascending: false })
      .order('level', { ascending: false })
      .limit(100)

    if (error) throw error

    players.value = data
    totalPlayers.value = data.length
    
    // Find user rank
    const userIndex = data.findIndex(p => p.id === currentUserId.value)
    userRank.value = userIndex >= 0 ? userIndex + 1 : '--'
    
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
  } finally {
    isLoading.value = false
  }
}

const refreshLeaderboard = async () => {
  if (isRefreshing.value) return
  isRefreshing.value = true
  await fetchLeaderboard()
  setTimeout(() => {
    isRefreshing.value = false
  }, 1000)
}

let subscription = null

const subscribeToUpdates = () => {
  subscription = supabase
    .from('players')
    .on('*', payload => {
      if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
        fetchLeaderboard()
      }
    })
    .subscribe()
}

const unsubscribeFromUpdates = () => {
  if (subscription) {
    supabase.removeSubscription(subscription)
  }
}

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.leaderboard {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 1.8rem;
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.refresh-btn {
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.refresh-btn .icon {
  font-size: 1.2rem;
  display: inline-block;
}

.refreshing {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
}

.stat .label {
  font-size: 0.9rem;
  opacity: 0.8;
  display: block;
  margin-bottom: 0.5rem;
}

.stat .value {
  font-size: 1.2rem;
  font-weight: bold;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.player-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: transform 0.2s ease;
}

.player-card:hover {
  transform: translateX(4px);
}

.player-card.current-user {
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid var(--primary);
}

.player-card.top-3 {
  background: rgba(255, 215, 0, 0.1);
}

.rank {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  position: relative;
}

.medal {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 1rem;
}

.player-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.name-level {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.name {
  font-weight: bold;
}

.level {
  font-size: 0.9rem;
  opacity: 0.8;
}

.stats {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
}

.loading, .no-data {
  text-align: center;
  padding: 2rem;
  opacity: 0.7;
}

.back-btn {
  padding: 1rem;
  border: none;
  border-radius: 12px;
  background: var(--primary);
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}
</style>
