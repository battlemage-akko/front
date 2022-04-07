<script setup>
import { onMounted, ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { getThisFriendInfo, getPrivateChatRecord } from "@/api/auth";
import { timestampToTime } from "@/utils/formatTime.js";
import { useStore } from "vuex";
import { Check } from "@element-plus/icons-vue";
const store = useStore();
const router = useRouter();
const msgList = ref([]);
const friendId = router.currentRoute.value.params.id;
const friendInfo = ref({});
const loadingRecord = ref(true);
const recordContainer = ref(null);
const msgForm = reactive({
  msg: "",
  type: "",
});
onMounted(() => {
  getThisFriendInfo({
    id: friendId,
  }).then((res) => {
    friendInfo.value = res.result;
  });
  initWebSocket();
});
watch(loadingRecord, (newValue, oldValue) => {
  console.log(recordContainer.value)
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

const sendWebSocketMsg = () => {
  let message = {
    ...msgForm,
    user_id: store.state.userInfo.id,
    friend_id: friendId,
    room_id: room_id,
  };
  message["type"] = "T";
  console.log(message);
  websock.send(JSON.stringify(message));
  msgForm.msg = "";
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
  getPrivateChatRecord({
    room_id: room_id,
  }).then((res) => {
    for (let item of res.record) {
      if (item.user_id == store.state.userInfo.id) {
        item.me = 1;
        item.username = store.state.userInfo.username;
      } else {
        item.me = 0;
        item.username = friendInfo.value.friendName;
      }
      item.time = item.add_time;
      item.msgFormat = item.content;
      msgList.value.push(item);
    }
    loadingRecord.value = false;
  });
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
    <el-main
      class="private-body"
      v-loading="loadingRecord"
      ref="recordContainer"
    >
      <div> 
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
            :disabled="!loadingRecord"
          >
            <template #append>
              <el-button
                type="primary"
                native-type="submit"
                :icon="Check"
                @click="sendWebSocketMsg"
                :disabled="!loadingRecord"
              />
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
    overflow-y: auto;
    border-bottom: $border2;
    padding: 0px;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 1px;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 10px;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #535353;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      background: #ededed;
    }
    .bubble {
      &:hover {
        background-color: rgb(243, 243, 243);
        box-shadow: $shadow3;
        border-radius: 5px;
      }
      display: flex;
      padding: 10px;
      .saySomething {
        display: flex;
        flex-direction: column;
        margin: 0px 20px;
        .bubbleContainer {
          display: flex;
          margin-top: 3px;
          .bubbleText {
            word-break: break-all;
            font-weight: 600;
            font-size: 20px;
            background-color: rgb(211, 211, 211);
            padding: 15px 10px;
            border-radius: 5px;
          }
        }
        .nameAndTime {
          display: flex;
          font-size: 15px;
          .time {
            font-size: 12px;
            color: rgb(114, 114, 114);
            font-weight: 500;
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