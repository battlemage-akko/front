<script setup>
import asideMenus from "@/components/frame/components/asideMenus.vue";
import headerMenus from "@/components/frame/components/headerMenus.vue";
import chat from "@/components/chat/index.vue";
import TRTC from "trtc-js-sdk";
import { ref, onMounted, onUnmounted } from "vue";
import { logout, checkUserStatu } from "@/api/auth";
import { ElMessage, ElNotification } from "element-plus";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const store = useStore();
const router = useRouter();
onMounted(() => {
  initSystemSocket();
});
onUnmounted(() => {
  systemsockOnClose();
});
const client = TRTC.createClient({
  mode: "rtc",
  sdkAppId: 1400647317,
  userId: store.state.userInfo.id,
  userSig: store.state.TRTCInfo.userSig,
});
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
  store.commit("clearPhoneInfo");
};
let systemsock = "";
const initSystemSocket = () => {
  systemsock = new WebSocket(
    "ws://127.0.0.1:8000/beholder/" + store.state.userInfo.id
  );
  systemsock.onopen = systemsockOnOpen;
  systemsock.onclose = systemsockOnClose;
  systemsock.onmessage = systemsockOnMessage;

};
const systemsockOnMessage = (e) => {
  console.log(e.data);
};
const systemsockOnOpen = (e) => {
  console.log("systemsock open");
};
const systemsockOnClose = (e) => {
  console.log("systemsock close");
};
const systemsockSend = (msg, id) => {
  systemsock.send(JSON.stringify({ msg: msg, id: id }));
};
const call = () => {
  if (store.state.phoneInfo.room_id === null) {
    checkUserStatu({ user_id: store.state.friend.id }).then(
      (res) => {
        if (res.status == 1) {
          
          store.commit("savePhoneInfo", {
            room_id: store.state.channels,
            type: "private",
            friendInfo: {
              friendId: store.state.friend.id,
              friendName: store.state.friend.name,
            },
          });
        }
        else {
          ElNotification({
            title: "注意",
            message: "对方不在线",
            type: "info",
            offset: 130,
          });
        }
      }
    );
  } else if (
    store.state.phoneInfo.friendInfo.friendId === store.state.friend.id
  ) {
    store.commit("clearPhoneInfo");
  } else {
    ElNotification({
      title: "警告",
      message: "请点击顶部头像隔壁的电话按钮关闭与其他人的语音再进行连接",
      type: "warning",
      offset: 130,
    });
  }
};
</script>
<template>
  <div class="main-container">
    <el-container class="frame">
      <el-header class="frame-header">
        <headerMenus
          @fatherMethod="LogoutThisUser"
          @closePhoneConn="closePhoneConn"
        ></headerMenus>
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
            <router-view @call="call" />
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
