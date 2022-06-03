<script setup>
import { Search } from "@element-plus/icons-vue";
</script>
<template>
  <div class="recommendationContainer">
      <div class="ad">

      </div>
      <el-input
      v-model="input2"
      class="searchInput"
      placeholder="Please Input"
      :suffix-icon="Search"
    />
  </div>
</template>
<style scoped lang="scss">
::v-deep input::-webkit-input-placeholder {  /* WebKit browsers*/ 
    color: rgba(0, 0, 0, 0.4);
}
.recommendationContainer{
    height:100%;
    weight:100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: url('https://cdn.lili-secretbase.com/pic/background/4850037.jpg') no-repeat fixed;
    background-size: cover;
    .ad {
        height:100px;
        width:100%;
        min-width: 200px;
    }
    .searchInput {
        width:50%;
        min-width: 200px;
        box-shadow: $shadow3;
        border-radius: 15px;
        ::v-deep .el-input__inner {
            height:50px;
            font-size: 17px;
            background-color: rgb(245, 245, 245);
            font-family: "Helvetica Neue";
            box-shadow: none; 
            font-weight: 550;
            border-radius: 15px;
            &:focus{
                
            }
        }
    }
}
</style>