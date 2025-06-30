import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import { useUserStore } from '../store/user';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/:pathMatch(.*)*',
            component: () => import('../views/auth/Login.vue')
        },
        MainRoutes,
        AuthRoutes
    ]
});

// 添加登陆访问拦截
// 添加路由守卫
router.beforeEach((to) => {
    const userStore = useUserStore();
    
    // 定义允许匿名访问的路由路径
    const AllowedPaths = [
      '/auth/login',
      '/auth/register',
      '/auth/changepassword'
    ];
  
    // 当用户没有 token 且访问的不是白名单路径时，重定向到登录页
    if (!userStore.token && !AllowedPaths.includes(to.path)) {
      return '/auth/login';
    }
  
    // 其他情况正常放行
    return true;
  });


