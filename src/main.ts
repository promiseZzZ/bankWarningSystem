import { createApp } from 'vue';
import 'vuetify/styles';
import vuetify from './plugins/vuetify';
import '../src/scss/style.scss';
import App from './App.vue';
import { router } from './router';
import VueTablerIcons from 'vue-tabler-icons';
import '../node_modules/perfect-scrollbar/css/perfect-scrollbar.css';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
import Antd from 'ant-design-vue';
import axios from 'axios';
import 'ant-design-vue/dist/reset.css';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { axiosInstance } from './utils/request';
import dayjs from 'dayjs';
import VueECharts from 'vue-echarts';
import 'echarts'
import '@mdi/font/css/materialdesignicons.css'


const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
const app = createApp(App);
app.config.globalProperties.$axios = axiosInstance; // 挂载到全局属性
app.config.globalProperties.$dayjs = dayjs;
// 全局注册 PerfectScrollbar 组件
app.component('PerfectScrollbar', PerfectScrollbar);
app.component('VueEcharts', VueECharts);
app.use(vuetify);
app.use(router);
app.use(VueTablerIcons);
app.use(Antd);
app.use(axios);
app.use(pinia);
app.mount('#app');