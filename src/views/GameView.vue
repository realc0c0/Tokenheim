<template>
  <div class="game-container">
    <PlayerStats 
      :tokens="gameStore.player.tokens"
      :health="gameStore.player.health"
      :experience="gameStore.player.experience"
    />

    <main class="game-screen">
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
import RegionCard from '../components/RegionCard.vue'
import CombatScene from '../components/CombatScene.vue'
import PlayerStats from '../components/PlayerStats.vue'

const gameStore = useGameStore()

onMounted(() => {
  const tg = window.Telegram.WebApp
  tg.BackButton.onClick(() => {
    if (gameStore.currentRegion) {
      gameStore.exitRegion()
    }
  })

  // Handle back button visibility
  if (gameStore.currentRegion) {
    tg.BackButton.show()
  }
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
</style>
