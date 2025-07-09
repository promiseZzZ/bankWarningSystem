<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { axiosInstance } from '../../utils/request';

const router = useRouter();
const form = ref();
const code = ref('');
const userName = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// 增强验证规则
const codeRules = [
  (v: string) => !!v || '工号不能为空',
  (v: string) => /^[a-zA-Z0-9_]+$/.test(v) || '只能包含字母、数字和下划线'
];

const userNameRules = [
  (v: string) => !!v || '用户名不能为空',
  (v: string) => /^[\u4e00-\u9fa5]+$/.test(v) || '用户名只能包含汉字',

];

const passwordRules = [
  (v: string) => !!v || '密码不能为空',
  (v: string) => v.length >= 6 || '至少6个字符',
  (v: string) => /[A-Z]/.test(v) || '必须包含大写字母',
  (v: string) => /\d/.test(v) || '必须包含数字'
];

const confirmPasswordRules = [
  (v: string) => !!v || '请确认密码',
  (v: string) => v === password.value || '密码不一致',
];


async function signup() {
  const { valid } = await form.value.validate();
  
  if (valid) {
    loading.value = true;
    try {
        const response = await axiosInstance.post('/user/register', {
        code: code.value, 
        userName: userName.value,
        password: password.value
      });

      if(response.data.status === 0){
        alert('注册成功,将跳转登录页');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } else {
      if(response.data.status === 2){
        alert(response.data.message);
      }
    }
    } catch (error: any) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage.value = '无效的请求参数';
            break;
          case 500:
            errorMessage.value = '服务器错误，请稍后再试';
            break;
          default:
            errorMessage.value = `注册失败: ${error.response.data}`;
        }
      } else {
        errorMessage.value = '网络连接失败，请检查网络设置';
      }
    } finally {
      loading.value = false;
    }
  }
}
</script>

<template>
  <v-form ref="form" @submit.prevent>
    <v-row class="d-flex mb-3">
      <!-- 成功提示 -->
      <v-col cols="12" v-if="successMessage">
        <v-alert type="success" density="compact">
          {{ successMessage }}
        </v-alert>
      </v-col>

      <!-- 错误提示 -->
      <v-col cols="12" v-if="errorMessage">
        <v-alert type="error" density="compact">
          {{ errorMessage }}
        </v-alert>
      </v-col>

      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">用户名</v-label>
        <v-text-field
          v-model="userName"
          :rules="userNameRules"
          variant="outlined"
          color="primary"
          validate-on-blur
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">工号</v-label>
        <v-text-field
          v-model="code"
          :rules="codeRules"
          variant="outlined"
          color="primary"
          :disabled="loading"
        ></v-text-field>
      </v-col>
      
      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">密码</v-label>
        <v-text-field
          v-model="password"
          :rules="passwordRules"
          variant="outlined"
          type="password"
          color="primary"
          :disabled="loading"
        ></v-text-field>
      </v-col>
      
      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">确认密码</v-label>
        <v-text-field
          v-model="confirmPassword"
          :rules="confirmPasswordRules"
          variant="outlined"
          type="password"
          color="primary"
          :disabled="loading"
        ></v-text-field>
      </v-col>
      
      <v-col cols="12">
        <v-btn
          color="primary"
          @click="signup"
          size="large"
          block
          :loading="loading"
          :disabled="loading"
        >
          {{ loading ? '注册中...' : '立即注册' }}
        </v-btn>
      </v-col>

      <v-col cols="12" class="text-center mt-4">
        <router-link 
          to="/auth/login" 
          class="text-primary text-decoration-none"
        >
          已有账号？立即登录
        </router-link>
      </v-col>
    </v-row>
  </v-form>
</template>