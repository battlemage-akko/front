<script setup>
</script>
<template>
  <div class="defaultContainer">
    <el-container style="height: 100%">
      <el-header class="defaultHeader">
        <el-menu
          :default-active="activeIndex"
          class="defaultHeaderMenu"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="1">
              <span>最近联系</span>
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-main class="defaultBody">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>
<style lang="scss" scoped>
.defaultContainer {
  height: 100%;
  .defaultHeader {
    height: 50px;
    padding: 0px;
    .defaultHeaderMenu{
        height:100%;
        .el-menu-item  {
            line-height:25px;
            box-sizing: content-box;
            border: none;
            span {
                padding: 3px 7px;
                font-size: 15px;
                border-radius: 10px;
            }
            &:hover {
              background-color: white;
            }
            &:focus {
              background-color: white;
            }
        }
        .is-active {
            span {
                background-color:rgb(112, 112, 112);
                color: white;
            }
        }
    }
  }
  .defaultBody {
    height: 100%;
  }
}
</style>