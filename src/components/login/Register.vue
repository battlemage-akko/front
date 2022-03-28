<script setup>
import { ref, reactive, computed } from "vue";
import { signUp, getCode } from "@/api/auth";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const registerForm = reactive({
  password: "",
  username: "",
  passwordAgain: "",
  phone: "",
  code: "",
});

const timer = reactive({
  count: 0,
  cd: false,
})

const registerFormRef = ref();
const checkMobile = (rule, value, callback) => {
  const regMobile =
    /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
  if (regMobile.test(value)) {
    return callback();
  }
  callback(new Error("请输入合法的手机号"));
};
const registerRules = ref({
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  password: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    {
      min: 6,
      max: 16,
      message: "密码不能少于6位，不能多于16位",
      trigger: "blur",
    },
  ],
  passwordAgain: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    {
      min: 6,
      max: 16,
      message: "密码不能少于6位，不能多于16位",
      trigger: "blur",
    },
  ],
  code: [{ required: true, message: "验证码不能为空", trigger: "blur" }],
  phone: [
    { required: true, message: "手机号码不能为空", trigger: "blur" },
    { min: 11, message: "手机号格式不正确", trigger: "blur" },
    { validator: checkMobile, trigger: "blur" },
  ],
});

const router = useRouter();

const passwdChange = computed(() => {
  if (password !== passwordAgain) {
    console.log("两次密码不一致");
    return "密码不一致";
  }
});

const validatePass = (rule, value, callback) => {
  //  密码只能由大小写英文字母或数字开头，且由大小写英文字母_.组成
  const reg = /^[A-Za-z0-9][A-Za-z0-9_.]{5,14}$/;
  console.log("reg", value.match(reg));
  if (!value.match(reg)) {
    callback(
      new Error("密码由字母或数字开头，且只能为字母,数字,下划线及（.）")
    );
  } else {
    callback();
  }
};

const registerMode = false;

const coolDown = () => {
  timer.cd = !timer.cd;
  timer.count = 60;
  const timerCon = setInterval(()=>{
    if(timer.count > 0){
      timer.count --;
    }
    else{
      timer.cd = !timer.cd;
      clearInterval(timerCon);
    }
  },1000)
};

const getCodeF = () => {
  if (registerForm.phone) {
    getCode({
      password: registerForm.password,
      username: registerForm.username,
      passwordAgain: registerForm.passwordAgain,
      code: registerForm.code,
      phone: registerForm.phone,
    }).then((res) => {
      if (res.status === 1) {
        ElMessage({
          message: res.content,
          type: "success",
        });
        coolDown();
      } else if (res.status != 1) {
        ElMessage({
          message: res.content,
          type: "error",
        });
        coolDown();
      }
    });
  } else {
    ElMessage({
      message: "手机号不能为空(front)",
      type: "error",
    });
  }
};
const signUpThisUser = () => {
  registerFormRef.value.validate((valid) => {
    if (valid) {
      signUp({
        password: registerForm.password,
        username: registerForm.username,
        passwordAgain: registerForm.passwordAgain,
        code: registerForm.code,
        phone: registerForm.phone,
      }).then((res) => {
        if (res.status === 1) {
          ElMessage({
            message: "注册成功",
            type: "success",
          });
          router.push({
            path: "login",
          });
        }
        if (res.status !== 1) {
          ElMessage({
            message: res.content,
            type: "error",
          });
        }
      });
    } else {
      console.log("error submit");
      return;
    }
  });
};
</script>

<template>
  <el-main class="lgMain">
    <el-form
      :hide-required-asterisk="true"
      @submit.enter.prevent
      :rules="registerRules"
      status-icon
      label-width="120px"
      class="demo-ruleForm formData"
      label-position="top"
      :model="registerForm"
      ref="registerFormRef"
    >
      <el-form-item prop="username">
        <span slot="label" class="title">
          用户名
          <el-icon style="margin-left: 10px">
            <Avatar />
          </el-icon>
        </span>
        <el-input placeholder="请输入用户名" v-model="registerForm.username" />
      </el-form-item>
      <el-form-item prop="password">
        <span slot="label" class="title">
          密码
          <el-icon style="margin-left: 10px">
            <View />
          </el-icon>
        </span>
        <el-input
          type="password"
          autocomplete="off"
          placeholder="请输入密码"
          v-model.lazy="registerForm.password"
        />
      </el-form-item>
      <el-form-item prop="passwordAgain">
        <span slot="label" class="title">
          请确认密码
          <el-icon style="margin-left: 10px">
            <View />
          </el-icon>
        </span>
        <el-input
          type="password"
          autocomplete="off"
          placeholder="请再次输入密码"
          v-model.lazy="registerForm.passwordAgain"
        />
      </el-form-item>
      <el-form-item prop="phone">
        <span slot="label" class="title">
          手机号
          <el-icon style="margin-left: 10px">
            <Iphone />
          </el-icon>
        </span>
        <el-input
          type="text"
          autocomplete="off"
          placeholder="请输入手机号"
          v-model.lazy="registerForm.phone"
        />
      </el-form-item>
      <el-form-item prop="code">
        <span slot="label" class="title">
          验证码
          <el-icon style="margin-left: 10px">
            <Postcard />
          </el-icon>
        </span>
        <el-input placeholder="请输入验证码" v-model="registerForm.code">
          <template #append>
            <el-button @click="getCodeF" :disabled="timer.cd">
              <span v-show="!timer.cd">获取验证码</span>
              <span v-show="timer.cd">请在{{timer.count}}秒后重试</span>
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="lgButtons">
        <el-button type="primary" @click="signUpThisUser" native-type="submit"
          >注册</el-button
        >
        <router-link to="/login" style="margin-left: 30px">
          <el-button to="/login" plain>已有账号？</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<style lang="scss" scope>
:deep(.el-form-item.is-required:not(.is-no-asterisk)
    > .el-form-item__label:before) {
  content: " ";
  width: 0px;
  margin-right: 0px;
}
.title {
  display: flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.438);
}
.formData {
  width: 100%;
}
.lgButtons {
  margin-top: 40px;
  .el-form-item__content {
    display: flex;
    justify-content: center;
  }
}
</style>