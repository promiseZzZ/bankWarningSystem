<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import sidebarItems from './vertical-sidebar/sidebarItem';
import NavGroup from './vertical-sidebar/NavGroup/index.vue';
import NavItem from './vertical-sidebar/NavItem/index.vue';
// Icon Imports
import { Menu2Icon} from 'vue-tabler-icons';
// dropdown imports
import NotificationDD from './vertical-header/NotificationDD.vue';
import ProfileDD from './vertical-header/ProfileDD.vue';
import logo from './logo/Logo.vue'
const sidebarMenu = shallowRef(sidebarItems);
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
        <div class="pa-4 d-flex flex-column align-left text-left">
            <logo/>
            <br/>
            <h1>虚假新闻检测平台</h1>
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
    <v-app-bar elevation="0" height="70">
        <div class="d-flex align-center justify-space-between w-100">
            <div>
                <v-btn class="hidden-lg-and-up ms-md-3 ms-sm-5 ms-3 text-muted" @click="sDrawer = !sDrawer" icon variant="flat"
                    size="small">
                    <Menu2Icon size="20" stroke-width="1.5" /> 
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
</style>


