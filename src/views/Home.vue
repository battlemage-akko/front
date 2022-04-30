<script setup>
import asideMenus from "@/components/frame/components/asideMenus.vue";
import headerMenus from "@/components/frame/components/headerMenus.vue";
import chat from "@/components/chat/index.vue";
import TRTC from "trtc-js-sdk";
import { ref, onMounted } from "vue";
import { logout } from "@/api/auth";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const store = useStore();
const router = useRouter();
const client = TRTC.createClient({
  mode: 'rtc',
  sdkAppId: 1400647317,
  userId: store.state.userInfo.id,
  userSig: store.state.TRTCInfo.userSig,
})
const LogoutThisUser = () => {
  logout({}).then((res) => {
    store.commit("setBlock");
    ElMessage({
      message: "登出成功",
      type: "success",
    });
    router.go({
      path: "Login",
    });
  });
};
const closePhoneConn = () => {
  store.commit('clearPhoneInfo')
}

</script>

<template>
  <div class="main-container">
    <el-container class="frame">
      <el-header class="frame-header">
        <headerMenus @fatherMethod="LogoutThisUser" @closePhoneConn="closePhoneConn"></headerMenus>
      </el-header>
      <el-container>
        <el-aside
          class="frame-aside"
          :width="this.$store.state.isCollage ? '64px' : '200px'"
        >
          <asideMenus></asideMenus>
        </el-aside>
        <el-container>
          <el-main class="frame-main">
            <router-view />
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped="true">
.main-container {
  height: 100%;
  .frame {
    height: 100%;
    .frame-header {
      border: 1px solid rgba(0, 0, 0, 0.1);
      position: relative;
    }
    .frame-aside {
      background-color: grey;
      position: relative;
      user-select: none;
      height: 100%;
      overflow: hidden;
    }
    .frame-main {
      position: relative;
      padding: 0px;
    }
  }
}
</style>
