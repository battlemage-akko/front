<script setup>
import { ref, defineProps, defineEmits, watch, computed, reactive } from "vue";
import avatarCropper from "@/components/until/avatarCropper.vue";
import { useStore } from "vuex";
import { Search } from "@element-plus/icons-vue";
import { VueCropper } from "vue-cropper";
const emit = defineEmits(["update", "delete"]);
const store = useStore();
const logout = () => {
  emit("fatherMethod");
};
const closePhoneConn = (type) => {
  emit("closePhoneConn",type);
};
const props = defineProps({ 
  audio: { type: Object },
  Headset: { type: Object }  
})
const phoneStatus = reactive({
  status: computed(() => {
    return store.state.phoneLoading;
  }),
});
const mute = (object) => {
  object.stop = !object.stop
  if(object.stop){

  }
}
const upload = ref();
const avatarChange = ref(false);
const closeAvatarDialog = (data) => {
  avatarChange.value = false;
};
</script>

<template>
  <div id="header">
    <avatarCropper
      :avatarChange="avatarChange"
      @closeAvatarDialog="closeAvatarDialog"
    ></avatarCropper>
    <div class="logo">
      <img src="https://cdn.lili-secretbase.com/pic/logo.png" alt="" />
    </div>
    <!-- <div class="searchInput">
      <el-input
        class="inputArea"
        placeholder="Type something"
        :prefix-icon="Search"
      />
    </div> -->
    <div class="profile">
      <h1 class="phoneConnecting" v-show="phoneStatus.status === true">
        <span style="padding: 0px 20px"> 语音连接中... </span>
      </h1>
      <el-tooltip
        class="box-item"
        effect="dark"
        v-if="this.$store.state.phoneInfo.room_id !== null"
        :content="
          this.$store.state.phoneInfo.type == 'private'
            ? '当前正在与' +
              this.$store.state.phoneInfo.friendInfo.friendName +
              '通话'
            : '当前正在群' + '通话'
        "
        placement="bottom-end"
      >
        <span :class="props.audio.volume>1?'phoneStatus is-active':'phoneStatus'" @click="closePhoneConn(1)">
          <el-icon><Phone /></el-icon>
          <!-- <el-icon><Microphone /></el-icon> -->
        </span>
      </el-tooltip>
      <div class="audioVolume" v-if="this.$store.state.phoneInfo.room_id !== null">
        <span>
          <el-icon><Microphone /></el-icon>
        </span>
        <el-slider v-model="props.audio.ratio" size="small" max="1" step="0.01"/>
      </div>
      <div class="audioVolume" v-if="this.$store.state.phoneInfo.room_id !== null">
        <span>
          <el-icon><Headset /></el-icon>
        </span>
        <el-slider v-model="props.Headset.ratio" :show-tooltip="false" size="small" max="1" step="0.01"/>
      </div>
      <el-popover
        placement="bottom"
        :width="200"
        trigger="hover"
        content="this is content, this is content, this is content"
      >
        <template #reference>
          <el-icon class="myMessage">
            <Message />
          </el-icon>
        </template>
      </el-popover>
      <el-popover
        :width="300"
        popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
      >
        <template #reference>
          <!-- <el-avatar src="https://avatars.githubusercontent.com/u/72015883?v=4" /> -->
          <el-avatar :src="this.$store.state.userInfo.avatar"></el-avatar>
        </template>
        <template #default>
          <div style="display: flex; gap: 16px; flex-direction: column">
            <div class="profileTitle">
              <el-avatar
                :size="60"
                :src="this.$store.state.userInfo.avatar"
                style="margin-bottom: 8px"
              />
              <div class="profileName">
                <span>{{ this.$store.state.userInfo.username }}</span>
              </div>
            </div>
            <el-menu class="profileMenu">
              <el-menu-item index="3">
                <el-icon><document /></el-icon>
                <span>设置</span>
              </el-menu-item>
              <el-menu-item index="4">
                <div @click="avatarChange = true">
                  <el-icon><Picture /></el-icon>
                  <span>更换头像</span>
                </div>
              </el-menu-item>
              <el-menu-item index="100">
                <el-icon><setting /></el-icon>
                <span @click="logout">登出</span>
              </el-menu-item>
            </el-menu>
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<style lang="scss" scope>
#header {
  display: flex;
  justify-content: space-between;
  height: 100%;
  position: relative;
  .searchInput {
    display: flex;
    align-items: center;
    width: 40%;
    .inputArea {
      width: 100%;
      input {
        border-radius: 20px;
      }
    }
  }
  .logo {
    padding: 10px 20px;
    img {
      height: 100%;
    }
  }
  .profile {
    display: flex;
    align-items: center;
    cursor: pointer;
    .el-avatar {
      border: 3px solid rgba(0, 0, 0, 0);
    }
    .audioVolume {
      width: 100px;
      margin:0px 15px;
      display: flex;
      align-items: center;
      .el-slider{
        .el-slider__runway{
          .el-slider__button-wrapper{
            .el-slider__button{
              opacity: .8;
              width:12px;
              height: 12px;

            }
          }
        }
      }
      span {
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        font-size: 20px;
        position: relative;
      }
      .is-stop{
        &::after{
          content: "";
          border-top: 1px solid red;
          position:absolute;
          width: calc(100% - 4px);
          transform: translateY(50%) rotate(45deg);
        }
      }
    }
    .myMessage {
      width: 40px;
      height: 40px;
      font-size: 20px;
      margin: 0px 10px;
      position: relative;
      &::after {
        content:"";
        position: absolute;
        right: 7px;
        top: 8px;
        width: 8px;
        height: 8px;
        background-color:red;
        border-radius:10px;
      }
    }
    .phoneConnecting {
      font-size: 18px;
    }
    .phoneStatus {
      box-sizing: border-box;
      font-size: 21px;
      width: 35px;
      height: 35px;
      color: black;
      display: flex;
      justify-content: center;
      border-radius: 22px;
      align-items: center;
      &.is-active {
        // color: white;
        border: 3px solid rgb(0, 204, 153);
        border-radius: 22px;
      }
    }
  }
}
.el-popover {
  border-radius: 6px !important;
  width: 200px !important;
  .profileTitle {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 500;
    .profileName {
      margin-left: 20px;
    }
  }
  .profileMenu {
    border-right: none;
    .el-menu-item {
      height: 40px;
      padding-left: 10px !important;
      &:hover {
        border-radius: 5px;
        background-color: #e0e0e0;
      }
    }
  }
}
</style>