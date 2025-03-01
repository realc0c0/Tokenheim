<template>
  <div class="combat-scene">
    <div class="enemy-container" :class="{ 'enemy-damaged': isEnemyDamaged }">
      <div class="enemy-sprite" :class="enemyType.toLowerCase()">
        {{ getEnemyEmoji(enemyType) }}
      </div>
      <div class="enemy-info">
        <h3>{{ enemy.name }}</h3>
        <div class="enemy-stats">
          <span>⚔️ {{ enemy.attack }}</span>
          <span>🛡️ {{ enemy.defense }}</span>
        </div>
      </div>
    </div>

    <div class="combat-actions">
      <div class="action-row">
        <button 
          class="action-btn attack"
          @click="handleAction('attack')"
          :disabled="isActionDisabled"
        >
          ⚔️ Attack
        </button>
        <button 
          class="action-btn defend"
          @click="handleAction('defend')"
          :disabled="isActionDisabled || playerTokens < 10"
        >
          🛡️ Defend (10 🪙)
        </button>
      </div>
      <div class="action-row">
        <button 
          class="action-btn special"
          @click="handleAction('special')"
          :disabled="isActionDisabled || playerTokens < 20"
        >
          ✨ Special (20 🪙)
        </button>
      </div>
    </div>

    <div class="combat-log" ref="logContainer">
      <div v-for="(log, index) in combatLogs" 
           :key="index" 
           class="log-entry"
           :class="log.type">
        {{ log.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  enemy: {
    type: Object,
    required: true
  },
  playerTokens: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['action'])

const isActionDisabled = ref(false)
const isEnemyDamaged = ref(false)
const combatLogs = ref([])
const logContainer = ref(null)

const enemyType = computed(() => {
  const name = props.enemy.name.toLowerCase()
  if (name.includes('yeti')) return 'yeti'
  if (name.includes('goblin')) return 'goblin'
  if (name.includes('spirit')) return 'spirit'
  return 'default'
})

const getEnemyEmoji = (type) => {
  const emojis = {
    yeti: '🧊',
    goblin: '👺',
    spirit: '👻',
    default: '👾'
  }
  return emojis[type.toLowerCase()] || emojis.default
}

const addCombatLog = (message, type = 'info') => {
  combatLogs.value.push({ message, type })
  if (combatLogs.value.length > 5) {
    combatLogs.value.shift()
  }
  // Scroll to bottom
  setTimeout(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight
    }
  }, 50)
}

const handleAction = async (action) => {
  isActionDisabled.value = true
  
  if (action === 'attack') {
    addCombatLog('You launch a fierce attack! ⚔️', 'player')
  } else if (action === 'defend') {
    addCombatLog('You raise your shield! 🛡️', 'player')
  } else if (action === 'special') {
    addCombatLog('You unleash a special move! ✨', 'player')
  }

  // Visual feedback
  isEnemyDamaged.value = true
  setTimeout(() => {
    isEnemyDamaged.value = false
  }, 300)

  // Enemy response delay
  setTimeout(() => {
    addCombatLog(`${props.enemy.name} counterattacks! 💥`, 'enemy')
    isActionDisabled.value = false
  }, 1000)

  emit('action', action)
}

watch(() => props.enemy, () => {
  combatLogs.value = []
  addCombatLog(`A wild ${props.enemy.name} appears! 🎯`)
})
</script>

<style scoped>
.combat-scene {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
}

.enemy-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.enemy-damaged {
  animation: damage 0.3s ease;
}

@keyframes damage {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.enemy-sprite {
  font-size: 4rem;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.enemy-info {
  text-align: center;
}

.enemy-stats {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 0.5rem;
}

.combat-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-row {
  display: flex;
  gap: 1rem;
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
  min-width: 150px;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn:not(:disabled):hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.combat-log {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 1rem;
  max-height: 150px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.log-entry {
  font-size: 0.9rem;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
}

.log-entry.player { color: #4CAF50; }
.log-entry.enemy { color: #f44336; }

.yeti { background: rgba(0, 149, 255, 0.2); }
.goblin { background: rgba(244, 67, 54, 0.2); }
.spirit { background: rgba(76, 175, 80, 0.2); }
</style>
