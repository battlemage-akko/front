import {
  createStore
} from 'vuex'
import Cookie from 'js-cookie'

const store = createStore({
  state: {
    token: '',
    isCollage: true,
    userInfo: JSON.parse(localStorage.getItem("userInfo")) || {},
  },
  getters: {

  },
  mutations: {
    toggleCollage(state, arr) {
      state.isCollage = !state.isCollage
    },
    setUserInfo(state, userinfo) {
      localStorage.setItem("userInfo", JSON.stringify(userinfo))
    },
    clearUserInfo(state){
      state.userInfo = {}
      localStorage.clear()
    },
    getUserInfo(state){
      state.userInfo = JSON.parse(localStorage.getItem("userInfo"))
    },
    setToken(state, token) {
      state.token = token
      localStorage.token = token
    },
    getToken(state) {
      console.log("getToken")
      if (!state.token) {
        state.token = localStorage.getItem('token')
      }
      return state.token
    },
    setBlock(state) {
      state.token = ""
      localStorage.clear()
      return state.token
    }
  },
  actions: {

  },
  modules: {

  }
})

export default store