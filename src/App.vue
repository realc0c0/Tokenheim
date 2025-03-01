<template>
  <div id="app" :class="theme">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useGameStore } from './stores/game'

const gameStore = useGameStore()
const theme = ref('light')

onMounted(() => {
  // Initialize Telegram WebApp
  const tg = window.Telegram.WebApp
  
  // Set theme based on Telegram theme
  theme.value = tg.colorScheme
  
  // Initialize game with Telegram instance
  gameStore.initGame(tg)
  
  // Tell Telegram we're ready
  tg.ready()
  tg.expand()
})
</script>

<style>
:root {
  --primary: #4CAF50;
  --secondary: #2196F3;
  --background: #121212;
  --surface: #1E1E1E;
  --text: #FFFFFF;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --error: #CF6679;
  --success: #4CAF50;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--background);
  color: var(--text);
}

#app {
  min-height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

button {
  font-family: inherit;
}

/* Theme Variants */
.dark {
  --background: #1a1a1a;
  --text: #ffffff;
}

.light {
  --background: #F5F5F5;
  --surface: #FFFFFF;
  --text: #000000;
  --text-secondary: rgba(0, 0, 0, 0.7);
}
</style>
