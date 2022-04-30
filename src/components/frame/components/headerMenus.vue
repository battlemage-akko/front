<script setup>
import { ref, defineEmits, watch, reactive } from "vue";
import avatarCropper from "@/components/until/avatarCropper.vue";
import { Search } from "@element-plus/icons-vue";
import { VueCropper } from "vue-cropper";
const emit = defineEmits(["update", "delete"]);
const logout = () => {
  emit("fatherMethod");
};
const closePhoneConn = () => {
  emit("closePhoneConn");
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
    <div class="searchInput">
      <el-input
        class="inputArea"
        placeholder="Type something"
        :prefix-icon="Search"
      />
    </div>
    <div class="profile">
      <el-tooltip
        class="box-item"
        effect="dark"
        v-if="this.$store.state.phoneInfo.room_id !== null"
        :content="this.$store.state.phoneInfo.type == 'private' ? '当前正在与'+this.$store.state.phoneInfo.friendInfo.friendName+'通话':'当前正在群'+'通话'"
        placement="bottom-end"
      >
        <span
          class="phoneStatus is-active"
          @click="closePhoneConn"
        >
          <el-icon><Phone /></el-icon>
        </span>
      </el-tooltip>

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
              <el-menu-item index="4">
                <div>
                  <el-icon><Message /></el-icon>
                  <span>信息</span>
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
    .phoneStatus {
      font-size: 22px;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      &.is-active {
        color: white;
        background-color: rgb(0, 204, 153);
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