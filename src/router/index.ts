import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/',
      name: 'root',
      component: () => import('../views/RootView.vue'),
      children: [
        {
          path: 'info',
          name: 'info',
          component: () => import('../views/InfoView.vue')
        },
        {
          path: 'webhook',
          name: 'webhook',
          component: () => import('../views/WebhookView.vue')
        },
        {
          path: 'sendmessage',
          name: 'sendmessage',
          component: () => import('../views/SendMessageView.vue')
        }
      ]
    }
  ]
})

export default router
