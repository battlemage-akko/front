<script setup>
import asideMenus from "@/components/frame/components/asideMenus.vue";
import headerMenus from "@/components/frame/components/headerMenus.vue";
import chat from "@/components/chat/index.vue";
import TRTC from "trtc-js-sdk";
import { ref, onMounted, reactive,watch, inject } from "vue";
import { logout, checkUserStatu,distributeRoomid } from "@/api/auth";
import { ElMessage, ElNotification } from "element-plus";
import _ from "lodash";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const store = useStore();
const router = useRouter();
const receiveCallingRequest = ref(false);
const callingRequestInfo = reactive({
  message: null,
  channel: null,
  TRTC_roomid:null,
  friend_id: null,
  friend_name: null,
  localStream: null,
});
const audio = reactive({
  volume: 0,
  ratio:0.85,
  stop:false
})
const Headset = reactive({
  ratio:1,
  stop:false
})
watch(audio, (newVal, oldVal) => {
  TRTC.getSpeakers().then(res => {
    
  })
},{deep:true});
onMounted(() => {
  initSystemSocket();
  window.addEventListener("beforeunload", (e) => closePhoneConn(1));
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
  systemsockSend("0", callingRequestInfo.friend_id, "callingRespond");
  store.commit("changePhoneStatus", false);
};
const acceptCallingResquest = () => {
  systemsockSend("1", callingRequestInfo.friend_id, "callingRespond");
  ElNotification({
    title: "注意",
    message: "开始连接到语音服务",
    type: "success",
    offset: 130,
  });
  connectPhone(callingRequestInfo.TRTC_roomid);
  receiveCallingRequest.value = false;
};
let systemsock = "";
const initSystemSocket = () => {
  systemsock = new WebSocket(
    inject('$systemSocket') + store.state.userInfo.id
  );
  systemsock.onopen = systemsockOnOpen;
  systemsock.onclose = systemsockOnClose; 
  systemsock.onmessage = systemsockOnMessage;
};
const systemsockOnMessage = (e) => {
  const message = JSON.parse(e.data);
  switch (message.typeCode) {
    case 100 /*接收到连接语音请求*/:
      store.commit("changePhoneStatus", true);
      changeCallingRequestInfo({
        message: message,
        channel: message.channel,
        friend_id: message.origin.id,
        friend_name: message.origin.name,
        TRTC_roomid: message.message
      });
      receiveCallingRequest.value = true;
      break;
    case 200 /*接收到回复请求*/:
      if (message.message === 0) {
        ElNotification({
          title: "注意",
          message: "对方拒绝了您的语音请求",
          type: "info",
          offset: 130,
        });
        store.commit("changePhoneStatus", false);
        initCallingRequestInfo();
      } else if (message.message === 1) {
        ElNotification({
          title: "注意",
          message: "开始连接到语音服务",
          type: "success",
          offset: 130,
        });
        connectPhone(callingRequestInfo.TRTC_roomid);
      }
      break;
    case 201 /*对方主动断开连接*/:
      closePhoneConn(0);
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
  closePhoneConn(1);
  // systemsockSend(null, callingRequestInfo.friend_id, "closeCalling",callingRequestInfo.channel);
  console.log("systemsock close");
};
const systemsockSend = (msg, id, type, channel = null) => {
  systemsock.send(
    JSON.stringify({
      msg: msg,
      id: id,
      type: type,
      channel: channel,
      userInfo: {
        id: store.state.userInfo.id,
        name: store.state.userInfo.username,
      },
    })
  );
};
const initCallingRequestInfo = () => {
  callingRequestInfo.message = null;
  callingRequestInfo.friend_id = null;
  callingRequestInfo.channel = null;
  callingRequestInfo.friend_name = null;
  callingRequestInfo.localStream = null;
  callingRequestInfo.TRTC_roomid = null;
};
const changeCallingRequestInfo = (Info) => {
  callingRequestInfo.message = Info.message;
  callingRequestInfo.friend_id = Info.friend_id;
  callingRequestInfo.channel = Info.channel;
  callingRequestInfo.friend_name = Info.friend_name;
  callingRequestInfo.TRTC_roomid = Info.TRTC_roomid;
};
const localStreamInit = async roomId => {
  await client.join({ roomId: roomId });
  callingRequestInfo.localStream = TRTC.createStream({ userId:store.state.userInfo.id, audio: true,video: false});
  await callingRequestInfo.localStream.initialize();
  await callingRequestInfo.localStream.play('elementId').catch(error => {});
  await client.publish(callingRequestInfo.localStream);
}
const call = _.throttle(
  function () {
    if (
      store.state.phoneInfo.room_id === null &&
      store.state.phoneLoading !== true
    ) {
      checkUserStatu({ user_id: store.state.friend.id }).then((res) => {
        if (res.status == 1) {
          const id = store.state.friend.id;
          const channel = store.state.channels;
          const name = store.state.friend.name;
          store.commit("changePhoneStatus", true);
          distributeRoomid({}).then(res =>{
            systemsockSend(res.roomId, id, "callingRequest", channel);
            changeCallingRequestInfo({
              message: null,
              friend_id: id,
              channel: channel,
              friend_name: name,
              TRTC_roomid: res.roomId,
            });
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
      closePhoneConn(1);
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
  },
  1000,
  {
    leading: true,
    trailing: false,
  }
);
const connectPhone = (roomId) => {
  try {
    //推送本地流
    localStreamInit(roomId)
    client.on('audio-volume', event => {
      event.result.forEach(({ userId, audioVolume, stream }) => {
        audio.volume = audioVolume
      })
    })
    client.enableAudioVolumeEvaluation(200);
    store.commit("savePhoneInfo", {
      room_id: callingRequestInfo.channel,
      type: "private",
      friendInfo: {
        friendId: callingRequestInfo.friend_id,
        friendName: callingRequestInfo.friend_name,
      },
    });
  } catch (error) {
    console.error("进房失败 " + error);
  }
  store.commit("changePhoneStatus", false);
};
// type为1则为主动，type为0则为被动
const closePhoneConn = (type) => {
  callingRequestInfo.localStream.close();
  client.unpublish(callingRequestInfo.localStream);
  client.leave();
  if (type) {
    systemsockSend(
      null,
      callingRequestInfo.friend_id,
      "closeCalling",
      callingRequestInfo.channel
    );
  }
  store.commit("clearPhoneInfo");
  initCallingRequestInfo();
  audio.volume = 0
  return 1;
};
</script>
<template>
  <el-dialog
    v-model="receiveCallingRequest"
    title="请求"
    width="20%"
    :before-close="handleResquestClose"
  >
    <span>对方希望与您建立语音</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleResquestClose">拒绝</el-button>
        <el-button @click="acceptCallingResquest">同意</el-button>
      </span>
    </template>
  </el-dialog>
  <div class="main-container">
    <el-container class="frame">
      <el-header class="frame-header">
        <headerMenus
          @fatherMethod="LogoutThisUser"
          @closePhoneConn="closePhoneConn"
          :audio = "audio"
          :Headset = "Headset"
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
            <router-view @call="call"/>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
  <div id="elementId"></div>
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
