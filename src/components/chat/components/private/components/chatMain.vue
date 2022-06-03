<script setup>
import { onMounted, ref, reactive, watch, nextTick,defineEmits,onUnmounted, inject } from "vue";
import { useRouter } from "vue-router";
import {
  getThisFriendInfo,
  getPrivateChatRecord,
  uploadPicture,
  backMsg,
} from "@/api/auth";
import { timestampToTime } from "@/utils/formatTime.js";
import { ElMessage, ElNotification } from "element-plus";
import { useStore } from "vuex";
import { Check } from "@element-plus/icons-vue";
const store = useStore();
const router = useRouter();
const msgList = reactive([]);
const friendId = router.currentRoute.value.params.id;
const friendInfo = ref({});
const loadingRecord = ref(true);
const recordContainer = ref(null);
const showPicture = ref(false);
const picture = ref(null);
let imgRefs = reactive({});
const emit = defineEmits(["update", "delete"]);
const pictureButter = ref({
  content: "",
  file: "",
  picName: "",
});
const msgForm = reactive({
  msg: "",
  type: "",
});
const call = () => {
  emit("call")
}
let websock = "";
let room_id =
  parseInt(friendId) > parseInt(store.state.userInfo.id)
    ? store.state.userInfo.id.toString() +'_'+ friendId.toString()
    : friendId.toString() +'_'+ store.state.userInfo.id.toString();
onMounted(() => {
  getThisFriendInfo({
    id: friendId,
  }).then((res) => {
    res.result.friendId = friendId;
    friendInfo.value = res.result;
  });
  initWebSocket();
});
onUnmounted(()=>{ 
  websock.close();
})

const initWebSocket = () => {
  websock = new WebSocket(inject('$chatSocket')+ room_id);
  websock.onmessage = websocketOnMessage;
  websock.onopen = websocketOnOpen;
  websock.onerror = websocketOnError;
  websock.onclose = websocketClose;
};
const sendPicture = () => {
  uploadPicture({
    img: pictureButter.value.content,
    picName: pictureButter.value.picName,
  }).then((res) => {
    msgForm.msg = res.picture;
    sendWebSocketMsg("P",room_id);
    previewClose();
    recordContainer.value.scrollTop = recordContainer.value.scrollHeight;
  });
};
const computeHeight = (e) => {
  
};
const checkPicture = (file) => {
  const isIMAGE =
    file.raw.type === "image/jpeg" || file.raw.type === "image/png";
  const isLt5M = file.raw.size / 1024 / 1024 < 5;
  if (!isIMAGE) {
    ElMessage({
      showClose: true,
      message: "请选择 jpg、png 格式的图片",
      type: "warning",
    });
    return false;
  }
  if (!isLt5M) {
    ElMessage({
      showClose: true,
      message: "图片大小不能超过 5MB",
      type: "warning",
    });
    return false;
  }
  let reader = new FileReader();
  reader.readAsDataURL(file.raw);
  reader.onload = (e) => {
    pictureButter.value.content = e.target.result;
  };
  pictureButter.value.file = file;
  pictureButter.value.picName = pictureButter.value.file.name;
  showPicture.value = true;
};
const sendWebSocketMsg = (type,room_id) => {
  let message = {
    ...msgForm,
    user_id: store.state.userInfo.id,
    friend_id: friendId,
    room_id: room_id,
  };
  message["type"] = type;
  websock.send(JSON.stringify(message));
  msgForm.msg = "";
};
const websocketOnMessage = (e) => {
  let msgJson = JSON.parse(e.data);
  if (msgJson.status == 200) {
    msgJson.msgFormat = JSON.parse(JSON.parse(msgJson.message)).msg;
    if (msgJson.type === "B") {
      blankMsg(msgJson.msgFormat)
      return
    }
    if (msgJson.user_id == store.state.userInfo.id) {
      msgJson.me = 1;
      msgJson.username = store.state.userInfo.username;
    } else {
      msgJson.me = 0;
      msgJson.username = friendInfo.value.friendName;
    }
    if (msgJson.type === "P") {
      msgJson.loading = true;
    }
    msgJson.withdrawing = false;
    console.log(msgJson)
    msgList.push(msgJson);
    nextTick(() => {
      if(recordContainer.value.scrollTop!==null){
        if (
        recordContainer.value.scrollTop + 988 >=
          recordContainer.value.scrollHeight ||
        (msgJson.type == "p" &&
          recordContainer.value.scrollTop + 848 <=
            recordContainer.value.scrollHeight)
      ) {
        recordContainer.value.scrollTop = recordContainer.value.scrollHeight;
      }
      }
    });
  }
};
const websocketOnOpen = (e) => {
  getPrivateChatRecord({
    room_id: room_id,
  }).then((res) => {
    store.commit("saveChannel", room_id);
    store.commit("saveFriend", {id:friendId,name:friendInfo.value.friendName});
    for (let item of res.record) {
      item.withdrawing = false
      if (item.user_id == store.state.userInfo.id) {
        item.me = 1;
        item.username = store.state.userInfo.username;
      } else {
        item.me = 0;
        item.username = friendInfo.value.friendName;
      }
      item.time = item.add_time;
      item.msgFormat = item.content;
      if(item.type == 'P'){
        item.loading = true;
      }
      msgList.push(item);
    }
    nextTick(() => {
      loadingRecord.value = false;
      recordContainer.value.scrollTop = recordContainer.value.scrollHeight;
    });
  });
};
const previewClose = () => {
  pictureButter.value.content = "";
  pictureButter.value.file = "";
  pictureButter.value.name = "";
  picture.value.clearFiles();
  showPicture.value = false;
};
const websocketOnError = (e) => {
};
const websocketClose = (e) => {
  // console.log("断开连接", e);
};
const loadImg = (item) => {
  msgList[msgList.indexOf(item)].loading = false;
  recordContainer.value.scrollTop += imgRefs[item.id].$el.offsetHeight;
};
const setrefsFun = (el, item) => {
  if (el && item) {
    imgRefs[item] = el;
  }
};
const blankMsg = (id) => {
  let msg = msgList[msgList.findIndex((value)=>value.id == id)]
  msg.content = null
  msg.msgFormat = null
  msg.back = true
}
const back = (id) => {
  let item = msgList[msgList.findIndex((value)=>value.id == id)]
  item.withdrawing = true
  backMsg({
    id:id
    }).then(res =>{
    if(res.status === 1){
      item.withdrawing = false
      blankMsg(id)
      msgForm.msg = item.id
      sendWebSocketMsg("B",room_id)
    }
  })
}
// const closePhoneConn = () => {
//   msgForm.msg = "离开语音";
//   sendWebSocketMsg("R",store.state.phoneInfo.room_id);
//   store.commit('clearPhoneInfo');
// }
// const call = () => {
//   if (store.state.phoneInfo.room_id === null) {
//     msgForm.msg = "进入语音";
//     sendWebSocketMsg("R",room_id);
//     store.commit("savePhoneInfo", {
//       room_id: room_id,
//       type: "private",
//       friendInfo: friendInfo,
//     });
//   }
//   else if(store.state.phoneInfo.friendInfo.friendId === friendId) {
//     closePhoneConn()
//   } 
//   else {
//     ElNotification({
//       title: "警告",
//       message: "请点击顶部头像隔壁的电话按钮关闭与其他人的语音再进行连接",
//       type: "warning",
//       offset: 120,
//     });
//   }
// };
</script>

