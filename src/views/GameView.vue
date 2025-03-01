<template>
  <div class="game-container">
    <header class="game-header">
      <div class="player-stats">
        <span class="stat-item">🪙 {{ gameStore.player.tokens }}</span>
        <span class="stat-item">❤️ {{ gameStore.player.health }}</span>
      </div>
    </header>

    <main class="game-screen">
      <template v-if="!gameStore.currentRegion">
        <div class="region-select">
          <h2 class="title">Choose Your Path</h2>
          <div class="region-grid">
            <div 
              v-for="(region, key) in gameStore.regions" 
              :key="key"
              class="region-card"
              @click="gameStore.enterRegion(key)"
            >
              <h3>{{ region.name }}</h3>
              <p>{{ region.description }}</p>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="region-view">
          <h2>{{ gameStore.currentRegion.name }}</h2>
          <p>{{ gameStore.currentRegion.description }}</p>

          <div v-if="gameStore.inCombat" class="combat-ui">
            <div class="enemy-card">
              <h3>{{ gameStore.currentEnemy.name }}</h3>
              <div class="enemy-stats">
                <span>⚔️ Attack: {{ gameStore.currentEnemy.attack }}</span>
                <span>🛡️ Defense: {{ gameStore.currentEnemy.defense }}</span>
              </div>
            </div>

            <div class="action-buttons">
              <button 
                class="action-btn attack"
                @click="gameStore.handleCombatAction('attack')"
              >
                ⚔️ Attack
              </button>
              <button 
                class="action-btn defend"
                @click="gameStore.handleCombatAction('defend')"
              >
                🛡️ Defend (10 🪙)
              </button>
              <button 
                class="action-btn special"
                @click="gameStore.handleCombatAction('special')"
              >
                ✨ Special (20 🪙)
              </button>
            </div>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/game'
import { onMounted, onUnmounted } from 'vue'

const gameStore = useGameStore()

onMounted(() => {
  const tg = window.Telegram.WebApp
  tg.BackButton.onClick(() => {
    if (gameStore.currentRegion) {
      gameStore.exitRegion()
    }
  })
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
}

.game-header {
  padding: 1rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  z-index: 100;
}

.player-stats {
  display: flex;
  gap: 1rem;
  font-size: 1.2rem;
}

.game-screen {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.region-select {
  max-width: 800px;
  margin: 0 auto;
}

.title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.region-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.region-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.region-card:hover {
  transform: translateY(-2px);
}

.combat-ui {
  margin-top: 2rem;
}

.enemy-card {
  background: rgba(0, 0, 0, 0.5);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.enemy-stats {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.action-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text);
  font-size: 1.1rem;
  backdrop-filter: blur(5px);
  transition: all 0.2s ease;
  cursor: pointer;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.action-btn:active {
  transform: translateY(0);
}

.action-btn.attack { border-left: 3px solid var(--danger); }
.action-btn.defend { border-left: 3px solid var(--secondary); }
.action-btn.special { border-left: 3px solid var(--primary); }
</style>
