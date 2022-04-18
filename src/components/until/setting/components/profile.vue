<script setup>

</script>

<template>
    <div id="profileCard">
        <div class="profileCardTop">
            <img :src="this.$store.state.userInfo.avatar" alt="">
        </div>
        <div class="profileCardBottom"></div>
    </div>
</template>

<style lang="scss" scope>
$border:10px;
#profileCard{
    width:100%;
    height:100%;
    box-shadow: $shadow3;
    .profileCardTop{
        background-color:#8785A2;
        height:25%;
        border-radius: $border $border 0px 0px;
        img {
            height:100%;
            border-radius:100%;
            border: 10px solid #F6F6F6;
            transform: translate(20%,20%);
        }
    }
    .profileCardBottom{
        background-color:#F6F6F6;
        height:75%;
        border-radius:0px 0px $border $border ;
    }
}
</style>