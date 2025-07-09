<template>
  <v-container fluid class="pa-6 modern-analysis-bg">
    <!-- 日期选择 -->
    <v-menu
                v-model="dateDialog"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-model="currentDate"
                    label="当前数据日期"
                    readonly
                    v-bind="props"
                    clearable
                    width="400px"
                  >
                    <template #append-inner>
                      <v-icon>mdi-calendar</v-icon>
                    </template>
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="currentDate"
                  @update:model-value="onDateSelected"
                  title="选择日期"
                  hide-header
                />
              </v-menu>
    <!-- 顶部统计卡片 -->
    <v-row class="mb-1" dense>
      <v-col cols="3" v-for="(item, idx) in statCards" :key="idx">
        <v-card class="pa-4 modern-card" height="120" elevation="8" hover>
          <div class="stat-title">{{ item.title }}</div>
          <div class="stat-value">{{ item.value }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- 中间两个条形图 -->
    <v-row class="mb-1" dense>
      <v-col cols="6">
        <v-card class="pa-4 modern-card" height="260" elevation="8" hover>
          <BarChart :data="barData1" title="警告次数分布" direction="vertical" />  
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="pa-4 modern-card" height="260" elevation="8" hover>
          <BarChart :data="barData2" title="超阈值时长分布" direction="vertical" />
        </v-card>
      </v-col>
    </v-row>

    <!-- 底部表格及导出按钮 -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4 modern-card" elevation="8" hover>
          <div class="d-flex justify-space-between align-center mb-1">
            <span class="table-title">数据列表</span>
            <v-btn color="#0c77b9" @click="exportExcel" class="export-btn">导出为Excel</v-btn>
          </div>
          <v-data-table
            :headers="tableHeaders"
            :items="tableData"
            :items-per-page="4"
            :items-per-page-options="[4]"
            density="compact"
            item-key="name" 
            show-divider>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import {axiosInstance} from '../../utils/request';
import {formatDate} from 'date-fns';
import BarChart from '../../components/charts/BarChart.vue';
// @ts-ignore
import * as XLSX from 'xlsx';
// @ts-ignore
import { saveAs } from 'file-saver';

const currentDate = ref(formatDate(new Date(new Date().getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
 const dateDialog = ref(false);
 const tempDate = ref(currentDate.value);

// 顶部统计卡片数据
const statCards = ref([
  { title: '平均响应时间最长节点:', value: '' },
  { title: '响应时间峰值最大节点:', value: '' },
  { title: '超阈值时长最长节点:', value: '' },
  { title: '警告次数最多节点:', value: '' },
]);

// 类型声明
interface TableDataItem {
  name: string;
  warningCount: number;
  avgResponseTime: number;
  peakResponseTime: number;
  overThresholdDuration: number;
}

// 柱状图数据
const barData1 = ref([]);
const barData2 = ref([]);

// 表格表头
const tableHeaders = [
  { title: '节点名', key: 'name' },
  { title: '平均响应时间(ms)', key: 'avgResponseTime' },
  { title: '响应时间峰值(ms)', key: 'peakResponseTime' },
  { title: '超阈值时长(s)',  key: 'overThresholdDuration' },
  { title: '警告次数', key: 'warningCount' },
];

// 表格数据
const tableData = ref<TableDataItem[]>([])

async function onDateSelected(val: string) {
    const formatedDate = formatDate(new Date(val), 'yyyy-MM-dd');
    currentDate.value = formatedDate;
    tempDate.value = val;
    dateDialog.value = false;

    getNodeInfo(currentDate.value);
    getgetWarningCount(currentDate.value);
    getOverThresholdDuration(currentDate.value);
  }

const maxNamesList = computed(() => {
  const data = tableData.value
  const list = [
    data.reduce((max, item) => item.avgResponseTime > max.avgResponseTime ? item : max, data[0]).name,           // 平均响应时间最大
    data.reduce((max, item) => item.peakResponseTime > max.peakResponseTime ? item : max, data[0]).name,         // 峰值响应时间最大
    data.reduce((max, item) => item.overThresholdDuration > max.overThresholdDuration ? item : max, data[0]).name,// 超阈值时长最大
    data.reduce((max, item) => item.warningCount > max.warningCount ? item : max, data[0]).name,                 // 告警次数最大
  ]
  console.log(list);
  return list;
});

async function getNodeInfo(date: string) {
  try {
    const response = await axiosInstance.get(`/nodeAnalyze/${date}` );
    if (response.data){
      tableData.value = response.data.data;

      statCards.value[0].value = maxNamesList.value[0];
      statCards.value[1].value = maxNamesList.value[1];
      statCards.value[2].value = maxNamesList.value[2];
      statCards.value[3].value = maxNamesList.value[3];
    }
  } catch (error) {
    console.error('获取数据失败:', error);
  }
}

async function getgetWarningCount(date: string) {
  try {
    const response = await axiosInstance.get(`/nodeAnalyze/getWarningCount/${date}`);
    if(response.data){
      barData1.value = response.data.data;
    }
  } catch (error) {
    console.error('获取数据失败:', error);
  }
}

async function getOverThresholdDuration(date: string) {
  try {
    const response = await axiosInstance.get(`/nodeAnalyze/getOverThresholdDuration/${date}`);
    if(response.data){
      barData2.value = response.data.data;
    }
  } catch (error) {
    console.error('获取数据失败:', error);
  }
}


onMounted(async () => {
  getNodeInfo(currentDate.value);
  getgetWarningCount(currentDate.value);
  getOverThresholdDuration(currentDate.value);
})

// 导出为Excel
function exportExcel() {
  // 生成表格数据
  const data = tableData.value.map(row => ({
    '服务名': row.name,
    '警告次数': row.warningCount,
    '平均响应时间': row.avgResponseTime,
    '响应时间峰值': row.peakResponseTime,
    '超阈值时长': row.overThresholdDuration,
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '性能分析');
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '性能分析.xlsx');
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
}


.modern-analysis-bg {
  background: #e0e4ec42;
  min-height: 100vh;
}

.modern-card {
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(33, 150, 243, 0.10);
  background: #fff;
  transition: box-shadow 0.2s;
}

.stat-title {
  font-size: 16px;
  color: #888;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 30px;
  color: #1976d2;
  font-weight: bold;
  margin-top: 18px;
  text-align: center;
}

.table-title {
  font-size: 18px;
  font-weight: 600;
  color: #1976d2;
}

.export-btn {
  font-weight: 500;
  letter-spacing: 1px;
}

::v-deep .v-data-table__td {
  border-bottom: 1px solid #000000 !important;
}

.current-date-title {
  font-size: 20px;
  color: #000000;
  font-weight: 500;
  margin-left: 16px;
  letter-spacing: 1px;
}
.current-date-value {
  font-size: 20px;
  color: #1976d2;
  font-weight: 500;
}
</style>