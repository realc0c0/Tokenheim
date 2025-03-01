<template>
  <div class="region-card" @click="$emit('select')">
    <div class="region-icon" :class="regionKey">{{ getRegionEmoji(regionKey) }}</div>
    <div class="region-content">
      <h3>{{ region.name }}</h3>
      <p>{{ region.description }}</p>
      <div class="region-enemies">
        <span v-for="enemy in region.enemies.slice(0, 2)" :key="enemy" class="enemy-tag">
          {{ enemy }}
        </span>
        <span v-if="region.enemies.length > 2" class="enemy-tag">+{{ region.enemies.length - 2 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  region: {
    type: Object,
    required: true
  },
  regionKey: {
    type: String,
    required: true
  }
})

defineEmits(['select'])

const getRegionEmoji = (key) => {
  const emojis = {
    frostbyteVault: '❄️',
    fomoForest: '🌲',
    pumpDumpCaverns: '🔥'
  }
  return emojis[key] || '🏰'
}
</script>

<style scoped>
.region-card {
  display: flex;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.region-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
}

.region-icon {
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.3);
}

.region-content {
  flex: 1;
}

.region-content h3 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
}

.region-content p {
  margin-bottom: 1rem;
  opacity: 0.8;
  font-size: 0.9rem;
}

.region-enemies {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.enemy-tag {
  font-size: 0.8rem;
  padding: 0.2rem 0.6rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  white-space: nowrap;
}

.frostbyteVault { background: rgba(0, 149, 255, 0.2); }
.fomoForest { background: rgba(76, 175, 80, 0.2); }
.pumpDumpCaverns { background: rgba(244, 67, 54, 0.2); }
</style>
