import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    layout?: 'default' | 'auth'
  }
}

// hash-режим, щоб оновлення сторінки працювало на gh-pages
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue'), meta: { title: 'Home' } },
    { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue'), meta: { title: 'About author' } },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: 'Login', layout: 'auth' },
    },
    {
      path: '/users',
      meta: { requiresAuth: true, title: 'Users' },
      children: [
        { path: '', name: 'users', component: () => import('@/views/UsersView.vue') },
        {
          path: ':id(\\d+)',
          name: 'user-details',
          component: () => import('@/views/UserDetailView.vue'),
          props: true,
          meta: { title: 'User details' },
          children: [
            {
              path: 'edit',
              name: 'user-edit',
              component: () => import('@/views/UserEditView.vue'),
              props: true,
              meta: { title: 'Edit user' },
            },
          ],
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Page not found' },
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.matched.some((r) => r.meta.requiresAuth) && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && auth.isAuthenticated) return { name: 'users' }
})

router.afterEach((to) => {
  const title = [...to.matched].reverse().find((r) => r.meta.title)?.meta.title
  document.title = title ? `${title} | Vue Lottery` : 'Vue Lottery'
})

export default router
