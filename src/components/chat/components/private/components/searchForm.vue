<script setup>
import { reactive, ref } from "vue";
import { searchUser, addFriend } from "@/api/auth.js";
import { ElMessage } from "element-plus";
const searchForm = reactive({
  username: "",
});
const props = defineProps({
  getAllMyFriends: {
    type: Function,
  },
});
const loading = ref(false);
const searchFormRef = ref();
const searchResult = reactive([]);
const nothing = ref(false);
const addThisUser = (e,user_id, friend_id) => {
  addFriend({
    user_id: user_id,
    friend_id: friend_id,
  }).then((res) => {
    ElMessage.success(res.message);
    props.getAllMyFriends()
    for(let i of searchResult.value){
      if(i.id === res.friendId){
        i.loading = false
        i.friend = res.status
      }
    }
  });
};
const searchUserF = () => {
  loading.value = true;
  nothing.value = false;
  searchResult.value = [];
  searchUser({
    username: searchForm.username,
  }).then((res) => {
    if (res.status === 1) {
      searchResult.value = res.result;
      if (res.result.length === 0) {
        nothing.value = true;
      }
      else{
        for(let i of searchResult.value){
          i.loading = false
        }
      }
    } else {
      searchResult.value = [];
      nothing.value = true;
    }
    loading.value = false;
  });
};
</script>

<template>
  <el-form @submit.enter.prevent :model="searchForm" ref="searchFormRef">
    <el-form-item prop="username">
      <el-input
        class="searchFriend-input"
        v-model="searchForm.username"
        @change="searchUserF"
      />
    </el-form-item>
  </el-form>
  <div class="searchResult" v-loading="loading">
    <div v-for="item in searchResult.value" :key="item.id">
      <div class="card" v-loading="item.loading">
        <img :src="item.avatar" alt="" />
        <span>{{ item.username }}</span>
        <el-button
          :type="item.friend === 0 ? 'primary' : 'danger'"
          @click="addThisUser($event,this.$store.state.userInfo.id, item.id);item.loading = true;" 
          :disable="false"
        >
          <span v-show="item.friend === 0">+ 好友</span>
          <span v-show="item.friend === 1">删好友</span>
        </el-button>
      </div>
    </div>
    <div class="noSearchResult" v-show="nothing">没有找到任何结果！</div>
  </div>
</template>

<style lang="scss" scope>
.searchFriend-input {
  border: none;
  input {
    &:focus {
      border: none;
    }
  }
}
.searchResult {
  min-height: 100px;
  display: flex;
  .card {
    width: 100px;
    height: 130px;
    border-radius: 10px;
    box-shadow: $shadow2;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: column;
    padding: 10px 0px;
    margin: 0px 10px;
    img {
      width: 60px;
      height: 60px;
      border-radius: 60px;
    }
  }
  .noSearchResult {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
}
</style>

