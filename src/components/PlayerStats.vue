<template>
  <div class="player-stats">
    <div class="stat-container">
      <div class="stat-item tokens" :class="{ 'token-change': tokenChange }">
        <span class="stat-icon">🪙</span>
        <span class="stat-value">{{ tokens }}</span>
      </div>
      <div class="stat-item health">
        <div class="health-bar">
          <div class="health-fill" :style="{ width: `${health}%` }"></div>
        </div>
        <span class="stat-icon">❤️</span>
        <span class="stat-value">{{ health }}/100</span>
      </div>
    </div>
    
    <div class="player-level">
      <div class="level-progress">
        <div class="level-fill" :style="{ width: `${(experience % 100)}%` }"></div>
      </div>
      <span class="level-text">Level {{ Math.floor(experience / 100) + 1 }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  tokens: {
    type: Number,
    required: true
  },
  health: {
    type: Number,
    required: true
  },
  experience: {
    type: Number,
    default: 0
  }
})

const tokenChange = ref(false)

watch(() => props.tokens, (newVal, oldVal) => {
  if (oldVal !== undefined && newVal !== oldVal) {
    tokenChange.value = true
    setTimeout(() => {
      tokenChange.value = false
    }, 500)
  }
})
</script>

<style scoped>
.player-stats {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.stat-container {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 1.1rem;
}

.stat-icon {
  font-size: 1.2rem;
}

.tokens {
  transition: transform 0.3s ease;
}

.token-change {
  animation: pulse 0.5s ease;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.health {
  position: relative;
  padding-right: 4rem;
}

.health-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(244, 67, 54, 0.2);
  border-radius: 20px;
  overflow: hidden;
}

.health-fill {
  height: 100%;
  background: rgba(244, 67, 54, 0.5);
  transition: width 0.3s ease;
}

.player-level {
  position: relative;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.level-fill {
  height: 100%;
  background: var(--primary);
  transition: width 0.3s ease;
}

.level-text {
  position: absolute;
  top: -1.5rem;
  right: 0;
  font-size: 0.8rem;
  opacity: 0.8;
}
</style>
