
<script setup>
import { ref, computed } from "vue";
import settingDialog from "@/components/until/setting/setting.vue"
import { useStore } from "vuex";
const store = useStore();

function toggleCollage() {
  store.commit("toggleCollage", null);
}
const openSetting = ref(false)
const closeSetting = () => {
  openSetting.value = false
}
</script>

<template>
  <settingDialog :openSetting="openSetting" :closeSetting="closeSetting"/>
  <el-menu
    default-active="2"
    class="aside-Menus"
    :collapse="this.$store.state.isCollage"
    :collapse-transition="false"
    router
  >
    <el-menu-item class="menu-items invite">
      <el-icon><CirclePlusFilled /></el-icon>
      <template #title>
        <span class="inviteSomebody">添加群组</span>
      </template>
    </el-menu-item>
    <el-menu-item :route="{ name: 'default' }" class="menu-items" index="1">
      <img src="@/assets/profile.png" alt="" />
      <template #title>
        <span class="groupName">
          <span> 主页 </span>
        </span>
      </template>
    </el-menu-item>
    <el-menu-item :route="{ name: 'Group' }" class="menu-items" index="2">
      <img src="@/assets/author.jpg" alt="" />
      <template #title>
        <span class="groupName">
          <span> groupName </span>
        </span>
      </template>
    </el-menu-item>
    <li style="flex: 1; border-bottom: 1px solid rgba(0, 0, 0, 0.1)"></li>
  </el-menu>
  <div class="menu-items hive" @click="openSetting = true">
    <el-icon><Setting /></el-icon>
  </div>
  <div class="menu-items hive" @click="toggleCollage">
    <el-icon><Expand /></el-icon>
  </div>
</template>

<style lang="scss" scope>
.menu-items {
  padding: 0px 7px !important;
  font-size: 18px;
  height: 50px;
  background-color: white;
  display: flex;
  .chosenBg {
    width: 50%;
    height: 120%;
    background-color: black;
    position: absolute;
    left: 50%;
  }
  .groupName {
    span {
      border-radius: 10px;
      width: 100%;
      height: 40px;
      background-color: rgb(122, 121, 121);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0px 10px;
    }
    width: 100%;
    padding: 0px 15px;
    font-weight: 550;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: $FS2;
    color: white;
  }
}
.hive {
  font: 30px;
  cursor: pointer;
  display: flex;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  justify-content: center;
  align-items: center;
}
.aside-Menus:first-child {
  .el-icon {
    padding: 13px;
  }
}
.aside-Menus {
  display: flex;
  flex-direction: column;
  height: calc(100% - 100px);
  .invite {
    margin-bottom: 5px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    height: 50px !important;
    .inviteSomebody {
      font-weight: 550;
      display: flex;
      justify-content: center;
      align-content: center;
      flex: 1;
      font-size: $FS3;
    }
  }
  .menu-items:hover {
    background-color: white;
    .groupName {
      span {
        background-color: rgb(0, 0, 0);
      }
    }
  }
  .menu-items {
    transition: all 0.5 ease !important;
    img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 50px;
      border: 5px solid rgb(201, 201, 201);
      box-sizing: border-box;
    }
    div {
      padding: 0px !important;
      justify-content: center;
    }
    height: 60px;
  }
}
</style>