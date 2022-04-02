import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/login.vue'

const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      component: Login,
      redirect: 'Login',
      children: [
        {
          path: 'Login',
          name: 'Login',
          component: () => import('@/components/login/login.vue'),
          meta: {
            title: 'Login',
            goHome:true,
          }
        },
        {
          path: 'Register',
          name: 'Register',
          component: () => import('@/components/login/Register.vue'),
          meta: {
            title: 'Login',
            goHome:true,
          }
        },
      ]
    },
    {
      path: '/home',
      component: Home,
      name: 'home',
      redirect: '/home/Main',
      meta: {
        requireAuth:true,
      },
      children: [
        {
          path: 'Main',
          name: 'Main',
          component: () => import('@/components/chat/components/private/index.vue'),
          meta: {
            title: '主页',
          },
          children: [
            {
              path: 'privateChat/:id',
              name: 'privateChat',
              component: () => import('@/components/chat/components/private/components/chatMain.vue'),
              meta: {
                title: '私聊',
              },
            }
          ]
        },
        {
          path: 'Group',
          name: 'Group',
          component: () => import('@/components/chat/components/group/index.vue'),
          meta: {
            title: '群聊',
          }
        }
      ]
    },
  ]
})
export default router