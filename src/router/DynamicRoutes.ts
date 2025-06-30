import { type RouteRecordRaw } from "vue-router";

//动态路由配置（需要权限）
export const dynamicRoutes: RouteRecordRaw[] = [
    {
        path: '/main',
        component: () => import('../views/main/Dashboard.vue'),
        meta: {
            requiresAuth: true
        },
        children: [
            {
                name: 'Main',
                path: '/main/main',
                component: () => import('../views/main/main.vue'),
                meta: {
                    roles: ['2', '0']
                }
            },
            {
                name: 'accountManage',
                path: '/main/accountmanage',
                component: () => import('../views/main/accountmanage.vue'),
                meta: {
                    roles: ['2']
                }
            }
        ]

    }
]