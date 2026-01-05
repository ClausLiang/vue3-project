import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/components/layout/LayoutMain.vue'),
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/home/HomeView.vue'),
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('@/views/about/AboutView.vue'),
        },
      ],
    },

  ],
})

export default router
