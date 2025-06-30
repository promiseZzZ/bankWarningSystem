<script setup lang="ts">
import Logo from '../../layouts/full/logo/Logo.vue';
import LoginForm from '../../components/auth/LoginForm.vue';
</script>


<template>
    <div class="authentication">
        <div class="background-text">
            <h1 class="text-h2 font-weight-bold">银行监控告警系统</h1>
        </div>
        <v-container fluid class="pa-3">
            <v-row class="h-100vh d-flex justify-end align-center">
                <v-col cols="12" lg="4" xl="3" class="d-flex align-center mr-16">
                    <v-card rounded="md" elevation="10" class="px-sm-1 px-0 withbg mx-auto" max-width="500">
                        <v-card-item class="pa-sm-8">
                            <div class="d-flex justify-center py-4">
                                <Logo />
                            </div>
                            <LoginForm />
                            <h6 class="text-h6 text-muted font-weight-medium d-flex justify-center align-center mt-3">
                                第一次使用？
                                <RouterLink to="/auth/register"
                                    class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium pl-2">
                                    注册一个用户</RouterLink>
                            </h6>
                        </v-card-item>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>


<style>
.authentication {
    position: relative; /* 为文字层定位提供基准 */
    background-image: url('/back_ground.png');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    min-height: 100vh;
}

/* 为提升可读性添加半透明背景层 */
.v-card.withbg {
    background-color: rgba(255, 255, 255, 0.9) !important;
    backdrop-filter: blur(4px);
}

/* 响应式调整 */
@media (max-width: 1264px) {
    .background-text {
        left: 10%;
        max-width: 450px;
    }
}

@media (max-width: 960px) {
    .background-text {
        position: static;
        transform: none;
        text-align: center;
        width: 100%;
        max-width: 100%;
        background: rgba(0, 0, 0, 0.0);
        padding: 1.5rem;
    }
    
    .background-text h1 {
        font-size: 3rem !important;
    }
    
    .background-text p {
        font-size: 1.2rem !important;
    }
}

.background-text {
    position: absolute;
    left: 45%; /* 从50%调整为45%实现左偏 */
    top: 50%;
    transform: translate(-50%, -50%);
    color: white;
    max-width: 600px;
    padding: 2rem;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    text-align: center;
    width: auto; /* 改为自动宽度 */
    margin-left: -300px; /* 额外左移补偿 */
}

</style>
