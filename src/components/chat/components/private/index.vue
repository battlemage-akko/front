<script setup>
import firendsList from '@/components/chat/components/private/components/list.vue'
</script>
<template>
  <div id="app-main">
    <el-container style="height:100%">
      <el-aside width="200px" class="main-aside">
        <firendsList/>
      </el-aside>
      <el-container>
        <el-header class="private-header">
            
        </el-header>
        <el-main class="private-body">

        </el-main>
        <el-footer class="private-footer">

        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scope>
    #app-main{
        width: 100%;
        height: 100%;
        position: relative;
        .main-aside {
            height: 100%;
            width:250px;
            border-right: $border2;
        }
        .private-header {
            height: 50px;
            border-bottom: $border2;
        }
        .private-body {
            height: 100%;
            border-bottom: $border2;
        }
        .private-footer {
            height: 80px;
        }
    }
</style>