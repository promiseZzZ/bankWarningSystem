<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store/user';
import { axiosInstance } from '../../utils/request';

const jobnumber = ref('');
const password = ref('');
const captcha = ref('');
const form = ref();
const router = useRouter();
const checkbox = ref(true);
const userStore = useUserStore();

// 验证规则
const jobnumberRules = [
  (v: string) => !!v || '工号不能为空',
];

const passwordRules = [
  (v: string) => !!v || '密码不能为空',
];

const captchaRules = [
  (v: string) => !!v || '验证码不能为空'
];

async function signin() {
  const { valid } = await form.value.validate();
  if (valid) {
    try {
      const response = await axiosInstance.post('/auth/login', {
        jobnumber: jobnumber.value,
        password: password.value,
        captcha: captcha.value
      });

      // 存储token到localStorage
      userStore.setToken(response.data.token);
      
      // 如果勾选记住我，存储用户名（不建议存储密码）
      if (checkbox.value) {
        localStorage.setItem('rememberedUser', jobnumber.value);
      } else {
        localStorage.removeItem('rememberedUser');
      }
      router.push({ path: '/main/dashboard' });
      
    } catch (error: any) {
      // 细化错误处理
      if (error.response) {
        switch (error.response.status) {
          case 401:
            alert('工号不存在或密码错误');
            break;
          case 500:
            alert('服务器错误，请稍后再试');
            break;
          default:
            alert('登录失败: ' + error.response.data);
        }
      } else {
        alert('网络错误，请检查连接');
      }
    }
  }
}

function refreshCaptcha() {
  const captcha = document.getElementById('captcha') as HTMLImageElement;
  captcha.src = '/captcha?t=' + new Date().getTime();
}
</script>

<template>
  <v-form ref="form" @submit.prevent>
    <v-row class="d-flex mb-4">

      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">工号</v-label>
        <v-text-field
          placeholder="请输入工号"
          v-model="jobnumber"
          :rules="jobnumberRules"
          variant="outlined"
          color="primary"
          validate-on-blur
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">密码</v-label>
        <v-text-field
          placeholder="请输入密码"
          v-model="password"
          :rules="passwordRules"
          variant="outlined"
          type="password"
          color="primary"
          validate-on-blur
        ></v-text-field>
      </v-col>

      <v-col cols="11">
        <v-label class="font-weight-bold mb-1">验证码</v-label>
        <div class="d-flex align-center gap-2">
        <v-text-field
          placeholder="请输入验证码"
          v-model="captcha"
          :rules="captchaRules"
          variant="outlined" 
          color="primary"
          validate-on-blur
        ></v-text-field>
        <a href="#" @click="refreshCaptcha()" return false>
          <v-img src=""  id="captcha" width="200" height="50"></v-img>
        </a>
        </div>
      </v-col>

      <v-col cols="12" class="pt-0">
        <div class="d-flex flex-wrap align-center ml-n2">
          <v-checkbox v-model="checkbox" color="primary" hide-details>
            <template v-slot:label>
              <span class="text-body-1">记住密码？</span>
            </template>
          </v-checkbox>
          <div class="ml-sm-auto">
            <RouterLink to="/auth/changepassword" class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium">忘记密码？</RouterLink>
          </div>
        </div>
      </v-col>
      
      <v-col cols="12" class="pt-0">
        <v-btn color="primary" type="button" @click="signin" size="large" block flat>登录</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>