<script setup>
import {onBeforeMount} from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from "vuex";
const store = useStore();
const router = useRouter();
onBeforeMount(() => {
  store.commit('saveFriend',{id:null,name:null})
})
</script>
<template>
  <div id="groupsContainer">
      <el-container style="height: 100%">
      <el-aside width="200px" class="main-aside">

      </el-aside>
      <el-main style="padding: 0px">

      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scope>
#groupsContainer {
  width: 100%;
  height: 100%;
  position: relative;
  .main-aside {
    height: 100%;
    width: 250px;
    border-right: $border2;
  }
}
</style>