<template>
  <el-dialog
    v-model="showPicture"
    width="40%"
    :before-close="previewClose"
    style="max-height: 500px"
  >
    <span>
      <img :src="pictureButter.content" alt="" class="previewPicture" />
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="previewClose">取消</el-button>
        <el-button type="primary" @click="sendPicture">发送</el-button>
      </span>
    </template>
  </el-dialog>
  <el-container class="privateChat-frame">
    <el-header class="private-header">
      <span class="friendName">
        <el-icon style="padding-right: 10px; font-size: 20px">
          <chat-line-square />
        </el-icon>
        {{ friendInfo.friendName }}
      </span>
      <el-menu
        :default-active="activeIndex"
        class="toolList"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="2" class="toolListItem" @click="call"
          ><el-icon><Phone-filled /></el-icon
        ></el-menu-item>
        <el-sub-menu index="1" class="toolListItem">
          <template #title>新建工作区</template>
          <el-menu-item index="2-1">item one</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-header>
    <el-main
      v-loading="loadingRecord"
      style="display: flex; height: 0; flex-grow: 1; padding: 0px"
    >
      <div class="private-body" ref="recordContainer">
        <!-- <ul class="chatBtns">
          <li><span style="position:absolute;"><el-icon><Download /></el-icon></span></li>
        </ul> -->
        <transition-group name="bubbles" tag="p">
          <div
            v-for="item in msgList"
            :key="item.id"
          >
            <div class="bubble" :style="item.me == 1 ? 'justify-content:right' : ''" v-loading="item.withdrawing" v-if="!item.back">
              <ul class="msgBtns" v-if="!item.withdrawing">
                <li v-if="item.me == 1" @click="back(item.id)">
                <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="撤回消息"
                    placement="top"
                  >
                    <el-icon><Back /></el-icon>
                  </el-tooltip>
                </li>
                <li>
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="删除消息"
                    placement="top"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-tooltip>
                </li>
                <li>
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="分享"
                    placement="top"
                  >
                    <el-icon><ChatLineSquare /></el-icon>
                  </el-tooltip>
                </li>

              </ul>
              <h1 v-if="item.type === 'R'" class="systemMsg">
              {{ item.username }} {{ item.msgFormat }}
            </h1>
            <img
              class="bubbleAvatar"
              v-if="item.me != 1 && item.type !== 'R'"
              :src="
                item.me == 1
                  ? this.$store.state.userInfo.avatar
                  : this.friendInfo.friendAvatar
              "
              alt=""
            />
            <div class="saySomething" v-if="item.type !== 'R'">
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
                <div class="bubbleText">
                  <span v-if="item.type === 'T'">{{ item.msgFormat }}</span>
                  <el-image
                    alt=""
                    v-if="item.type === 'P'"
                    class="pic"
                    v-loading="item.loading"
                    :src="item.msgFormat"
                    :ref="(el) => setrefsFun(el, item.id)"
                    @load="loadImg(item)"
                    lazy
                  >
                    <template #error>
                      <div class="image-slot">
                        <el-icon><Picture /></el-icon>
                      </div> </template
                  ></el-image>
                </div>
              </div>
            </div>
            <img
              class="bubbleAvatar"
              v-if="item.me == 1 && item.type !== 'R'"
              :src="
                item.me == 1
                  ? this.$store.state.userInfo.avatar
                  : this.friendInfo.friendAvatar
              "
              alt=""
            />
            </div>
            <div class="backMsg" v-if="item.back">
              <span>
                <b v-if="item.me == 1">您</b>
                <b v-if="item.me != 1">对方</b>
                撤回了一条消息
              </span>
            </div>
          </div>
        </transition-group>
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
            v-model="msgForm.msg"
            placeholder="按回车发送"
            clearable
            class="inputMsg"
            :disabled="loadingRecord"
          >
            <template #append>
              <el-button
                type="primary"
                native-type="submit"
                :icon="Check"
                @click="sendWebSocketMsg('T',room_id)"
                :disabled="loadingRecord"
              />
            </template>
            <template #suffix>
              <el-upload
                action="#"
                class="uploadPicture"
                ref="picture"
                :show-file-list="false"
                :on-change="checkPicture"
                :limit="1"
                accept="image/jpeg, image/jpg"
                :auto-upload="false"
              >
                <el-icon class="el-input__icon pictureButton">
                  <Picture />
                </el-icon>
              </el-upload>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </el-footer>
  </el-container>
