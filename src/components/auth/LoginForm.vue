<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store/user';
import { axiosInstance } from '../../utils/request';
import { addDynamicRoutes, filterRoutesByRole } from '../../router/index';
import { dynamicRoutes } from '../../router/DynamicRoutes';

const code = ref('');
const password = ref('');
const captcha = ref('');
const form = ref();
const router = useRouter();
const checkbox = ref(true);
const userStore = useUserStore();
const captchaKey = ref('');

// 验证规则
const codeRules = [
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
        code: code.value,
        password: password.value,
        //captcha: captcha.value,
        //captchaKey: captchaKey.value
      });
      if(response.data.status === 0){

        // 存储token到localStorage
        userStore.setToken(response.data.data.token);

        //存储role到LocalStorage
        userStore.setRole(response.data.code);

        await nextTick();

        // 根据role添加动态路由
        const filteredRoutes = filterRoutesByRole(dynamicRoutes, response.data.code);
        addDynamicRoutes(filteredRoutes);

        userStore.setUser(response.data.userName);
        // 如果勾选记住我，存储用户名和密码
        if (checkbox.value) {
          localStorage.setItem('rememberedUser', code.value);
          localStorage.setItem('rememberedPassword', password.value);
          console.log('记住密码', code.value, password.value)
        } else {
          localStorage.removeItem('rememberedUser');
          localStorage.removeItem('rememberedPassword');
        }

        router.push('/main/performanceMonitoring');
      } else {
        // 处理业务错误
        const errorMessage = response.data.message || '登录失败';
        
        // 根据状态码细化错误提示
        if (response.data.status === 5) {
          if (errorMessage.includes("工号或密码错误")) {
            alert('工号或密码错误');
          } else if (errorMessage.includes("没有权限")) {
            alert('您的账号没有权限，请联系管理员审批');
          } else {
            alert(errorMessage);
          }
        }
      }

    } catch (error: any) {
      // 细化错误处理
      if (error.response) {
        switch (error.response.status) {
          case 403:
            alert('访问被拒绝，无权限');
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

async function refreshCaptcha() {
  try {
    const response = await axiosInstance.get('/auth/captcha');
    const captchaImg = document.getElementById('captcha') as HTMLImageElement;
    if (captchaImg && response.headers) {
      captchaImg.src = '/auth/captcha?' + new Date().getTime();
      captchaKey.value = response.headers.captchaKey;
    }
  } catch (error) {
    console.error('获取验证码失败:', error);
  }
}

// 页面加载时自动刷新一次验证码
//refreshCaptcha();

</script>

<template>
  <v-form ref="form" @submit.prevent>
    <v-row class="d-flex mb-4">

      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">工号</v-label>
        <v-text-field
          placeholder="请输入工号"
          v-model="code"
          :rules="codeRules"
          variant="outlined"
          color="primary"
          validate-on-blur
          autocomplete="jobNumber"
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
          autocomplete="password"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
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
         <!-- <img src="/auth/captcha"  id="captcha" alt="验证码"> -->
        </a>
        </div>
      </v-col>

      <v-col cols="12" class="pt-0">
        <div class="d-flex flex-wrap align-center ml-n2">
          <v-checkbox v-model="checkbox" color="primary" hide-details :value="false">
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