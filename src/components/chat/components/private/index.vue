<script setup>
import firendsList from '@/components/chat/components/private/components/list.vue';
import { getAllFriends } from '@/api/auth';
import { onMounted,ref } from 'vue';

onMounted(()=> {
  getAllMyFriends()
})

const AllMyFriends = ref([])

const LoadingList = ref(true)

const getAllMyFriends = () => {
  getAllFriends({}).then(res => {
    AllMyFriends.value = res.result
    LoadingList.value = false
  })
}
</script>
<template>
  <div id="app-main">
    <el-container style="height:100%">
      <el-aside width="200px" class="main-aside">
        <firendsList :AllMyFriends="AllMyFriends" v-loading="LoadingList"/>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
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