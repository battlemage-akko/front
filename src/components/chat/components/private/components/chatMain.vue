<script setup>
import { onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { getThisFriendInfo } from "@/api/auth";
import { timestampToTime } from "@/utils/formatTime.js";
import { useStore } from "vuex";
import { Check } from '@element-plus/icons-vue'
const store = useStore();
const router = useRouter();
const msgList = ref([]);
const friendId = router.currentRoute.value.params.id;
const friendInfo = ref({});
const msgForm = reactive({
  msg: "",
  type: "",
});
onMounted(() => {
  getThisFriendInfo({
    id: friendId,
  }).then((res) => {
    friendInfo.value = res.result;
    console.log(friendInfo.value);
  });
  initWebSocket();
});

let websock = "";
let room_id =
  parseInt(friendId) > parseInt(store.state.userInfo.id)
    ? store.state.userInfo.id + friendId
    : friendId + store.state.userInfo.id;

const initWebSocket = () => {
  websock = new WebSocket("ws://127.0.0.1:8000/connectChannel/" + room_id);
  websock.onmessage = websocketOnMessage;
  websock.onopen = websocketOnOpen;
  websock.onerror = websocketOnError;
  websock.onclose = websocketClose;
};

const sendWebSocketMsg = (type = "text") => {
  let message = {
    ...msgForm,
    user_id: store.state.userInfo.id,
    friend_id: friendId,
  };
  message["type"] = type;
  console.log(message)
  websock.send(JSON.stringify(message));
  msgForm.msg = ""
};

const websocketOnMessage = (e) => {
  let msgJson = JSON.parse(e.data);
  if (msgJson.status == 200) {
    if (msgJson.user_id == store.state.userInfo.id) {
      msgJson.me = 1;
      msgJson.username = store.state.userInfo.username;
    } else {
      msgJson.me = 0;
      msgJson.username = friendInfo.value.friendName;
    }
    msgJson.msgFormat = JSON.parse(JSON.parse(msgJson.message)).msg;
    msgList.value.push(msgJson);
  }
};
const websocketOnOpen = (e) => {
  console.log("socke已连接");
  msgForm.msg  = localStorage.getItem('token')
  sendWebSocketMsg();
};
const websocketOnError = (e) => {};
const websocketClose = (e) => {
  console.log("断开连接", e);
};
</script>

<template>
  <el-container class="privateChat-frame">
    <el-header class="private-header">
      <el-icon style="padding-right: 10px; font-size: 20px">
        <chat-line-square />
      </el-icon>
      {{ friendInfo.friendName }}
    </el-header>
    <el-main class="private-body">
      <div
        v-for="(item, index) in msgList"
        :key="index"
        class="bubble"
        :style="item.me == 1 ? 'justify-content:right' : ''"
      >
        <img
          class="bubbleAvatar"
          v-if="item.me != 1"
          :src="
            item.me == 1
              ? this.$store.state.userInfo.avatar
              : this.friendInfo.friendAvatar
          "
          alt=""
        />
        <div class="saySomething">
          <div
            class="nameAndTime"
            :style="item.me == 1 ? 'justify-content:right' : ''"
          >
            <span class="time">{{ timestampToTime(item.time) }}</span>
          </div>
          <div
            class="bubbleContainer"
            :style="item.me == 1 ? 'justify-content:right' : ''"
          >
            <span class="bubbleText">
              {{ item.msgFormat }}
            </span>
          </div>
        </div>
        <img
          class="bubbleAvatar"
          v-if="item.me == 1"
          :src="
            item.me == 1
              ? this.$store.state.userInfo.avatar
              : this.friendInfo.friendAvatar
          "
          alt=""
        />
      </div>
    </el-main>
    <el-footer class="private-footer">
      <el-form
        style="height: 100%"
        ref="ruleFormRef"
        :model="msgForm"
        @submit.enter.prevent
      >
        <el-form-item prop="msg" style="height: 100%; display: flex">
          <el-input
            autofocus
            v-model="msgForm.msg"
            placeholder="按回车发送"
            clearable
            class="inputMsg"
          >
            <template #append>
              <el-button type="primary" native-type="submit" :icon="Check" @click="sendWebSocketMsg"/>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </el-footer>
  </el-container>
</template>

<style lang="scss" scope>
.privateChat-frame {
  height: 100%;
  .private-header {
    height: 50px;
    border-bottom: $border2;
    display: flex;
    align-items: center;
    font-size: 18px;
  }
  .private-body {
    height: 0;
    flex-grow: 1;
    border-bottom: $border2;
    .bubble {
      display: flex;
      margin-bottom: 15px;
      .saySomething {
        display: flex;
        flex-direction: column;
        margin: 0px 20px;
        .bubbleContainer {
          display: flex;
          .bubbleText {
            word-break: break-all; 
            font-weight: 600;
            font-size: 20px;
            background-color: rgb(219, 219, 219);
            padding: 10px;
            border-radius: 5px;
          }
        }
        .nameAndTime {
          display: flex;
          font-size: 15px;
          .time {
            font-size: 12px;
            color: rgb(114, 114, 114);
            font-weight: 600;
            margin-bottom: 5px;
          }
        }
      }
      .bubbleAvatar {
        width: 40px;
        height: 40px;
        border-radius: 50px;
        border: 5px solid rgb(202, 202, 202);
      }
    }
  }
  .private-footer {
    height: 80px;
    padding: 20px;
  }
  .inputMsg {
    height: 100%;
    input {
      height: 100%;
      background-color: rgb(235, 235, 235);
      &:focus {
      }
    }
  }
}
</style>