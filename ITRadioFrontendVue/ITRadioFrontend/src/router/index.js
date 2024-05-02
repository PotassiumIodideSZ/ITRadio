//import NotFoundView from '../views/NotFoundView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/test',
      name: 'Test',
      component: () => import('../views/TestPage.vue')
    },
    {
      path: '/liked-songs',
      name: 'LikedSongs',
      component: () => import('../views/LikedSongsView.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginRegistration.vue'),
      // meta: {
      //   requiresAuth: true
      // },
      // beforeEnter: (to, from, next) => {
      //   if (isAuthenticated()) {
      //     next()
      //   } else {
      //     next('/login')
      //   }
      // }
    },




    // {
    //   path: '/:catchAll(.*)',
    //   name: 'NotFound',
    //   component: NotFoundView
    // },
  ]
})

export default router
