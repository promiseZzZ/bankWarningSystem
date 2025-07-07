import { type RouteRecordRaw } from "vue-router";

//动态路由配置（需要权限）
export const dynamicRoutes: RouteRecordRaw[] = [
    {
        path: '/main',
        component: () => import('../layouts/full/FullLayout.vue'),
        meta: {
            requiresAuth: true
        },
        children: [
            {
                name: 'PerformanceMonitoring',
                path: '/main/performanceMonitoring',
                component: () => import('../views/dashboard/PerformanceMonitoring.vue'),
                meta: {
                    roles: [1, 2]
                }
            },
            {
                name: 'PerformanceAnalysis',
                path: '/main/performanceAnalysis',
                component: () => import('../views/dashboard/PerformanceAnalysis.vue'),
                meta: {
                    roles: [1, 2]
                }
            },
            {
                name: 'AlarmRecord',
                path: '/main/alarmRecord',
                component: () => import('../views/dashboard/AlarmRecord.vue'),
                meta: {
                    roles: [1, 2]
                }
            },
            {
                name: 'OfflineAnalysis',
                path: '/main/offlineAnalysis',
                component: () => import('../views/dashboard/OfflineAnalysis.vue'),
                meta: {
                    roles: [1, 2]
                }
            },
            {
                name: 'RealTimeAnalysis',
                path: '/main/realTimeAnalysis',
                component: () => import('../views/dashboard/RealTimeAnalysis.vue'),
                meta: {
                    roles: [1, 2]
                }
            },
            {
                name: 'AccountManage',
                path: '/main/accountManage',
                component: () => import('../views/dashboard/AccountManage.vue'),
                meta: {
                    roles: [2]
                }
            },
            {
                name: 'NodeManage',
                path: '/main/nodeManage',
                component: () => import('../views/dashboard/NodeManage.vue'),
                meta: {
                    roles: [2]
                }
            }
        ]

    }
]