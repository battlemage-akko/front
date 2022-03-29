<script setup>

</script>
<template>
  <div id="login-app" class="app">
    <el-container style="height: 100%">
      <el-header class="lgHeader">
        <img src="" alt="" />
        <span></span>
      </el-header>
      <el-main class="lgMain">
        <div class="lgHolder">
          <div class="lgLogo">
            <img src="https://cdn.lili-secretbase.com/pic/logo.png" alt="" />
          </div>
          <router-view v-slot="{ Component, route }">
            <transition name="fade" mode="out-in">
              <keep-alive>
                <component :is="Component" :key="route.path" />
              </keep-alive>
            </transition>
          </router-view>
        </div>
      </el-main>
      <el-footer class="lgFooter"></el-footer>
    </el-container>
  </div>
</template>

<style lang="scss" scope>
#login-app {
  background: url(https://cdn.lili-secretbase.com/pic/background/bg.svg) no-repeat 0px 0px;
  background-size:cover;
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.4s ease;
  }

  .lgMain {
    .lgHolder {
      box-shadow: $shadow;
      min-width: 400px;
      .lgLogo {
        display: flex;
        justify-content: center;
        margin-top: 5px;
        img {
          height: 60px;
        }
      }
      border: 1px solid rgba(0, 0, 0, 0.1);
      background-color:rgba(255, 255, 255, 0.8);
      border-radius: 6px;
      padding: 20px;
    }
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .lgFooter {
    height: 30px;
    background-color: rgba(255, 255, 255, 0.60);
  }
  .el-form-item {
    height: 62px;
  }
}
</style>