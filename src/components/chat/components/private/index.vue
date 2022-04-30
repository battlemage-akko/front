<script setup>
import firendsList from "@/components/chat/components/private/components/list.vue";
import { getAllFriends } from "@/api/auth";
import { onMounted, ref, computed, watch, reactive, onBeforeMount} from "vue";
import { useRouter } from 'vue-router';
import { useStore } from "vuex";
const store = useStore();
const router = useRouter();
onMounted(() => {
  getAllMyFriends();
});
const state = reactive({
  friendId: computed(() => {
    return store.state.friend.id;
  }),
});
watch(
  ()=>state.friendId,
  (newValue, oldValue) => {
    AllMyFriends[newValue]['now'] = true
    if (oldValue){
      AllMyFriends[oldValue]['now'] = false
    }
  }
);
const id = computed(() => {
  return router.currentRoute.value.params.id;
});

const AllMyFriends = reactive({});
const LoadingList = ref(true);

const gettest = () => {
  console.log('test')
}

const getAllMyFriends = () => {
  getAllFriends().then((res) => {
    for(let i of res.result){
      i.now = false
      AllMyFriends[i.id] = i 
    }
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
        <router-view :key="id" v-if="!LoadingList"></router-view>
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