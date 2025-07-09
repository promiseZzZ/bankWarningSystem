<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import sidebarItems from './vertical-sidebar/sidebarItem';
import NavGroup from './vertical-sidebar/NavGroup/index.vue';
import NavItem from './vertical-sidebar/NavItem/index.vue';
import logo from './logo/Logo.vue'
import { Menu2Icon} from 'vue-tabler-icons';
import NotificationDD from './vertical-header/NotificationDD.vue';
import ProfileDD from './vertical-header/ProfileDD.vue';
import { useUserStore } from '../../store/user';

const userStore = useUserStore();
const userRole = userStore.role;

let filteredSidebarItems = sidebarItems;
if (userRole === 1) {
    filteredSidebarItems = sidebarItems.filter(item => item.header !== '信息管理' && item.title !== '账户管理' && item.title !== '节点管理');
}
const sidebarMenu = shallowRef(filteredSidebarItems);
const sDrawer = ref(true);
</script>

<template>
    <!------Sidebar-------->
    <v-navigation-drawer 
        left 
        elevation="0"  
        app 
        class="leftSidebar"  
        v-model="sDrawer"
        :width="280"
        :mini-variant-width="80"
    >
        <!---Logo part -->
        <div class="sidebar-logo-bar d-flex flex-row align-center justify-center">
            <logo/>
            <h1 class="logo-title ms-3 mb-0 nowrap-title">银行监控告警系统</h1>
        </div>
        
        <!-- ---------------------------------------------- -->
        <!---Navigation -->
        <!-- ---------------------------------------------- -->
        <div class="menu-container" style="height: calc(100vh - 160px)">
            <perfect-scrollbar class="scrollnavbar":options="{ suppressScrollX: true }">
                <v-list class="pa-4" color="transparent" style="padding-right: 8px">
                    <template v-for="(item) in sidebarMenu">
                        <NavGroup 
                            :item="item" 
                            v-if="item.header" 
                            :key="item.title"
                            class="nav-group"
                        />
                        <NavItem 
                            :item="item" 
                            v-else 
                            class="nav-item pl-6"
                            active-class="active-menu"
                        />
                    </template>
                </v-list>
            </perfect-scrollbar>
        </div>
    </v-navigation-drawer>

    <!------Header-------->
    <v-app-bar elevation="0" height="60" class="custom-app-bar">
        <div class="d-flex align-center justify-space-between w-100">
            <div class="d-flex align-center">
                <v-btn class="sidebar-toggle-btn me-2" icon variant="text" @click="sDrawer = !sDrawer">
                    <Menu2Icon size="24" stroke-width="1.5" /> 
                </v-btn>
                <!-- Notification -->
                <NotificationDD />
            </div>
            <div>
                <!-- User Profile -->
                <ProfileDD />
            </div>
        </div>
    </v-app-bar>
</template>

<style scoped>
/* 修改现有样式 */
.nav-item {
    border-radius: 8px;
    margin: 4px 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    /* 新增文字保障 */
    color: rgba(0, 0, 0, 0.87) !important; /* 强制文字颜色 */
}

.active-menu {
    background: rgba(25, 210, 170, 0.763) !important; /* 降低背景不透明度 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    color: #1957d2 !important;
    position: relative;
}

/* 新增关键样式 */
::v-deep .v-list-item__content {
    opacity: 1 !important; /* 强制显示文字内容 */
    transition: opacity 0.1s !important;
}

::v-deep .v-list-item--active .v-list-item__content {
    font-weight: 800; /* 激活项加粗 */
}

/* 移动端优化 */
@media (max-width: 960px) {
    .v-navigation-drawer {
        z-index: 1000; /* 确保覆盖内容 */
        box-shadow: 3px 0 15px rgba(0, 0, 0, 0.1) !important;
    }
    
    .logo-text {
        font-size: 1.2rem; /* 缩小标题字号 */
    }
}

/* 悬停状态增强 */
.nav-item:hover {
    background: rgba(62, 25, 210, 0.05) !important;
    transform: translateX(4px);
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.05);
}

.menu-container {
    flex: 1;
    position: relative;
    overflow: hidden;
}

.scrollnavbar {
    height: 100%;
    margin-right: -8px !important;
    padding-right: 8px !important;
}

/* 隐藏原生滚动条 */
::v-deep .ps__rail-x,
::v-deep .ps__rail-y {
    display: none !important;
}

/* 自定义滚动条样式 */
::v-deep .ps__thumb-y {
    background-color: rgba(0,0,0,0.2) !important;
    width: 4px !important;
    border-radius: 4px;
}

::v-deep .ps__thumb-y:hover {
    background-color: rgba(0,0,0,0.3) !important;
}

.v-navigation-drawer.leftSidebar {
    background: rgb(0, 20, 40) !important;
    border-radius: 0 0 16px 0;
    box-shadow: 2px 0 12px rgba(33, 150, 243, 0.08);
}

.custom-app-bar {
    /*background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);*/
    background: rgb(0 20 40); 
    border-radius: 0 0 16px 0;
    box-shadow: 0 2px 8px rgba(33, 150, 243, 0.06);
}

.sidebar-logo-bar {
    background: #596787b5;
    padding: 20px 16px 20px 12px;
    min-height: 80px;
    box-shadow: none;
    width: 100%;
    overflow: hidden;
}
.logo-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: 1px;
    /* 允许换行 */
}


/* sidebar和header所有文字颜色为白色 */
::v-deep .v-list-item__content,
::v-deep .v-list-item__title,
::v-deep .v-list-item__subtitle,
::v-deep .v-list-group__header__content,
::v-deep .v-list-group__header__prepend,
::v-deep .v-list-group__header__append,
::v-deep .v-list-group__header,
::v-deep .v-list-item,
::v-deep .v-list-group__items,
::v-deep .v-list-subheader,
::v-deep .v-list-item__icon,
::v-deep .v-list-item__prepend,
::v-deep .v-list-item__append {
    color: #fff !important;
    font-weight: 700 !important;
    text-shadow: 0 1px 4px rgba(0,0,0,0.18);
}
.custom-app-bar,
.custom-app-bar * {
    color: #fff !important;
}

.sidebar-toggle-btn {
    margin-right: 12px;
    color: #1976d2;
    background: transparent;
}
@media (max-width: 960px) {
    .sidebar-logo-bar {
        padding: 12px 8px 12px 4px;
        min-height: 60px;
    }
    .logo-title {
        font-size: 1.1rem;
    }
}
</style>


