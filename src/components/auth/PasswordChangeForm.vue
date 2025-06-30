<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { axiosInstance } from '../../utils/request';

const router = useRouter();
const form = ref();
const jobnumber = ref('');
const newpassword = ref('');
const confirmNewPassword = ref('');
const loading = ref(false); 
const errorMessage = ref(''); 
const successMessage = ref(''); 

// 验证规则
const jobnumberRules = [
  (v: string) => !!v || '工号不能为空',
];

const passwordRules = [
  (v: string) => !!v || '新密码不能为空',
];

const confirmPasswordRules = [
  (v: string) => !!v || '请确认新密码',
  (v: string) => v === newpassword.value || '密码不一致',
];

async function changepassword() {
  errorMessage.value = '';
  successMessage.value = '';
  const { valid } = await form.value.validate();
  
  if (valid) {
    loading.value = true;
    try {
        await axiosInstance.put('/user/update', {
        jobnumber: jobnumber.value, // 字段名需与后端实体类一致
        password: newpassword.value
      });

      // 显示成功提示
      successMessage.value = '密码修改成功';
      
      // 清除本地token（如果需要）
      localStorage.removeItem('authToken');
      
      // 2秒后跳转登录页
      setTimeout(() => {
        router.push({ path: '/auth/login' });
      }, 3000);

    } catch (error: any) {
      if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage.value = '工号不存在';
            break;
          case 500:
            errorMessage.value = '服务器错误，请稍后重试';
            break;
          default:
            errorMessage.value = `修改失败: ${error.response.data}`;
        }
      } else {
        errorMessage.value = '网络连接异常，请检查网络';
      }
    } finally {
      loading.value = false;
    }
  }
}

function back(){
  router.push({ path: '/auth/login' })
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
        <v-label class="font-weight-bold mb-1">工号</v-label>
        <v-text-field 
          v-model="jobnumber"
          :rules="jobnumberRules"
          variant="outlined"
          color="primary"
          required
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">新密码</v-label>
        <v-text-field 
          v-model="newpassword"
          :rules="passwordRules"
          variant="outlined"
          type="password" 
          color="primary"
          required
        ></v-text-field>
      </v-col>
      
      <v-col cols="12">
        <v-label class="font-weight-bold mb-1">确认新密码</v-label>
        <v-text-field 
          v-model="confirmNewPassword"
          :rules="confirmPasswordRules"
          variant="outlined"
          type="password" 
          color="primary"
          required
        ></v-text-field>
      </v-col>
      
      <v-col cols="6">
        <v-btn 
          color="primary" 
          @click="changepassword()" 
          size="large" 
          block  
          flat
          type="button"
        >保存密码</v-btn>
      </v-col>

      <v-col cols="6">
        <v-btn
          color="primary" 
          @click="back()" 
          size="large" 
          block  
          flat
          type="button"
        >返回</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>