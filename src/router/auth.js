// import router from './index.js'; // 获取到路由列表
// import store from '../store'; // 获取vuex中的store

// router.beforeEach((to, from, next)=>{
//     if(to.meta.requiresAuth){
//         // 若当前页面需要登录
//         if(store.state.user.nickname){
//             // 若vuex中存在用户的昵称，则说明当前有登录态
//             next();
//         } else {
//             // 通过检测接口检验用户的登录态，
//             // 然后将获取到的信息再次存储到vuex中
//             User.getUserInfo(result=> {
//                 if(result.nickname){
//                     store.commit('setUserInfo', result);
//                     next();
//                 } else {
//                     // 去登录
//                 }
//             })
//         }
//     } else {
//         next();
//     }
// })