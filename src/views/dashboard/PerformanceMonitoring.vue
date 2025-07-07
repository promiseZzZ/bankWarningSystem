<template>
  <v-container fluid class="pa-6 modern-perf-bg">
    <!-- 顶部响应时间指标条 -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-6 modern-card" elevation="8" hover>
          <v-row align="center" justify="space-around">
            <v-col cols="auto">
              <div class="perf-item" :class="getPerformanceClass(performanceData.ATM01)">
                <span class="perf-label">ATM01:</span>
                <span class="perf-value" :class="getPerformanceClass(performanceData.ATM01)">{{ performanceData.ATM01  }}ms</span>
              </div>
            </v-col>
            <v-col cols="auto">
              <div class="perf-item" :class="getPerformanceClass(performanceData.ATM02)">
                <span class="perf-label">ATM02:</span>
                <span class="perf-value" :class="getPerformanceClass(performanceData.ATM02)">{{ performanceData.ATM02 }}ms</span>
              </div>
            </v-col>
            <v-col cols="auto">
              <div class="perf-item" :class="getPerformanceClass(performanceData.ATM03)">
                <span class="perf-label">ATM03:</span>
                <span class="perf-value" :class="getPerformanceClass(performanceData.ATM03)">{{ performanceData.ATM03 }}ms</span>
              </div>
            </v-col>
            <v-col cols="auto">
              <div class="perf-item" :class="getPerformanceClass(performanceData.FX)">
                <span class="perf-label">FX:</span>
                <span class="perf-value" :class="getPerformanceClass(performanceData.FX)">{{ performanceData.FX }}ms</span>
              </div>
            </v-col>
            <!-- 添加抽屉切换按钮 -->
            <v-col cols="auto">
              <v-btn
                color="primary"
                icon
                @click="drawer = !drawer"
                class="drawer-toggle-btn"
              >
                <v-icon>mdi-server</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- 折线图网格 -->
    <v-row>
      <v-col cols="4">
        <v-card  height="260" class="pa-6 modern-card" elevation="8" hover>
          <div class="fill-height d-flex align-center justify-center grey--text">
                    <MultiLineChart :xAxis="MultiLineData.xData" :series="MultiLineData.series"
             :title="charts[0].title"
           />
          </div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card height="260" class="pa-6 modern-card" elevation="8" hover>
          <div class="fill-height d-flex align-center justify-center grey--text">
          <LineChart :xData="lineData1.xData" :series="[{name: 'ATMService', data: lineData1.series}]"
          :title="charts[1].title"
          :visualMap="{
            show: false,
            dimension: 1,
            pieces: [
              {
                lt: 4000,
                color: '#27ae60'
              },
              {
                gt: 4000,
                lt: 7000,
                color: '#ffc107' 
              },
              {
                gt: 7000,
                color: '#e74c3c'
              }
            ]
          }"
          />
          </div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card height="260" class="pa-6 modern-card" elevation="8" hover>
          <div class="fill-height d-flex align-center justify-center grey--text">
          <LineChart :xData="lineData2.xData" :series="[{name: 'CoreService', data: lineData2.series}]"
          :title="charts[2].title"
          :visualMap="{
            show: false,
            dimension: 1,
            pieces: [
              {
                lt: 4000,
                color: '#27ae60'
              },
              {
                gt: 4000,
                lt: 7000,
                color: '#ffc107' 
              },
              {
                gt: 7000,
                color: '#e74c3c'
              }
            ]
          }"
          />
          </div>
        </v-card>
      </v-col>
    </v-row>

        <!-- 折线图网格 -->
        <v-row class="mt-6">
      <v-col cols="4">
        <v-card height="260" class="pa-6 modern-card" elevation="8" hover>
          <div class="fill-height d-flex align-center justify-center grey--text">
            <LineChart :xData="lineData3.xData" :series="[{name: 'FXEntry', data: lineData3.series}]"
            :title="charts[3].title"
            :visualMap="{
            show: false,
            dimension: 1,
            pieces: [
              {
                lt: 4000,
                color: '#27ae60'
              },
              {
                gt: 4000,
                lt: 7000,
                color: '#ffc107' 
              },
              {
                gt: 7000,
                color: '#e74c3c'
              }
            ]
          }"
            />
          </div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card height="260" class="pa-6 modern-card" elevation="8" hover>
          <div class="fill-height d-flex align-center justify-center grey--text">
          <LineChart :xData="lineData4.xData" :series="[{name: 'FXService', data: lineData4.series}]"
          :title="charts[4].title"
          :visualMap="{
            show: false,
            dimension: 1,
            pieces: [
              {
                lt: 4000,
                color: '#27ae60'
              },
              {
                gt: 4000,
                lt: 7000,
                color: '#ffc107' 
              },
              {
                gt: 7000,
                color: '#e74c3c'
              }
            ]
          }"
          />
          </div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card height="260" class="pa-6 modern-card" elevation="8" hover>
          <div class="fill-height d-flex align-center justify-center grey--text"> 
          <LineChart :xData="lineData5.xData" :series="[{name: 'FXCoreService', data: lineData5.series}]"
          :title="charts[5].title"
          :visualMap="{
            show: false,
            dimension: 1,
            pieces: [
              {
                lt: 4000,
                color: '#27ae60'
              },
              {
                gt: 4000,
                lt: 7000,
                color: '#ffc107' 
              },
              {
                gt: 7000,
                color: '#e74c3c'
              }
            ]
          }"
          />
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- 右侧抽屉 -->
    <v-navigation-drawer
      v-model="drawer"
      location="right"
      temporary
      width="400"
      class="machine-drawer"
    >
      <v-card class="drawer-header" flat>
        <v-card-title class="d-flex align-center justify-space-between">
          <span class="drawer-title">
            <v-icon class="mr-2">mdi-server</v-icon>
            物理机信息
          </span>
        </v-card-title>
      </v-card>

      <v-divider></v-divider>

      <v-card-text class="drawer-content">
        <!-- ATM物理机信息 -->
        <v-card class="machine-card mb-4" elevation="4">
          <v-card-title class="machine-title">
            <v-icon class="mr-2" color="blue">mdi-desktop-tower</v-icon>
            ATM物理机
          </v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="green">mdi-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>状态: 运行中</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="blue">mdi-cpu-64-bit</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>CPU使用率: {{ atmMachineInfo.cpuUsage }}%</v-list-item-title>
                  <v-progress-linear
                    :value="atmMachineInfo.cpuUsage"
                    color="blue"
                    height="8"
                    rounded
                  ></v-progress-linear>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="orange">mdi-memory</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>内存使用率: {{ atmMachineInfo.memoryUsage }}%</v-list-item-title>
                  <v-progress-linear
                    :value="atmMachineInfo.memoryUsage"
                    color="orange"
                    height="8"
                    rounded
                  ></v-progress-linear>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="purple">mdi-harddisk</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>磁盘使用率: {{ atmMachineInfo.diskUsage }}%</v-list-item-title>
                  <v-progress-linear
                    :value="atmMachineInfo.diskUsage"
                    color="purple"
                    height="8"
                    rounded
                  ></v-progress-linear>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="red">mdi-thermometer</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>温度: {{ atmMachineInfo.temperature }}°C</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="cyan">mdi-network</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>网络状态: {{ atmMachineInfo.networkStatus }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- FX物理机信息 -->
        <v-card class="machine-card" elevation="4">
          <v-card-title class="machine-title">
            <v-icon class="mr-2" color="green">mdi-desktop-tower</v-icon>
            FX物理机
          </v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="green">mdi-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>状态: 运行中</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="blue">mdi-cpu-64-bit</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>CPU使用率: {{ fxMachineInfo.cpuUsage }}%</v-list-item-title>
                  <v-progress-linear
                    :value="fxMachineInfo.cpuUsage"
                    color="blue"
                    height="8"
                    rounded
                  ></v-progress-linear>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="orange">mdi-memory</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>内存使用率: {{ fxMachineInfo.memoryUsage }}%</v-list-item-title>
                  <v-progress-linear
                    :value="fxMachineInfo.memoryUsage"
                    color="orange"
                    height="8"
                    rounded
                  ></v-progress-linear>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="purple">mdi-harddisk</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>磁盘使用率: {{ fxMachineInfo.diskUsage }}%</v-list-item-title>
                  <v-progress-linear
                    :value="fxMachineInfo.diskUsage"
                    color="purple"
                    height="8"
                    rounded
                  ></v-progress-linear>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="red">mdi-thermometer</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>温度: {{ fxMachineInfo.temperature }}°C</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="cyan">mdi-network</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>网络状态: {{ fxMachineInfo.networkStatus }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-navigation-drawer>
  </v-container>
</template>

<script lang="ts" setup>
import LineChart from '../../components/charts/LineChart.vue';
import { axiosInstance } from '../../utils/request';
import { onMounted, onUnmounted, ref } from 'vue';
import MultiLineChart from '../../components/charts/MultiLineChart.vue';

// 抽屉状态
const drawer = ref(false);

// ATM物理机信息
const atmMachineInfo = ref({
  cpuUsage: 45,
  memoryUsage: 62,
  diskUsage: 38,
  temperature: 42,
  networkStatus: '正常'
});

// FX物理机信息
const fxMachineInfo = ref({
  cpuUsage: 38,
  memoryUsage: 55,
  diskUsage: 42,
  temperature: 39,
  networkStatus: '正常'
});

// 模拟更新物理机信息
function updateMachineInfo() {
  // ATM物理机信息更新
  atmMachineInfo.value.cpuUsage = Math.floor(Math.random() * 30) + 30; // 30-60%
  atmMachineInfo.value.memoryUsage = Math.floor(Math.random() * 25) + 50; // 50-75%
  atmMachineInfo.value.diskUsage = Math.floor(Math.random() * 20) + 30; // 30-50%
  atmMachineInfo.value.temperature = Math.floor(Math.random() * 15) + 35; // 35-50°C

  // FX物理机信息更新
  fxMachineInfo.value.cpuUsage = Math.floor(Math.random() * 25) + 25; // 25-50%
  fxMachineInfo.value.memoryUsage = Math.floor(Math.random() * 20) + 45; // 45-65%
  fxMachineInfo.value.diskUsage = Math.floor(Math.random() * 15) + 35; // 35-50%
  fxMachineInfo.value.temperature = Math.floor(Math.random() * 12) + 32; // 32-44°C
}

//折线图数据
const MultiLineData = ref<{
 xData: string[],
 series: Array<{name: string, data: number[]}>
}>({
 xData: [],
 series: [
   {name: 'ATMEntry01', data: []},
   {name: 'ATMEntry02', data: []},
   {name: 'ATMEntry03', data: []}
 ]
});
 const lineData1 = ref<{
    xData: string[],
    series: number[]
  }>({
    xData: [],
    series: []
  });
  const lineData2 = ref<{
    xData: string[],
    series: number[]
  }>({
    xData: [],
    series: []
  });
  const lineData3 = ref<{
    xData: string[],
    series: number[]
  }>({
    xData: [],
    series: []
  });
  const lineData4 = ref<{
    xData: string[],
    series: number[]
  }>({
    xData: [],
    series: []
  });
  const lineData5 = ref<{
    xData: string[],
    series: number[]
  }>({
    xData: [],
    series: []
  });

const charts = [
  { title: 'ATMEntry响应时间' },
  { title: 'ATMService响应时间' },
  { title: 'CoreService响应时间' },
  { title: 'FXEntry响应时间' },
  { title: 'FXService响应时间' },
  { title: 'FXCoreService响应时间' }
];

const performanceData = ref({
  ATM01: 0,
  ATM02: 0,
  ATM03: 0,
  FX: 0
});

// 根据响应时间值返回对应的CSS类名
const getPerformanceClass = (value: number) => {
  if (value < 500) {
    return 'normal'; // 正常 - 蓝色
  } else if (value < 7000) {
    return 'warning'; // 警告 - 橙色
  } else {
    return 'danger'; // 危险 - 红色
  }
};

async function getNodeSummary() {
  const response = await axiosInstance.get('/node-monitor/getNodeSummary');
  if (response.data && response.data.data) {
    // 遍历返回的数据数组，根据serviceName更新对应的值
    response.data.data.forEach((item: any) => {
      switch (item.serviceName) {
        case 'ATM01':
          performanceData.value.ATM01 = item.responseTime;
          break;
        case 'ATM02':
          performanceData.value.ATM02 = item.responseTime;
          break;
        case 'ATM03':
          performanceData.value.ATM03 = item.responseTime;
          break;
        case 'FX01':
          performanceData.value.FX = item.responseTime;
          break;
      }
    });
  }
};

async function fetchLineDataInit(nodeName: string) {
    try {
      const response = await axiosInstance.post('/node-monitor/getNodeMonitorData', {
        nodeName: nodeName
      });

      if(response.data && response.data.data){
        if(nodeName.includes('ATM_Entry')){
          MultiLineData.value.xData = response.data.data.xdata; 
        }
      switch (nodeName) {
        case 'ATM_Entry_01':
          MultiLineData.value.series[0].data = response.data.data.data; 
          break;
        case 'ATM_Entry_02':
          MultiLineData.value.series[1].data = response.data.data.data; 
          break;  
        case 'ATM_Entry_03':
          MultiLineData.value.series[2].data = response.data.data.data; 
          break;
        case 'ATM_Server_01':
          lineData1.value.xData = response.data.data.xdata;
          lineData1.value.series = response.data.data.data;
          break;
        case 'Core_Service_01':
          lineData2.value.xData = response.data.data.xdata;
          lineData2.value.series = response.data.data.data;
          break;
        case 'FX_Entry_01':
          lineData3.value.xData = response.data.data.xdata;
          lineData3.value.series = response.data.data.data;
          break;
        case 'FX_Server_01':
          lineData3.value.xData = response.data.data.xdata;
          lineData4.value.series = response.data.data.data;
          break;
        case 'Core_Entry_01':
          lineData5.value.xData = response.data.data.xdata;
          lineData5.value.series = response.data.data.data;
          break;
      }
    }
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  }


async function getNodeMonitorData(nodeName: string) {
  try {
    const response = await axiosInstance.post('/node-monitor/getNodeMonitorData',{
      nodeName: nodeName
    }
    );
    
    if (response.data && response.data.data) {
      const latestData = response.data.data.data[response.data.data.data.length - 1];
      const latestXData = response.data.data.xdata[response.data.data.xdata.length - 1];

      if(nodeName.includes('ATM_Entry')){
        if (MultiLineData.value.xData[MultiLineData.value.xData.length - 1] !== latestXData){
          MultiLineData.value.xData.shift();
          MultiLineData.value.xData.push(latestXData);
        }
      }

      switch (nodeName) {
        case 'ATM_Entry_01':
          if (MultiLineData.value.xData[MultiLineData.value.xData.length - 1] !== latestXData && 
          MultiLineData.value.series[0].data[MultiLineData.value.series[0].data.length - 1] !== latestData){
            MultiLineData.value.series[0].data.shift();
            MultiLineData.value.series[0].data.push(latestData);
          }
          break;
        case 'ATM_Entry_02':
          if (MultiLineData.value.xData[MultiLineData.value.xData.length - 1] !== latestXData && 
          MultiLineData.value.series[1].data[MultiLineData.value.series[1].data.length - 1] !== latestData){
            MultiLineData.value.series[1].data.shift();
            MultiLineData.value.series[1].data.push(latestData);
          }
          break;
        case 'ATM_Entry_03':
          if (MultiLineData.value.xData[MultiLineData.value.xData.length - 1] !== latestXData && 
          MultiLineData.value.series[2].data[MultiLineData.value.series[2].data.length - 1] !== latestData){
            MultiLineData.value.series[2].data.shift();
            MultiLineData.value.series[2].data.push(latestData);
          }
          break;
        case 'ATM_Server_01':
          if (lineData1.value.xData[lineData1.value.xData.length - 1] !== latestXData && 
          lineData1.value.series[lineData1.value.series.length - 1] !== latestData){
            lineData1.value.xData.shift();  
            lineData1.value.series.shift();
            lineData1.value.xData.push(latestXData);
            lineData1.value.series.push(latestData);
          }
          break;
        case 'Core_Service_01':
        if (lineData2.value.xData[lineData2.value.xData.length - 1] !== latestXData && 
          lineData2.value.series[lineData2.value.series.length - 1] !== latestData){
            lineData2.value.xData.shift();
            lineData2.value.series.shift(); 
            lineData2.value.xData.push(latestXData);
            lineData2.value.series.push(latestData);  
          }
          break;
        case 'FX_Entry_01':
          if (lineData3.value.xData[lineData3.value.xData.length - 1] !== latestXData && 
          lineData3.value.series[lineData3.value.series.length - 1] !== latestData) {
            lineData3.value.xData.shift();
            lineData3.value.series.shift();
            lineData3.value.xData.push(latestXData);
            lineData3.value.series.push(latestData);
          }
          break;
        case 'FX_Server_01':
          if (lineData4.value.xData[lineData4.value.xData.length - 1] !== latestXData && 
          lineData4.value.series[lineData4.value.series.length - 1] !== latestData) {
            lineData4.value.xData.shift();      
            lineData4.value.series.shift();
            lineData4.value.xData.push(latestXData);
            lineData4.value.series.push(latestData);
          }
          break;
          case 'Core_Entry_01':
          if (lineData5.value.xData[lineData5.value.xData.length - 1] !== latestXData && 
          lineData5.value.series[lineData5.value.series.length - 1] !== latestData) {
            lineData5.value.xData.shift();
            lineData5.value.series.shift();
            lineData5.value.xData.push(latestXData);
            lineData5.value.series.push(latestData);
          }
          break;
      }
    }
  } catch (error) {
    console.error('获取节点监控数据失败:', error);
  }
}

// 初始化所有节点数据
async function initAllNodeData() {
  await getNodeSummary();
  await fetchLineDataInit('ATM_Entry_01');
  await fetchLineDataInit('ATM_Entry_02');
  await fetchLineDataInit('ATM_Entry_03');
  await fetchLineDataInit('ATM_Server_01');
  await fetchLineDataInit('Core_Service_01');
  await fetchLineDataInit('FX_Entry_01');
  await fetchLineDataInit('FX_Server_01');
  await fetchLineDataInit('Core_Entry_01');
}

// 更新所有节点数据
async function undateAllNodeData() {
  await getNodeSummary();
  await getNodeMonitorData('ATM_Entry_01');
  await getNodeMonitorData('ATM_Entry_02');
  await getNodeMonitorData('ATM_Entry_03');
  await getNodeMonitorData('ATM_Server_01');
  await getNodeMonitorData('Core_Service_01');
  await getNodeMonitorData('FX_Entry_01');
  await getNodeMonitorData('FX_Server_01');
  await getNodeMonitorData('Core_Entry_01');
  // 更新物理机信息
  updateMachineInfo();
}

// 定时更新数据
let timer: number | undefined;

onMounted(() => {
  // 初始化数据
  initAllNodeData();
  
  // 每10秒更新一次数据
  timer = window.setInterval(() => {
    undateAllNodeData();
  }, 10000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});

onUnmounted(() => {

});
</script>

<style scoped>
.modern-perf-bg {
  height: 100%;
  background: #e0e4ec42;
  min-height: 100%;
}

.modern-card {
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(33, 150, 243, 0.10);
  background: #fff;
  transition: box-shadow 0.2s;
}

.modern-card:hover {
  box-shadow: 0 8px 32px 0 rgba(33, 150, 243, 0.15);
}

.perf-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.perf-label {
  font-size: 16px;
  color: #666;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.perf-value {
  font-size: 28px;
  font-weight: 700;
  color: #1976d2;
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

/* 正常状态 - 绿色 */
.perf-value.normal {
  color: #1976d2;
}
/* 警告状态 - 橙色 */
.perf-value.warning {
  color: #ff9800;
}
/* 危险状态 - 红色 */
.perf-value.danger {
  color: #f44336;
}


.chart-card {
  display: flex;
  flex-direction: column;
}


.chart-placeholder {
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.chart-text {
  color: #9e9e9e;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* 抽屉样式 */
.machine-drawer {
  background: #f8f9fa;
}

.drawer-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.drawer-title {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.drawer-content {
  padding: 16px;
}

.machine-card {
  border-radius: 12px;
  border-left: 4px solid #1976d2;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.machine-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.machine-title {
  font-size: 16px;
  font-weight: 600;
  color: #1976d2;
  padding: 16px 16px 8px 16px;
}

.drawer-toggle-btn {
  transition: transform 0.2s ease;
}

.drawer-toggle-btn:hover {
  transform: scale(1.1);
}
</style>