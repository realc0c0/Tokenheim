<template>
  <div class="game-container">
    <PlayerStats 
      :tokens="gameStore.player.tokens"
      :health="gameStore.player.health"
      :experience="gameStore.player.experience"
    />

    <main class="game-screen">
      <div class="game-header">
        <button class="back-btn" @click="handleBack">
          ← Back
        </button>
      </div>

      <template v-if="!gameStore.currentRegion">
        <div class="region-select">
          <h2 class="title">Choose Your Path in Tokenheim</h2>
          <div class="region-grid">
            <RegionCard
              v-for="(region, key) in gameStore.regions"
              :key="key"
              :region="region"
              :regionKey="key"
              @select="gameStore.enterRegion(key)"
            />
          </div>
        </div>
      </template>

      <template v-else>
        <div class="region-view">
          <div class="region-header">
            <h2>{{ gameStore.currentRegion.name }}</h2>
            <p>{{ gameStore.currentRegion.description }}</p>
          </div>

          <div v-if="!gameStore.inCombat" class="region-exploration">
            <p class="exploration-text">Exploring {{ gameStore.currentRegion.name }}...</p>
            <div class="exploration-actions">
              <button class="explore-btn" @click="explore">
                🔍 Explore Further
              </button>
            </div>
          </div>

          <CombatScene
            v-if="gameStore.inCombat"
            :enemy="gameStore.currentEnemy"
            :playerTokens="gameStore.player.tokens"
            @action="gameStore.handleCombatAction"
          />
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/game'
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import RegionCard from '../components/RegionCard.vue'
import CombatScene from '../components/CombatScene.vue'
import PlayerStats from '../components/PlayerStats.vue'

const gameStore = useGameStore()
const router = useRouter()

const handleBack = () => {
  if (gameStore.currentRegion) {
    gameStore.exitRegion()
  } else {
    router.push('/')
  }
}

const explore = () => {
  if (Math.random() < 0.7) {
    gameStore.startCombat()
  } else {
    const tg = window.Telegram.WebApp
    tg.showAlert("You found nothing interesting this time. Keep exploring!")
  }
}

onMounted(() => {
  const tg = window.Telegram.WebApp
  tg.BackButton.onClick(() => handleBack())
})

onUnmounted(() => {
  const tg = window.Telegram.WebApp
  tg.BackButton.offClick()
})
</script>

<style scoped>
.game-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
}

.game-screen {
  flex: 1;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(5px);
}

.game-header {
  padding: 1rem;
  display: flex;
  justify-content: flex-start;
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: var(--text-color);
  cursor: pointer;
  transition: background 0.3s ease;
  font-size: 1rem;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.region-select {
  padding: 2rem;
}

.title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  background: linear-gradient(45deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(76, 175, 80, 0.3);
}

.region-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.region-view {
  padding: 2rem;
}

.region-header {
  text-align: center;
  margin-bottom: 2rem;
}

.region-header h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.region-header p {
  opacity: 0.8;
}

.region-exploration {
  text-align: center;
  padding: 2rem;
}

.exploration-text {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  animation: pulse 2s infinite;
}

.exploration-actions {
  display: flex;
  justify-content: center;
}

.explore-btn {
  background: var(--primary);
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.3s ease, background 0.3s ease;
}

.explore-btn:hover {
  transform: translateY(-2px);
  background: var(--secondary);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>
