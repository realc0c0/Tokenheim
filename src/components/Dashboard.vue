<template>
  <div class="dashboard">
    <div class="player-info">
      <h2>{{ userData.username }}</h2>
      <div class="stats">
        <div class="stat">
          <span class="label">Level</span>
          <span class="value">{{ userData.level }}</span>
        </div>
        <div class="stat">
          <span class="label">Tokens</span>
          <span class="value">🪙 {{ userData.tokens }}</span>
        </div>
        <div class="stat">
          <span class="label">Experience</span>
          <span class="value">✨ {{ userData.exp_points }}/{{ userData.level * 100 }}</span>
        </div>
      </div>
    </div>

    <div class="achievements">
      <h3>Achievements</h3>
      <div class="achievement-stats">
        <div class="achievement">
          <span class="label">Battles Won</span>
          <span class="value">⚔️ {{ userData.stats.battlesWon }}</span>
        </div>
        <div class="achievement">
          <span class="label">Regions Explored</span>
          <span class="value">🗺️ {{ userData.stats.regionsExplored }}</span>
        </div>
        <div class="achievement">
          <span class="label">Total Tokens</span>
          <span class="value">💰 {{ userData.stats.totalTokens }}</span>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="play-btn" @click="$emit('play')">
        ⚔️ Enter Dungeon
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

defineEmits(['play', 'showLeaderboard'])
</script>

<style scoped>
.dashboard {
  padding: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
  background: var(--tg-theme-bg-color, #fff);
  color: var(--tg-theme-text-color, #000);
}

.player-info {
  text-align: center;
  margin-bottom: 2rem;
}

.player-info h2 {
  margin: 0 0 1rem;
  color: var(--tg-theme-text-color, #000);
}

.stats, .achievement-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1rem 0;
}

.stat, .achievement {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.8rem;
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  border-radius: 12px;
}

.label {
  font-size: 0.9rem;
  color: var(--tg-theme-hint-color, #999);
  margin-bottom: 0.3rem;
}

.value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--tg-theme-text-color, #000);
}

.achievements {
  margin: 2rem 0;
}

.achievements h3 {
  text-align: center;
  margin: 0 0 1rem;
  color: var(--tg-theme-text-color, #000);
}

.action-buttons {
  display: grid;
  gap: 1rem;
  margin: 2rem 0;
}

.play-btn {
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
  width: 100%;
  font-weight: 600;
  background: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #fff);
}

.play-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.play-btn:active {
  transform: translateY(0);
  filter: brightness(0.9);
}
</style>
