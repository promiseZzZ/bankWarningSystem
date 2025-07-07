<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4 modern-card" elevation="8" hover>
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="table-title">筛选</span>
          </div>
          <v-row class="mb-4" dense>
            <v-col cols="3">
              <v-select 
              v-model="filters.nodeName" 
              :items="nodeOptions"
              label="节点名" 
              clearable
              @update:model-value="handleSearch" />
            </v-col>
            <v-col cols="3">
              <v-select
                v-model="filters.status"
                :items="statusOptions"
                label="状态"
                clearable
                @update:model-value="handleStatusChange"
                :error="!!statusError"
                :error-messages="statusError"
                required
              />
            </v-col>

            <v-col cols="3">
              <v-menu
                v-model="startDateMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-model="filters.startDateTime"
                    label="起始日期"
                    readonly
                    v-bind="props"
                    clearable
                  >
                    <template #append-inner>
                      <v-icon>mdi-calendar</v-icon>
                    </template>
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="filters.startDateTime"
                  @update:model-value="handleStartDateChange"
                  title="选择日期"
                  hide-header
                />
              </v-menu>
            </v-col>

            <v-col cols="3">
              <v-menu
                v-model="endDateMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-model="filters.endDateTime"
                    label="结束日期"
                    readonly
                    v-bind="props"
                    clearable
                    :error="!!endDateError"
                    :error-messages="endDateError"
                  >
                    <template #append-inner>
                      <v-icon>mdi-calendar</v-icon>
                    </template>
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="filters.endDateTime"
                  @update:model-value="handleEndDateChange"
                  title="选择日期"
                  hide-header
                  :min="filters.startDateTime"
                />
              </v-menu>
            </v-col>
          </v-row>

          <!-- 搜索和重置按钮 -->
          <v-row class="mb-4" dense>
            <v-col cols="12" class="d-flex gap-2">
              <v-btn 
                color="secondary" 
                @click="handleReset"
                prepend-icon="mdi-refresh">
                重置
              </v-btn>
            </v-col>
          </v-row>

          <v-row class="mb-4" dense>
            <v-col cols="12" class="d-flex gap-2 align-center">
              <span v-if="selected.length > 0" class="text-body-2 text-grey-600">
                已选中 {{ selected.length }} 项
              </span>
              <v-btn color="success" 
              :disabled="!selected.length" 
              @click="showStatusDialog = true" 
              hover>批量修改状态</v-btn>
              <v-btn color="error" 
              :disabled="!selected.length" 
              @click="handleBatchDelete" 
              hover>批量删除</v-btn>
              <v-btn color="info" 
              @click="debugSelection" 
              hover>调试选择状态</v-btn>
            </v-col>
          </v-row>

          <!-- 状态选择对话框 -->
          <v-dialog v-model="showStatusDialog" max-width="400">
            <v-card>
              <v-card-title>选择状态</v-card-title>
              <v-card-text>
                <v-select
                  v-model="selectedStatus"
                  :items="statusOptions"
                  label="请选择要修改的状态"
                  required
                />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="handleBatchUpdateStatus" :disabled="!selectedStatus">
                  确认
                </v-btn>
                <v-btn @click="showStatusDialog = false">取消</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-data-table
            :headers="tableHeaders"
            :items="tableData"
            :items-per-page="10"
            :loading="loading"
            density="compact"
            item-key="id" 
            show-divider
            show-select
            v-model:selected="selected"
            return-object
            @update:selected="handleSelectionChange">
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
     
</template>
  
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { axiosInstance } from '../../utils/request';

// 定义表格数据类型
interface TableItem {
  id: number;
  index: number;
  recordTime: string;
  nodeName: string;
  responseTime: string;
  status: string; 
  userNames: string;
}

const tableHeaders = ref([
  { title: '序号', key: 'index' },
  { title: '记录时间', key: 'recordTime' },
  { title: '节点名', key: 'nodeName' },
  { title: '响应时间', key: 'responseTime' },
  { title: '状态', key: 'status'},
  { title: '负责人', key: 'userNames' },
]);

const tableData = ref<TableItem[]>([]);
const loading = ref(false);

const filters = ref({
  nodeName: '',
  status: '',
  startDateTime: '' as string | Date,
  endDateTime: '' as string | Date,
});

const statusOptions = ['待处理','处理中','已处理'];
const nodeOptions = ['ATM_Entry_01','ATM_Entry_02','ATM_Entry_03','ATM_Server_01','Core_Service_01','FX_Entry_01','FX_Server_01','Core_Entry_01'];

