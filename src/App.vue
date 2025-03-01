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
:root {
  --primary: #4CAF50;
  --secondary: #2196F3;
  --danger: #f44336;
  --background: #1a1a1a;
  --text: #ffffff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
}

#app {
  height: 100vh;
  background: var(--background);
  color: var(--text);
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
