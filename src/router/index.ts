import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import AuthRoutes from './AuthRoutes';
import { useUserStore } from '../store/user';


//静态路由（不需要权限）
const Constantroutes: RouteRecordRaw[] = [
  AuthRoutes,
]

//创建路由实例（只包含静态路由）
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: Constantroutes
})

//存储动态路由是否为已添加的状态
let isAddDynamicRoutes = false;

//动态添加路由的方法
export function addDynamicRoutes(routesToAdd: RouteRecordRaw[]) {
  if (isAddDynamicRoutes) return;
  const currentRoutes = router.getRoutes();
  const notFoundRoute = currentRoutes.find(route => route.path === '/:pathMatch(.*)*');

  if (notFoundRoute && notFoundRoute.name) {
    router.removeRoute(notFoundRoute.name);
  }

  routesToAdd.forEach(route => {
    router.addRoute(route);
  })

  router.addRoute({
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/auth/Login.vue')
  });

  isAddDynamicRoutes = true;

}


//重置路由
export function resetRouter() {
  //获取当前路由
  const currentRoutes = router.getRoutes();

  //移除所有动态添加的路由（通过名称）
  currentRoutes.forEach(route => {
    //保留静态路由和404路由
    if (route.name && route.name !== 'NotFound') {
      router.removeRoute(route.name);
    }
})

  isAddDynamicRoutes = false;
}

//全局路由守卫
router.beforeEach(async (to, from ,next) => {
  const userStore = useUserStore()
  const allowedPaths = [
    '/auth/login', 
    '/auth/register', 
    '/auth/changepassword']

  // 未登录且访问非白名单页面 → 跳转登录页
  if (!userStore.token && !allowedPaths.includes(to.path)) {
    next('/auth/login');
    return;
  }

  //已登录但未添加动态路由 → 添加动态路由
  if (userStore.token && !isAddDynamicRoutes) {
    try {
    //获取用户权限
    const role = userStore.role;

    //导入动态路由定义
    const dynamicRoutesModule = await import('./DynamicRoutes');

    //根据权限过滤路由
    const filteredRoutes = filterRoutesByRole(dynamicRoutesModule.dynamicRoutes, role);

    //添加过滤后的路由
    addDynamicRoutes(filteredRoutes);

    // 如果当前路径不存在，重定向到默认页面
    const currentRoute = router.resolve(to.path);
    if (currentRoute.matched.length === 0) {
      next('/main/performanceMonitoring');
      return;
    }


    next({...to, replace: true});
    } catch (error) {
      next('/error');
    }
    return;
  }

  //role为'0'时，强制跳转至登录页
  if(userStore.token && userStore.role === 0 && !allowedPaths.includes(to.path)){
    next('/auth/login');
    return;
  }

  //已登录但访问登录页 → 重定向
  if (userStore.token && to.path === '/auth/login' && from.path !== '/auth/register') {
    next('/main/performanceMonitoring');
    return;
  }


  next();
})

//路由权限过滤函数
export function filterRoutesByRole(routes: RouteRecordRaw[], role: number) {
  if(role === 2){
    return routes.map(route => {
      const newRoute = {...route };
      if (route.children) {
        const filteredChildren = filterRoutesByRole(route.children, role);
        newRoute.children = filteredChildren.length > 0 ? filteredChildren : undefined
      }
      return newRoute;
    });
  }
  return routes
    .map(route => {
      // 深拷贝当前路由
      const newRoute = { ...route };
      if (route.children) {
        const filteredChildren = filterRoutesByRole(route.children, role);
        newRoute.children = filteredChildren.length > 0 ? filteredChildren : undefined
        if (!newRoute.children && !newRoute.component) {
          return undefined;
        }
      }
      // 检查当前路由是否有权限要求
      if (route.meta?.roles) {
        const requiredRoles = Array.isArray(route.meta.roles) 
          ? route.meta.roles 
          : [route.meta.roles];
        if(!requiredRoles.some(r => role === r)){
          return undefined;
        }
      }
      return newRoute;
    })
    .filter((route): route is RouteRecordRaw => !!route);
}


