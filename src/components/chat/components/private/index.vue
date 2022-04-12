<script setup>
import firendsList from "@/components/chat/components/private/components/list.vue";
import { getAllFriends } from "@/api/auth";
import { onMounted, ref, computed } from "vue";
import { useRouter } from 'vue-router';
const router = useRouter();
onMounted(() => {
  getAllMyFriends();
});

const id = computed(() => {
  return router.currentRoute.value.params.id;
});

const AllMyFriends = ref([]);

const LoadingList = ref(true);

const gettest = () => {
  console.log('test')
}

const getAllMyFriends = () => {
  getAllFriends({}).then((res) => {
    AllMyFriends.value = res.result;
    LoadingList.value = false;
  });
};
</script>
<template>
  <div id="app-main">
    <el-container style="height: 100%">
      <el-aside width="200px" class="main-aside">
        <firendsList :AllMyFriends="AllMyFriends" v-loading="LoadingList" :getAllMyFriends="getAllMyFriends"/>
      </el-aside>
      <el-main class="main-container">
        <router-view :key="id"></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scope>
#app-main {
  width: 100%;
  height: 100%;
  position: relative;
  .main-aside {
    height: 100%;
    width: 250px;
    border-right: $border2;
  }
  .main-container {
    height: 100%;
    padding: 0px
  }
}
</style>