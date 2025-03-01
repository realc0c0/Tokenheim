<template>
  <div class="dashboard">
    <div class="user-profile">
      <div class="avatar" :style="{ backgroundImage: `url(${userData.photoUrl || '/img/default-avatar.png'})` }">
        <div class="level">{{ userData.level }}</div>
      </div>
      <h2>{{ userData.username }}</h2>
      <div class="user-stats">
        <div class="stat">
          <span class="label">Tokens</span>
          <span class="value">🪙 {{ userData.tokens }}</span>
        </div>
        <div class="stat">
          <span class="label">Battles Won</span>
          <span class="value">⚔️ {{ userData.stats.battlesWon }}</span>
        </div>
        <div class="stat">
          <span class="label">Regions Explored</span>
          <span class="value">🗺️ {{ userData.stats.regionsExplored }}</span>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="play-btn" @click="$emit('play')">
        ▶️ Play Game
      </button>
      <button class="leaderboard-btn" @click="$emit('showLeaderboard')">
        🏆 Leaderboard
      </button>
    </div>

    <div class="game-info">
      <h3>🎮 How to Play</h3>
      <ul>
        <li>🗺️ Choose a region to explore</li>
        <li>⚔️ Battle enemies to earn tokens</li>
        <li>💪 Level up to become stronger</li>
        <li>🏆 Compete for top rank</li>
      </ul>
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

defineEmits(['play', 'showLeaderboard'])
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  height: calc(var(--vh, 1vh) * 100);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.user-profile {
  text-align: center;
  margin-bottom: 2rem;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  background-size: cover;
  background-position: center;
  position: relative;
  border: 3px solid var(--primary);
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
}

.level {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--primary);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border: 2px solid var(--background);
}

.user-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.stat {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.value {
  font-size: 1.2rem;
  font-weight: bold;
}

.action-buttons {
  display: grid;
  gap: 1rem;
  margin: 2rem 0;
}

.play-btn, .leaderboard-btn {
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.play-btn {
  background: var(--primary);
  color: white;
}

.leaderboard-btn {
  background: var(--secondary);
  color: white;
}

.play-btn:hover, .leaderboard-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.game-info {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 12px;
}

.game-info h3 {
  margin-bottom: 1rem;
}

.game-info ul {
  list-style: none;
  padding: 0;
}

.game-info li {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mobile {
  padding: 1rem;
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
