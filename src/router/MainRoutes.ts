
const MainRoutes = {
    path: '/main',
    meta: {
        requiresAuth: false
    },
    //redirect: '/main',
    component: () => import('../layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'Dashboard',
            path: '/main/dashboard',
            component: () => import('../views/dashboard/dashboard.vue')
        },
        {
            name: 'Typography',
            path: '/main/ui/typography',
            component: () => import('../views/components/Typography.vue')
        },
        {
            name: 'AccountManage',
            path: '/main/ui/accountmanage',
            component: () => import('../views/dashboard/accountmanage.vue')
        }
    ]
};

export default MainRoutes;

