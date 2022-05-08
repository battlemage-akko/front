<script setup>
import asideMenus from "@/components/frame/components/asideMenus.vue";
import headerMenus from "@/components/frame/components/headerMenus.vue";
import chat from "@/components/chat/index.vue";
import TRTC from "trtc-js-sdk";
import { ref, onMounted, onBeforeUnmount,reactive,onBeforeUpdate} from "vue";
import { logout, checkUserStatu } from "@/api/auth";
import { ElMessage, ElNotification } from "element-plus";
import _ from 'lodash';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const store = useStore();
const router = useRouter();
const receiveCallingRequest = ref(false);
const callingRequestInfo = reactive({
  message:null,
  channel:null,
  friend_id:null,
  friend_name:null
})
onMounted(() => {
  initSystemSocket();
  window.addEventListener('beforeunload', e => closePhoneConn(1))
});
// onBeforeUnmount(() => {
//   systemsockOnClose();
// });
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

const handleResquestClose = () => {
  receiveCallingRequest.value = false;
  systemsockSend('0', callingRequestInfo.friend_id, "callingRespond");
  store.commit("changePhoneStatus", false);
} 
const acceptCallingResquest = () => {
  systemsockSend('1', callingRequestInfo.friend_id, "callingRespond");
  ElNotification({
    title: "注意",
    message: "开始连接到语音服务",
    type: "success",
    offset: 130,
  });
  connectPhone()
  receiveCallingRequest.value = false;
}
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
  const message = JSON.parse(e.data)
  switch(message.typeCode) {
    case 100: /*接收到连接语音请求*/
      store.commit("changePhoneStatus", true);
      changeCallingRequestInfo({
        message:message,
        channel:message.channel,
        friend_id:message.origin.id,
        friend_name:message.origin.name,
      })
      receiveCallingRequest.value = true;
      break;
    case 200: /*接收到回复请求*/
      if (message.message === 0){
        ElNotification({
          title: "注意",
          message: "对方拒绝了您的语音请求",
          type: "info",
          offset: 130,
        });
        store.commit("changePhoneStatus", false);
        initCallingRequestInfo()
      }
      else if(message.message === 1){
        ElNotification({
          title: "注意",
          message: "开始连接到语音服务",
          type: "success",
          offset: 130,
        });
        connectPhone()
      }
      break;
    case 201: /*对方主动断开连接*/
      closePhoneConn(0)
      ElNotification({
          title: "注意",
          message: "对方已断开连接",
          type: "warning",
          offset: 130,
        });
      break;
  }

};
const systemsockOnOpen = (e) => {
  console.log("systemsock open");
};
const systemsockOnClose = (e) => {
  closePhoneConn(1)
  // systemsockSend(null, callingRequestInfo.friend_id, "closeCalling",callingRequestInfo.channel);
  console.log("systemsock close");
};
const systemsockSend = (msg, id, type, channel=null) => {
  systemsock.send(
    JSON.stringify({
      msg: msg,
      id: id,
      type: type,
      channel:channel,
      userInfo: {
        id: store.state.userInfo.id,
        name: store.state.userInfo.username,
      },
    })
  );
};
const initCallingRequestInfo = () => {
  callingRequestInfo.message = null
  callingRequestInfo.friend_id = null
  callingRequestInfo.channel = null
  callingRequestInfo.friend_name = null
}
const changeCallingRequestInfo = (Info) => {
  callingRequestInfo.message = Info.message
  callingRequestInfo.friend_id = Info.friend_id
  callingRequestInfo.channel = Info.channel
  callingRequestInfo.friend_name = Info.friend_name
}
const call = _.throttle(function(){
  if (
    store.state.phoneInfo.room_id === null &&
    store.state.phoneLoading !== true
  ) {
    checkUserStatu({ user_id: store.state.friend.id }).then((res) => {
      if (res.status == 1) {
        const id = store.state.friend.id
        const channel = store.state.channels
        const name = store.state.friend.name
        store.commit("changePhoneStatus", true);
        systemsockSend("请求语音", id, "callingRequest", channel);
        changeCallingRequestInfo({
          message: null,
          friend_id: id,
          channel: channel,
          friend_name: name
        })
      } else {
        ElNotification({
          title: "注意",
          message: "对方不在线",
          type: "info",
          offset: 130,
        });
      }
    });
  } else if (
    store.state.phoneInfo.friendInfo.friendId === store.state.friend.id
  ) {
    closePhoneConn(1)
  } else if (store.state.phoneLoading === true) {
    ElNotification({
      title: "警告",
      message: "正在尝试与其他人建立通话连接",
      type: "warning",
      offset: 130,
    });
  } else {
    ElNotification({
      title: "警告",
      message: "请点击顶部头像隔壁的电话按钮关闭与其他人的语音再进行连接",
      type: "warning",
      offset: 130,
    });
  }
}, 1000, {
  leading: true,
  trailing: false
});
const connectPhone = () => {
  store.commit("savePhoneInfo", {
    room_id: callingRequestInfo.channel,
    type: "private",
    friendInfo: {
      friendId: callingRequestInfo.friend_id,
      friendName: callingRequestInfo.friend_name,
    },
  });
  store.commit("changePhoneStatus", false);
};
// type为1则为主动，type为0则为被动
const closePhoneConn = (type) => {
  if(type){
    systemsockSend(null, callingRequestInfo.friend_id, "closeCalling",callingRequestInfo.channel);
  }
  store.commit("clearPhoneInfo");
  initCallingRequestInfo()
  return 1
}
</script>
<template>
  <el-dialog
    v-model="receiveCallingRequest"
    title="Tips"
    width="30%"
    :before-close="handleResquestClose"
  >
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleResquestClose">Cancel</el-button>
        <el-button @click="acceptCallingResquest">Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>
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
