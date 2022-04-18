<script setup>
</script>

<template>
  <div id="settingMenu">
    <el-menu default-active="1" @open="handleOpen" @close="handleClose">
      <el-menu-item index="1" class="settingAsideOption">
        <el-icon class="settingAsideOptionIcon"><User-filled /></el-icon>
        <span>个人信息</span>
      </el-menu-item>
      <el-menu-item index="2" class="settingAsideOption">
        <el-icon class="settingAsideOptionIcon"><Hide /></el-icon>
        <span>修改密码</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
#settingMenu {
  .el-menu {
    --el-menu-item-height: 50px;
    .el-menu-item {
      &:hover {
        background: none;
      }
    }
  }
}
</style>>