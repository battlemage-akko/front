import {
  createRouter,
  createWebHistory
} from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/login.vue'

const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [{
      path: '/',
      component: Login,
      redirect: 'Login',
      children: [{
          path: 'Login',
          name: 'Login',
          component: () => import('@/components/login/login.vue'),
          meta: {
            title: 'Login',
            goHome: true,
          }
        },
        {
          path: 'Register',
          name: 'Register',
          component: () => import('@/components/login/Register.vue'),
          meta: {
            title: 'Login',
            goHome: true,
          }
        },
      ]
    },
    {
      path: '/home',
      component: Home,
      name: 'home',
      redirect: '/home/Main/default',
      meta: {
        requireAuth: true,
      },
      children: [{
          path: 'Main',
          name: 'Main',
          component: () => import('@/components/chat/components/private/index.vue'),
          meta: {
            title: '主页',
          },
          children: [{
            path: 'privateChat/:id',
            name: 'privateChat',
            component: () => import('@/components/chat/components/private/components/chatMain.vue'),
            meta: {
              title: '私聊',
            },
          },{
            path: 'default',
            name: 'default',
            component: () => import('@/components/chat/components/private/components/default.vue'),
            meta: {
              title: '首页',
            },
            redirect: '/home/Main/default/recommendation',
            children:[{
              path:'recommendation',
              name:'推荐',
              component: () => import('@/components/chat/components/private/components/recommendation.vue'),
            }]
          }]
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
    {
      path: '/setting',
      children: [{
        path: 'profile',
        name: 'profile',
        component: () => import('@/components/until/setting/components/profile.vue'),
        meta: {
          requireAuth: true,
        }
      }]
    },
  ]
})
export default router