<script setup>
import { Search } from "@element-plus/icons-vue";
import { ref } from 'vue'

const dialogVisible = ref(false)
</script>

<template>
  <div id="friendsList">
    <div class="addFriend" @click="dialogVisible = true">
      <el-icon>
        <Plus />
      </el-icon>
      添加好友
      <el-dialog v-model="dialogVisible" title="Tips" width="30%" draggable class="friendDialog">
        <span>It's a draggable Dialog</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="dialogVisible = false"
              >Confirm</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
    <div class="searchFriend">
      <el-input
        v-model="friend"
        class="w-50 m-2"
        placeholder="Please Input"
        :suffix-icon="Search"
      />
    </div>
    <div id="list">
      <el-menu
        default-active="2"
        class="listType"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-menu-item index="1">
          <el-icon><Avatar /></el-icon>
          <template #title>好友列表</template>
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon><ChatLineRound /></el-icon>
          <template #title>最近联系</template>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#friendsList {
  .addFriend {
    font-size: 18px;
    font-weight: 600;
    height: 50px;
    border-bottom: $border1;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .friendDialog {
      background-color: red;
    }
  }
  .searchFriend {
    padding: 10px;
  }
  #list {
    .listType {
      .is-active {
        background-color: rgb(235, 235, 235);
      }
      .el-menu-item {
        color: rgb(54, 54, 54);
        margin: 5px;
        border-radius: 6px;
        font-size: $FS2;
        font-weight: 600;
        height: 40px;
      }
      .el-menu-item:hover {
        border: 1px solid;
        background-color: rgb(255, 255, 255);
      }
    }
  }
}
</style>