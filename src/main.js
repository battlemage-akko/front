import {
    createApp
} from 'vue'
import ElementPlus from 'element-plus'
import * as ElIconModules from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import {
    check
} from '/src/api/auth'
import store from './store/index.js'
import Vuex from 'vuex'
import Cookies from 'js-cookie'

const app = createApp(App)

for (const iconName in ElIconModules) {
    if (Reflect.has(ElIconModules, iconName)) {
        const item = ElIconModules[iconName]
        app.component(iconName, item)
    }
}

router.beforeEach((to, from, next) => {
    if (to.meta.goHome) {
        if (Object.keys(store.state.userInfo).length !== 0) {
            next({
                path: '/home',
            });
        } else {
            next();
        }
    }
    if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
        if (Object.keys(store.state.userInfo).length !== 0) { // 通过vuex state获取当前的token,userInfo是否存在
            next();
        } else {
            if (localStorage.getItem('userInfo') != null) {
                store.commit('getUserInfo');
                next();
            } else {
                next({
                    path: '/login',
                })
            }
        }
    } else {
        next();
    }
})
app.use(ElementPlus)
    .use(router)
    .use(store)
    .use(Vuex)
    .use(Cookies)
    .mount('#app')