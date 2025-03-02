<template>
  <div class="game-view">
    <div v-if="loading" class="loading">
      Loading...
    </div>
    <div v-else>
      <div v-if="!currentRegion" class="regions">
        <h2>Choose Your Path</h2>
        <div class="region-grid">
          <div 
            v-for="(region, key) in gameStore.regions" 
            :key="key"
            class="region-card"
            :class="{ 'locked': gameStore.player.level < region.minLevel }"
            @click="enterRegion(key)"
          >
            <h3>{{ region.name }}</h3>
            <p>{{ region.description }}</p>
            <div class="region-info">
              <span class="difficulty">
                Difficulty: {{ '⚔️'.repeat(region.difficulty) }}
              </span>
              <span class="level-req" v-if="gameStore.player.level < region.minLevel">
                Required Level: {{ region.minLevel }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <div v-if="gameStore.inCombat">
          <CombatScene 
            :enemy="gameStore.currentEnemy"
            :player="gameStore.player"
            @attack="handleAttack"
          />
        </div>
        <div v-else class="exploration">
          <h2>{{ currentRegion.name }}</h2>
          <p>{{ currentRegion.description }}</p>
          <div class="action-buttons">
            <button @click="explore" class="explore-btn">
              🔍 Explore
            </button>
            <button @click="exitRegion" class="exit-btn">
              🚪 Exit Region
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import CombatScene from '../components/CombatScene.vue'

const router = useRouter()
const gameStore = useGameStore()
const loading = ref(true)

const currentRegion = computed(() => gameStore.currentRegion)

onMounted(async () => {
  const tg = window.Telegram?.WebApp
  if (tg) {
    tg.BackButton.onClick(() => handleBack())
  }
  loading.value = false
})

onUnmounted(() => {
  const tg = window.Telegram?.WebApp
  if (tg) {
    tg.BackButton.offClick()
  }
})

const handleBack = () => {
  if (currentRegion.value) {
    exitRegion()
  } else {
    router.push('/')
  }
}

const enterRegion = async (regionKey) => {
  const success = await gameStore.exploreRegion(regionKey)
  if (!success) {
    // Level requirement message is shown by the store
    return
  }
}

const explore = async () => {
  if (Math.random() < 0.7) {
    await gameStore.startCombat()
  } else {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.showPopup({
        title: 'Exploration',
        message: 'You found nothing interesting this time. Keep exploring!'
      })
    }
  }
}

const handleAttack = async () => {
  const result = await gameStore.attack()
  if (result.won) {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.showPopup({
        title: 'Victory!',
        message: `You won! Earned:\n🪙 ${result.tokens} tokens\n✨ ${result.exp} experience`
      })
    }
  }
  return result
}

const exitRegion = () => {
  gameStore.exitRegion()
}
</script>

<style scoped>
.game-view {
  min-height: 100vh;
  padding: 1rem;
  background: var(--tg-theme-bg-color, #fff);
  color: var(--tg-theme-text-color, #000);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
}

.regions h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.region-grid {
  display: grid;
  gap: 1.5rem;
  padding: 0.5rem;
}

.region-card {
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.region-card:not(.locked):hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

.region-card.locked {
  opacity: 0.7;
  cursor: not-allowed;
}

.region-card h3 {
  margin: 0 0 0.5rem;
  color: var(--tg-theme-text-color, #000);
}

.region-card p {
  margin: 0 0 1rem;
  color: var(--tg-theme-hint-color, #999);
  font-size: 0.9rem;
}

.region-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.level-req {
  color: #ff4444;
}

.exploration {
  text-align: center;
}

.action-buttons {
  display: grid;
  gap: 1rem;
  margin-top: 2rem;
}

.explore-btn, .exit-btn {
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
  font-weight: 600;
}

.explore-btn {
  background: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #fff);
}

.exit-btn {
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  color: var(--tg-theme-text-color, #000);
}

.explore-btn:hover, .exit-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.explore-btn:active, .exit-btn:active {
  transform: translateY(0);
  filter: brightness(0.9);
}
</style>
