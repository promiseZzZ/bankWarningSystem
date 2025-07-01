<template>
    <v-container fluid class="pa-0 fill-height">
        <!-- 添加渐变背景 -->
        <v-row class="ma-0 fill-height" style="background: #eeeeee" >
            <!-- 调整列宽并添加响应式边距 -->
            <v-col cols="12" lg="5" xl="4" offset-lg="1" offset-xl="2" class="px-4 py-16">
                <!-- 优化卡片阴影和动画效果 -->
                <v-card>
                    <!-- 添加装饰性元素 -->
                    <div class="position-absolute top-0 left-0 right-0">
                        <div class="blur-bg"></div>
                    </div>
                    
                    <!-- 优化内边距 -->
                    <v-card-item class="pa-5 pa-md-8">
                        <!-- 添加标题 -->
                        <div class="text-center mb-6">
                            <h1 class="text-h4 font-weight-bold ">修改密码</h1>
                            <p class="text-medium-emphasis mt-2">请设置新的登录密码</p>
                        </div>

                        <!-- 添加表单容器间距 -->
                        <div class="d-flex flex-column gap-4">
                            <PasswordChangeForm />
                        </div>
                    </v-card-item>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import PasswordChangeForm from '../../components/auth/PasswordChangeForm.vue';
</script>

<style scoped>
/* 添加装饰性背景效果 */
.blur-bg {
    height: 120px;
    background: linear-gradient(45deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
    filter: blur(60px);
    transform: translateY(-30%);
}

/* 优化卡片背景 */
.v-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 响应式调整 */
@media (max-width: 600px) {
    .v-card {
        border-radius: 24px !important;
    }
}

@media (max-width: 1264px) {
    .offset-xl-2 {
        margin-left: auto;
    }
}
</style>