const AuthRoutes = {
    path: '/auth',
    component: () => import('../layouts/blank/BlankLayout.vue'),
    meta: {
        requiresAuth: false
    },
    children: [
        {
            name: 'Login',
            path: '/auth/login',
            component: () => import('../views/auth/Login.vue')
        },
        {
            name: 'Register',
            path: '/auth/register',
            component: () => import('../views/auth/Register.vue')
        },
        {
            name: 'ChangePassword',
            path: '/auth/changepassword',
            component: () => import('../views/auth/PasswordChange.vue')
        },
    ]
};

export default AuthRoutes;