const startDateMenu = ref(false);
const endDateMenu = ref(false);

const selected = ref<TableItem[]>([]);
const showStatusDialog = ref(false);
const selectedStatus = ref('');
const endDateError = ref('');
const statusError = ref('');

const mockRecords = [
  {
    id: 1,
    recordTime: '2024-06-01 10:00:00',
    nodeName: 'ATM_Entry_01',
    responseTime: 120,
    status: 0,
    userNames: ['张三', '李四']
  },
  {
    id: 2,
    recordTime: '2024-06-01 10:05:00',
    nodeName: 'ATM_Entry_02',
    responseTime: 150,
    status: 1,
    userNames: ['王五']
  },
  {
    id: 3,
    recordTime: '2024-06-01 10:10:00',
    nodeName: 'ATM_Server_01',
    responseTime: 200,
    status: 2,
    userNames: ['赵六']
  }
];

// 拼接日期时间字符串
function getDateTimeString(date: string | Date, hour: number, minute: number, second: number) {
  if (!date) return '';
  
  let dateStr: string;
  
  // 如果是Date对象，转换为YYYY-MM-DD格式
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    dateStr = `${year}-${month}-${day}`;
  } else {
    // 如果已经是字符串，直接使用
    dateStr = date;
  }
  
  const h = String(hour).padStart(2, '0');
  const m = String(minute).padStart(2, '0');
  const s = String(second).padStart(2, '0');
  return `${dateStr} ${h}:${m}:${s}`;
}

// 获取表格数据
async function fetchTableData(params: {
  page?: number,
  size?: number,
  status?: number,
  startTime?: string,
  endTime?: string,
  nodeName?: string,
} = {}) {
  loading.value = true;
  try {
    const response = await axiosInstance.post('/node-alert/getAlertRecord', params);
    console.log('API响应:', response.data);
    
    if (response.data && response.data.data && Array.isArray(response.data.data.records)) {
      // 处理数据格式
      tableData.value = response.data.data.records.map((item: any, index: number) => ({
        ...item,
        // 确保 id 存在且唯一
        id: item.id || `temp_${Date.now()}_${index}`,
        // 转换 userNames 数组为字符串
        userNames: Array.isArray(item.userNames) ? item.userNames.join(', ') : item.userNames,
        // 转换状态数字为中文
        status: getStatusText(item.status),
        // 格式化响应时间
        responseTime: `${item.responseTime}ms`,
        // 添加序号
        index: index + 1
      }));
      
      console.log('处理后的表格数据:', tableData.value);
      console.log('数据项的ID:', tableData.value.map(item => item.id));
    } else {
      // 如果没有数据，设置为空数组
      tableData.value = [];
      console.log('没有数据或数据格式错误');
    }
  } catch (error) {
    console.error('获取数据失败:', error);
    tableData.value = [];
  } finally {
    loading.value = false;
  }
}

// 状态映射函数
function getStatusText(status: number): string {
  const statusMap: { [key: number]: string } = {
    0: '待处理',
    1: '处理中', 
    2: '已处理'
  };
  return statusMap[status] || '未知状态';
}

// 构建参数
function buildTableParams() {
  const params: any = {};
  if (filters.value.nodeName) params.nodeName = filters.value.nodeName;
  if (filters.value.status) {
    // 将中文状态转换为数字
    const statusMap: { [key: string]: number } = {
      '待处理': 0,
      '处理中': 1,
      '已处理': 2
    };
    params.status = statusMap[filters.value.status];
  }
  // 日期时间拼接
  if (filters.value.startDateTime) {
    const startDt = getDateTimeString(
      filters.value.startDateTime,
      0,
      0,
      0
    );
    if (startDt) {
      params.startTime = startDt;
    }
  }
  if (filters.value.endDateTime) {
    const endDt = getDateTimeString(
      filters.value.endDateTime,
      23,
      59,
      59
    );
    if (endDt) {
      params.endTime = endDt;
    }
  }
  params.page = 1;
  params.size = 10;
  return params;
}

// 搜索处理
const handleSearch = async () => {
  // 验证状态必选
  if (!filters.value.status) {
    statusError.value = '请选择状态';
    return;
  }
  statusError.value = '';
  
  // 验证日期
  if (filters.value.startDateTime && filters.value.endDateTime) {
    const startDate = new Date(filters.value.startDateTime);
    const endDate = new Date(filters.value.endDateTime);
    if (endDate < startDate) {
      endDateError.value = '结束日期不能早于开始日期';
      return;
    }
  }
  endDateError.value = '';
  
  await fetchTableData(buildTableParams());
};

