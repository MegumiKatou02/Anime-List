import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('../views/Main.vue'),
    },
    {
      path: '/home',
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
      path: '/callback',
      name: 'Callback',
      component: () => import('../pages/Callback.vue'),
    },
    {
      path: '/terms',
      name: 'TermsOfService',
      component: () => import('../views/Terms-of-service.vue'),
    },
    {
      path: '/saved',
      name: 'SavedItems',
      component: () => import('../views/SavedItemsPage.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/error',
      name: 'ErrorPage',
      component: () => import('../views/404.vue'),
    },
    {
      path: '/group/:id',
      component: () => import('../views/TransGroup.vue'),
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
  document.title =
    to.meta.title?.toString() || 'Anime List - Trang web Anime/Manga đầu hàng Việt Nam'

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const isLoggedIn = localStorage.getItem('discord_token')

    if (!isLoggedIn) {
      next('/')
      alert('Chưa đăng nhập mà đòi vào')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