</template>

<style lang="scss" scope>
@mixin display-center {
  display: flex;
  justify-content: center;
}
.previewPicture {
  width: 100%;
}
.privateChat-frame {
  height: 100%;
  .private-header {
    height: 50px;
    border-bottom: $border2;
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    .friendName {
      display: flex;
      align-items: center;
    }
    .toolList {
      .toolListItem {
        padding: 0px 10px;
        &:hover {
          background: none;
        }
      }
      .is-active {
        border: none;
        background: none;
        color: none;
      }
    }
  }
  .private-body {
    height: 100%;
    position: relative;
    overflow-y: auto;
    border-bottom: $border2;
    padding: 0px;
    flex: 1;
    box-sizing: border-box;
    .chatBtns {
      position: fixed;
      list-style: none;
      bottom: 0;
    }
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 5px;
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
    // .bubbles-enter-active,
    // .bubbles-leave-active {
    //   transition: all 1s;
    // }
    // .bubbles-enter,
    // .bubbles-leave-to {
    //   opacity: 0;
    //   transform: translateY(30px);
    // }

    .bubble {
      .msgBtns {
        margin: 0px;
        height:30px;
        padding: 0px;
        border-radius: 5px;
        background-color: rgb(150, 150, 150);
        display: none;
        transition: all .5s ease;
        align-items: center;
        color: white;
        font-weight: 550;
        position: absolute;
        right: 50%;
        top: -15px;
        transform: translateX(50%);
        list-style: none;
        li {
          padding: 5px 7px;
          cursor: pointer;
          border-right: 2px solid #ffffff;
          transition: all .5s ease;
          &:hover{
            background-color: rgb(54, 54, 54);
          }
        }
        li:last-child{
          border-right: none
        }
      }
      &:hover {
        background-color: rgb(243, 243, 243);
        box-shadow: $shadow3;
        border-radius: 5px;
      }
      &:hover .msgBtns {
        display: flex;
      }
      .systemMsg {
        @include display-center;
        margin: 0px;
        font-size: 12px;
        width: 100%;
        opacity: 0.5;
      }
      display: flex;
      padding: 10px;
      margin: 15px;
      position: relative;
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
            padding: 10px;
            border-radius: 5px;
            display: flex;
            .pic {
              max-width: 500px;
              min-width: 200px;
              min-height: 100px;
              max-height: 3000px;
            }
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
    .backMsg{
      display: flex;
      justify-content: center;
      margin: 10px 0px;
      span{
        background-color:rgba(168, 168, 168, 0.555);
        padding: 3px 6px;
        border-radius: 6px;
        font-weight: 600;
        color: rgba(41, 41, 41, 0.767);
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
    }
    .uploadPicture {
      font-size: 20px;
      font-weight: 700;
      color: rgb(126, 126, 126);
      cursor: pointer;
      display: flex;
      align-items: center;
    }
  }
}
</style>