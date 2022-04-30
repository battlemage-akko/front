<script setup>

import { Search } from "@element-plus/icons-vue";
import { ref, defineProps, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import searchForm from "@/components/chat/components/private/components/searchForm.vue";

const dialogVisible = ref(false);
const store = useStore();
const router = useRouter();
const props = defineProps({
  AllMyFriends: {
    type: Array,
  },
  getAllMyFriends: {
    type: Function,
  },
});
const connect = (id) => {
  router.push({
    path: "privateChat",
  });
};
</script>

<template>
  <div id="friendsList">
    <div class="addFriend" @click="dialogVisible = true">
      <el-icon>
        <Plus />
      </el-icon>
      添加好友
      <el-dialog
        draggable
        v-model="dialogVisible"
        title="添加好友"
        width="30%"
        class="friendDialog"
      >
        <searchForm :getAllMyFriends="getAllMyFriends" />
        <template #footer> </template>
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
        class="listType"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose"
        router
        :defaultOpeneds="this.$route.params.id?'1':''"
      >
        <el-sub-menu :show-timeout="0" :hide-timeout="0" class="friendList" index="1">
          <template #title>
            <el-icon><Avatar /></el-icon>
            <span>好友列表</span>
          </template>
          <el-menu-item
            v-for="(item,key,index) in AllMyFriends"
            :key="item.id"
            :route="{ name: 'privateChat', params: { id: item.id } }"
            :index="item.id"
            :class="item.id == this.$store.state.friend.id?'friendCard is-active':'friendCard'"
          >
            <div class="eachFriend">
              <span class="friendAvatar">
                <img :src="item.avatar" alt="" />
              </span>
              <span>
                <div class="friendName">
                  {{ item.username }}
                </div>
              </span>
            </div>
          </el-menu-item>
        </el-sub-menu>
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

    .el-dialog {
      border-radius: 5px;
      box-shadow: $shadow;
      min-width: 400px;
    }
  }
  .searchFriend {
    padding: 10px;
  }
  #list {
    .listType {
      border-right: none;
      .friendList {
        .friendCard {
          height: 60px;
          padding: 0px 10px !important;
          border-radius: 100px;
          margin: 10px;
          .eachFriend {
            display: flex;
            align-items: center;
            .friendAvatar {
              display: flex;
              align-items: center;
              img {
                height: 45px;
                width: 45px;
                border-radius: 50px;
              }
            }
            .friendName {
              font-weight: 500 !important;
              margin-left: 10px;
              font-size: 17px;
              font-weight: 500;
            }
          }
        }
        .is-active{
          background-image: linear-gradient(to left, rgba(255,0,0,0), #dddddd);
        }
      }

      // .el-menu-item {
      //   color: rgb(54, 54, 54);
      //   margin: 5px;
      //   border-radius: 6px;
      //   font-size: $FS2;
      //   font-weight: 600;
      //   height: 40px;
      // }
      // .el-menu-item:hover {
      //   border: 1px solid;
      //   background-color: rgb(255, 255, 255);
      // }
    }
  }
}
</style>