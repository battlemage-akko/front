import {
  createStore
} from 'vuex'
import Cookie from 'js-cookie'

const store = createStore({
  state: {
    token: '',
    isCollage: true,
    userInfo: JSON.parse(localStorage.getItem("userInfo")) || {},
    channels:null,
    friend: {
      id:null,
    }
  },
  getters: {

  },
  mutations: {
    saveChannel(state,channel){
      state.channels = channel
      console.log('连接到'+state.channels)
    },
    saveFriend(state,friendId){
      state.friend.id = friendId
      console.log('friend.id'+state.friend.id)
    },
    clearChannel(state,channel){
      state.channel = null
      console.log('关闭'+state.channel+'的连接')
      if(state.friend.id!=null){
        state.friend.id = null
      }
    },
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
      if (!state.token) {
        state.token = localStorage.getItem('token')
      }
      return state.token
    },
    setBlock(state) {
      state.token = ""
      localStorage.clear()
      state.userInfo = {}
      localStorage.clear()
    }
  },
  actions: {

  },
  modules: {

  }
})

export default store