<template>
  <div id="app" :class="{ 'dark-theme': isDarkTheme }">
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useGameStore } from './stores/game'

const isDarkTheme = ref(true)
const gameStore = useGameStore()

onMounted(() => {
  const tg = window.Telegram.WebApp
  tg.ready()
  tg.expand()

  // Initialize theme
  isDarkTheme.value = tg.colorScheme === 'dark'
  
  // Initialize game data
  gameStore.initGame(tg)
})
</script>

<style>
#app {
  height: 100vh;
}

.dark-theme {
  --background: #1a1a1a;
  --text: #ffffff;
}

.light-theme {
  --background: #f5f5f5;
  --text: #000000;
}
</style>
