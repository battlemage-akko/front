<script setup>
import { ref, defineProps, onMounted } from "vue";
import profile from "./components/profile.vue";
import settingMenu from "./components/list.vue";
const props = defineProps({
  openSetting: {
    type: Boolean,
  },
  closeSetting: {
    type: Function,
  },
});
const closeSetting = () => {};
</script>

<template>
  <div id="setting">
    <el-dialog
      v-model="openSetting"
      class="settingContainer"
      title="Setting"
      draggable
      :modal="false"
      @close="props.closeSetting"
      :close-on-click-modal="false"
    >
      <el-container>
        <el-aside class="settingAside">
          <settingMenu />
        </el-aside>
        <el-main class="settingMain">
          <router-view/>
        </el-main>
      </el-container>
      <!-- <template #footer>
        <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >Confirm</el-button
        >
      </span>
      </template> -->
    </el-dialog>
  </div>
</template>

<style lang="scss" scope>
#setting {
  .el-dialog {
    box-shadow: $shadow;
    width: 70%;
    min-width: 700px;
  }
  .el-dialog {
    border-radius: 10px;
    .el-dialog__header {
      font-weight: 550;
      padding: 15px;

    }
    .el-dialog__body {
      padding: 0px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      .el-container {
        min-height: 500px;
      }
      .settingAside {
        width: 170px;
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        .settingAsideOption {
          padding: 0px !important;
          .settingAsideOptionIcon {
            height: 50px;
            width: 50px;
          }
        }
      }
    }
    .el-dialog__footer {
      padding: 0px;
    }
  }
}
</style>