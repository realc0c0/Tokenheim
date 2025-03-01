import { createRouter, createWebHistory } from 'vue-router'

// Import views
const HomeView = () => import('../views/HomeView.vue')
const GameView = () => import('../views/GameView.vue')
const LeaderboardView = () => import('../views/LeaderboardView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/game',
      name: 'game',
      component: GameView
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: LeaderboardView
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const tg = window.Telegram?.WebApp
  if (tg) {
    if (to.name === 'home') {
      tg.BackButton.hide()
    } else {
      tg.BackButton.show()
    }
  }
  next()
})

export default router
