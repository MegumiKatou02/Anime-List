import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/anime/:id',
      name: 'anime-detail',
      component: () => import('../views/AnimeDetail.vue'),
    },
    {
      path: '/about',
      name: 'about',

      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/character/:id',
      name: 'CharacterDetail',
      component: () => import('../views/CharacterDetail.vue'),
    },
    {
      path: '/manga/:id',
      name: 'MangaDetail',
      component: () => import('../views/MangaDetail.vue'),
    },
    {
      path: '/read/:id',
      name: 'MangaReader',
      component: () => import('../views/MangaReader.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title?.toString() || 'Anime List'
  next()
})

export default router
