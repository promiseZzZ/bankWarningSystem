<template>
  <div class="d-flex align-center">
    <!-- 修改后的用户名显示 -->
    <span class="mr-2 username-text">Hello, {{ userStore.username }}</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '../../../store/user';

const userStore = useUserStore();

// 在组件挂载时获取用户名
onMounted(() => {
  userStore.getUser()
});
</script>

<style scoped>
.username-text {
  color: rgba(0,50,50,50);  /* 黑色 */
  font-size: 1.5rem;  /* 调大字体 */
  font-weight: 500;  
  margin-left: 8px;  /* 添加左边距 */
}
</style>