// 重置处理
const handleReset = async () => {
  filters.value = {
    nodeName: '',
    status: '',
    startDateTime: '' as string | Date,
    endDateTime: '' as string | Date,
  };
  // 清除错误信息
  endDateError.value = '';
  statusError.value = '';
  await fetchTableData({ page: 1, size: 10 });
};

// 批量修改状态
const handleBatchUpdateStatus = async () => {
  if (!selectedStatus.value) return;
  
  console.log('选中的项目:', selected.value);
  console.log('选中的状态:', selectedStatus.value);
  
  // 将中文状态转换为数字
  const statusMap: { [key: string]: number } = {
    '待处理': 0,
    '处理中': 1,
    '已处理': 2
  };
  const status = statusMap[selectedStatus.value];
  const ids = selected.value.map(item => item.id);
  
  console.log('要更新的ID:', ids);
  console.log('要更新的状态:', status);
  
  try {
    const response = await axiosInstance.post('/node-alert/updateStatus', { ids, status });
    console.log('更新状态响应:', response);
    // 保存当前选中的ID
    const selectedIds = selected.value.map(item => item.id);
    await fetchTableData(buildTableParams());
    // 重新选中之前选中的项目
    const newSelected = tableData.value.filter(item => selectedIds.includes(item.id));
    selected.value = newSelected;
    showStatusDialog.value = false;
    selectedStatus.value = '';
  } catch (error) {
    console.error('批量修改状态失败:', error);
  }
};

// 批量删除
const handleBatchDelete = async () => {
  const ids = selected.value.map(item => item.id);
  
  console.log('要删除的项目:', selected.value);
  console.log('要删除的ID:', ids);
  
  try {
    const response = await axiosInstance.post('/node-alert/deleteAlertRecord', { ids });
    console.log('删除响应:', response);
    await fetchTableData(buildTableParams());
    // 删除后清空选择是合理的
    selected.value = [];
  } catch (error) {
    console.error('批量删除失败:', error);
  }
};

// 处理日期变化
const handleStartDateChange = async () => {
  startDateMenu.value = false;
  // 清除结束日期错误
  endDateError.value = '';
  await handleSearch();
};

const handleEndDateChange = async () => {
  endDateMenu.value = false;
  // 验证结束日期不能早于开始日期
  if (filters.value.startDateTime && filters.value.endDateTime) {
    const startDate = new Date(filters.value.startDateTime);
    const endDate = new Date(filters.value.endDateTime);
    if (endDate < startDate) {
      endDateError.value = '结束日期不能早于开始日期';
      return;
    }
  }
  endDateError.value = '';
  await handleSearch();
};

// 处理状态变化
const handleStatusChange = async () => {
  // 验证状态必选
  if (!filters.value.status) {
    statusError.value = '请选择状态';
    return;
  }
  statusError.value = '';
  await handleSearch();
};

onMounted(() => {
  // 设置默认状态为"待处理"
  filters.value.status = '待处理';
  fetchTableData({ page: 3, size: 5, status: 0 });
});

// 监听选择状态变化
watch(selected, (newSelected, oldSelected) => {
  console.log('选择状态变化:', newSelected);
  console.log('选中数量:', newSelected.length);
  console.log('之前选中数量:', oldSelected?.length || 0);
  if (newSelected.length > 0) {
    console.log('选中的项目:', newSelected.map(item => ({ id: item.id, nodeName: item.nodeName, status: item.status })));
  }
  console.log('当前表格数据ID:', tableData.value.map(item => item.id));
}, { deep: true });

// 处理选择变化
const handleSelectionChange = (newSelected: TableItem[]) => {
  console.log('handleSelectionChange 被调用');
  console.log('新的选中项目:', newSelected);
  console.log('新的选中数量:', newSelected.length);
  selected.value = newSelected;
};

// 调试选择状态
const debugSelection = () => {
  console.log('当前选中的项目:', selected.value);
  console.log('选中项目数量:', selected.value.length);
  console.log('当前选中的状态:', selected.value.map(item => item.status));
  console.log('当前表格数据:', tableData.value);
  console.log('表格数据数量:', tableData.value.length);
  console.log('表格数据ID列表:', tableData.value.map(item => item.id));
};
</script>
  
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
}

.gap-2 {
  gap: 8px;
}
</style>