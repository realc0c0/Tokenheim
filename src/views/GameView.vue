<template>
  <div class="game-container">
    <div v-if="loading" class="loading">
      Loading...
    </div>
    <div v-else>
      <div v-if="!selectedRegion" class="region-selection">
        <h2>Choose Your Path</h2>
        <div class="regions-grid">
          <button
            v-for="region in availableRegions"
            :key="region.id"
            class="region-btn"
            :class="{ 'locked': region.requiredLevel > playerLevel }"
            @click="selectRegion(region)"
            :disabled="region.requiredLevel > playerLevel"
          >
            <span class="region-name">{{ region.name }}</span>
            <span class="region-level" v-if="region.requiredLevel > playerLevel">
              Level {{ region.requiredLevel }} Required
            </span>
          </button>
        </div>
      </div>

      <div v-else-if="inCombat" class="combat-container">
        <CombatScene
          :enemy="currentEnemy"
          @attack="handleAttack"
        />
      </div>

      <div v-else class="region-info">
        <h2>{{ selectedRegion.name }}</h2>
        <p>{{ selectedRegion.description }}</p>
        <button class="explore-btn" @click="startExploring">
          🔍 Explore
        </button>
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
const selectedRegion = ref(null)
const inCombat = ref(false)
const currentEnemy = ref(null)

const playerLevel = computed(() => gameStore.player.level)

const availableRegions = computed(() => [
  {
    id: 'forest',
    name: '🌲 Mystic Forest',
    description: 'A mysterious forest filled with magical creatures.',
    requiredLevel: 1,
    enemies: ['Wolf', 'Dark Elf', 'Forest Spirit'],
    minTokens: 10,
    maxTokens: 30,
    minExp: 20,
    maxExp: 50
  },
  {
    id: 'cave',
    name: '⛰️ Dragon\'s Cave',
    description: 'A treacherous cave system home to powerful dragons.',
    requiredLevel: 3,
    enemies: ['Young Dragon', 'Cave Troll', 'Dark Knight'],
    minTokens: 30,
    maxTokens: 60,
    minExp: 50,
    maxExp: 100
  },
  {
    id: 'castle',
    name: '🏰 Haunted Castle',
    description: 'An ancient castle overrun by undead warriors.',
    requiredLevel: 5,
    enemies: ['Skeleton Knight', 'Ghost', 'Vampire Lord'],
    minTokens: 50,
    maxTokens: 100,
    minExp: 80,
    maxExp: 150
  }
])

onMounted(async () => {
  const tg = window.Telegram?.WebApp
  if (tg) {
    tg.BackButton.show()
    tg.BackButton.onClick(() => {
      if (inCombat.value) {
        endCombat()
      } else if (selectedRegion.value) {
        selectedRegion.value = null
      } else {
        router.push('/')
      }
    })
  }
  loading.value = false
})

onUnmounted(() => {
  const tg = window.Telegram?.WebApp
  if (tg) {
    tg.BackButton.offClick()
  }
})

const selectRegion = (region) => {
  if (region.requiredLevel > playerLevel.value) return
  selectedRegion.value = region
}

const startExploring = () => {
  if (!selectedRegion.value) return
  
  const region = selectedRegion.value
  const enemyType = region.enemies[Math.floor(Math.random() * region.enemies.length)]
  
  currentEnemy.value = {
    type: enemyType,
    health: 100,
    maxHealth: 100,
    minDamage: 10,
    maxDamage: 20
  }
  
  inCombat.value = true
}

const handleAttack = async () => {
  if (!currentEnemy.value || !inCombat.value) return

  // Player attacks
  const playerDamage = Math.floor(Math.random() * 30) + 20
  currentEnemy.value.health = Math.max(0, currentEnemy.value.health - playerDamage)

  // Check if enemy is defeated
  if (currentEnemy.value.health <= 0) {
    const region = selectedRegion.value
    const tokensEarned = Math.floor(Math.random() * (region.maxTokens - region.minTokens + 1)) + region.minTokens
    const expEarned = Math.floor(Math.random() * (region.maxExp - region.minExp + 1)) + region.minExp

    await gameStore.updatePlayerProgress({
      tokens: tokensEarned,
      exp: expEarned,
      stats: {
        battlesWon: 1,
        regionsExplored: 1,
        totalTokens: tokensEarned
      }
    })

    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.showPopup({
        title: 'Victory!',
        message: `You defeated the ${currentEnemy.value.type}!\nEarned:\n${tokensEarned} Tokens\n${expEarned} EXP`
      })
    }

    endCombat()
  } else {
    // Enemy attacks back
    const enemyDamage = Math.floor(Math.random() * (currentEnemy.value.maxDamage - currentEnemy.value.minDamage + 1)) + currentEnemy.value.minDamage
    
    // For now, we'll just show the damage taken
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.showPopup({
        message: `${currentEnemy.value.type} hits you for ${enemyDamage} damage!`
      })
    }
  }
}

const endCombat = () => {
  inCombat.value = false
  currentEnemy.value = null
  selectedRegion.value = null
}
</script>

<style scoped>
.game-container {
  min-height: 100vh;
  padding: 1rem;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: var(--tg-theme-text-color, #000);
}

.region-selection {
  text-align: center;
}

.region-selection h2 {
  margin-bottom: 2rem;
  color: var(--tg-theme-text-color, #000);
}

.regions-grid {
  display: grid;
  gap: 1rem;
  padding: 0 1rem;
}

.region-btn {
  padding: 1.5rem;
  border: none;
  border-radius: 12px;
  background: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #fff);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  font-size: 1.1rem;
}

.region-btn:not(.locked):hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.region-btn:not(.locked):active {
  transform: translateY(0);
  filter: brightness(0.9);
}

.region-btn.locked {
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  cursor: not-allowed;
  opacity: 0.7;
}

.region-name {
  font-weight: 600;
}

.region-level {
  font-size: 0.9rem;
  opacity: 0.8;
}

.region-info {
  text-align: center;
  padding: 1rem;
}

.region-info h2 {
  margin-bottom: 1rem;
  color: var(--tg-theme-text-color, #000);
}

.region-info p {
  margin-bottom: 2rem;
  color: var(--tg-theme-text-color, #000);
  opacity: 0.8;
}

.explore-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  background: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #fff);
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
}

.explore-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.explore-btn:active {
  transform: translateY(0);
  filter: brightness(0.9);
}

.combat-container {
  padding: 1rem;
}
</style>
