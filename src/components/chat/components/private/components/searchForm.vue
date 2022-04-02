<script setup>
import { reactive, ref } from "vue";
import { searchUser,addFriend } from "@/api/auth.js";
const searchForm = reactive({
  username: "",
});
const loading = ref(false)
const searchFormRef = ref();
const searchResult = reactive([]);
const nothing = ref(false);
const addThisUser = (user_id,friend_id) => {
  addFriend({
    user_id:user_id,
    friend_id:friend_id
  }).then(res =>{
    console.log(res)
  })
}
const searchUserF = () => {
  loading.value = true
  nothing.value = false
  searchResult.value = []
  searchUser({
    username: searchForm.username,
  }).then((res) => {
    if(res.status === 1){
      searchResult.value = res.result
      if(res.result.length === 0){
        nothing.value = true
      }
    }
    else {
      searchResult.value = []
      nothing.value = true
    }
    loading.value = false
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
    <div v-for="(item) in searchResult.value" :key="item.id">
      <div class="card"> 
          <img :src="item.avatar" alt="">
          <span>{{item.username}}</span>
          <el-button type="primary" @click="addThisUser(this.$store.state.userInfo.id,item.id)" :disable="false">
            <span v-show="item.friend === 0">+ 好友</span>
            <span v-show="item.friend === 1">已添加</span>
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
    margin:0px 10px;
    img{
      width:60px;
      height:60px;
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

