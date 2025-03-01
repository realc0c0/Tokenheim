<template>
  <div class="dashboard" :class="{ 'mobile': isMobile }">
    <div class="user-profile">
      <div class="profile-header">
        <div class="avatar" v-if="userData.photoUrl">
          <img :src="userData.photoUrl" :alt="userData.username">
        </div>
        <div class="user-info">
          <h2>{{ userData.username }}</h2>
          <p class="user-id">ID: {{ userData.id }}</p>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card tokens">
          <div class="stat-icon">🪙</div>
          <div class="stat-info">
            <span class="stat-value">{{ userData.tokens }}</span>
            <span class="stat-label">Tokens</span>
          </div>
        </div>
        
        <div class="stat-card level">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <span class="stat-value">{{ userData.level }}</span>
            <span class="stat-label">Level</span>
          </div>
        </div>

        <div class="stat-card rank">
          <div class="stat-icon">🏆</div>
          <div class="stat-info">
            <span class="stat-value">#{{ userData.rank || '???' }}</span>
            <span class="stat-label">Rank</span>
          </div>
        </div>
      </div>
    </div>

    <div class="game-stats">
      <h3>Statistics</h3>
      <div class="stats-list">
        <div class="stat-item">
          <span class="label">Battles Won</span>
          <span class="value">{{ userData.stats?.battlesWon || 0 }}</span>
        </div>
        <div class="stat-item">
          <span class="label">Regions Explored</span>
          <span class="value">{{ userData.stats?.regionsExplored || 0 }}</span>
        </div>
        <div class="stat-item">
          <span class="label">Total Tokens Earned</span>
          <span class="value">{{ userData.stats?.totalTokens || 0 }}</span>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="action-btn play" @click="$emit('play')">
        Play Now 🎮
      </button>
      <button class="action-btn leaderboard" @click="$emit('showLeaderboard')">
        Leaderboard 📊
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  userData: {
    type: Object,
    required: true
  }
})

const isMobile = ref(false)

onMounted(() => {
  const tg = window.Telegram.WebApp
  isMobile.value = tg.platform !== 'web'
  
  // Adapt to viewport
  const setSize = () => {
    document.body.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
  }
  
  window.addEventListener('resize', setSize)
  setSize()
})
</script>

<style scoped>
.dashboard {
  padding: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
  height: calc(var(--vh, 1vh) * 100);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mobile {
  padding: 1rem;
}

.user-profile {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info h2 {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.user-id {
  opacity: 0.7;
  font-size: 0.9rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-card {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.7;
}

.game-stats {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
}

.game-stats h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item:last-child {
  border-bottom: none;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: auto;
}

.action-btn {
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text);
  backdrop-filter: blur(5px);
}

.action-btn.play {
  background: var(--primary);
}

.action-btn.leaderboard {
  background: var(--secondary);
}

.action-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.mobile .action-btn {
  padding: 0.8rem;
  font-size: 1rem;
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-card:last-child {
    grid-column: span 2;
  }
}
</style>
