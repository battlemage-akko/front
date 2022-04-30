<script setup>
import { ref, reactive,onMounted } from 'vue'
import { login, getUserSig } from '@/api/auth'
import { ElMessage } from 'element-plus'
import Cookies from 'js-cookie'
import { useRouter } from "vue-router"
import { useStore } from "vuex"
const store = useStore();
const loginForm = reactive({
  password: '',
  username: '',
})
const router = useRouter();

let loading = reactive(false);

const loginThisUser = () => {
  loading = !loading
  login({'username':loginForm.username,'password':loginForm.password},{withCredentials:true}).then(res => {
    if (res.status === 1){
      getUserSig({ id: res['userInfo']['id'] }).then((userSigResponse) => {
        store.commit('setTRTCInfo',userSigResponse)
      });
      store.commit('setUserInfo', res['userInfo']); 
      store.commit('setToken', res['token']); 
      // localStorage.clear()
      // sessionStorage.clear()
      ElMessage({
        message: res.content,
        type: 'success',
      })
      router.push({
        path: "home"
      });
    }
    else if (res.status != 1){
      loading = !loading
      ElMessage({
        message: res.content,
        type: 'error',
      })
    }
  })
}
</script>

<template>
  <el-main class="lgMain">
    <el-form
      @submit.enter.prevent
      ref="ruleFormRef"
      :model="loginForm"
      status-icon
      label-width="120px"
      class="lgForm formData"
      label-position="top"
    >
    <el-form-item prop="username">
        <el-input placeholder="请输入用户名" v-model="loginForm.username"/>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" autocomplete="off" placeholder="请输入密码"  v-model="loginForm.password"/>
      </el-form-item>
      <el-form-item class="lgButtons">
        <el-button type="primary" @click="loginThisUser" native-type="submit" :disabled="loading">登录</el-button>
        <div>
          <router-link to="/register">
            <span>注册</span>
          </router-link>
        </div>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<style lang="scss" scope>
.lgForm.formData {
  width: 100%;
  .el-form-item {
    margin: 0px;
  }
  .lgButtons {
  button {
    width: 100%;
    background-color:#3b5998;
    border: none;
    font-weight: 600;
    box-shadow: $shadow;
    &:hover {
      background-color:#2f4470;
    }
  }
  div {
    margin-top: 5px;
    a {
      text-decoration: none;

    }
  }
  .el-form-item__content {
    display: flex;
    justify-content: center;
  }
}
}

</style>