<template>
  <v-container fluid class="modern-alarm-bg">
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4 modern-card" elevation="8" hover>
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="table-title">筛选</span>
          <!-- 重置按钮 -->
              <v-btn 
                color="#0c77b9" 
                @click="handleReset"
                prepend-icon="mdi-refresh">
                重置
              </v-btn>
            </div>
          <v-row class="mb-4" dense>
            <v-col cols="3">
              <v-select 
              v-model="filters.nodeName" 
              :items="nodeOptions"
              label="节点名" 
              clearable
              @update:model-value="fetchTableData(buildTableParams())" />
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

          <v-row class="mb-4" dense>
            <v-col cols="12" class="d-flex gap-2 align-center">
              <span v-if="selected.length > 0" class="text-body-2 text-grey-600">
                已选中 {{ selected.length }} 项
              </span>
              <v-btn color="#0c77b9" 
              :disabled="!selected.length" 
              @click="showStatusDialog = true" 
              hover>批量修改状态</v-btn>
              <v-btn color="#0c77b9" 
              :disabled="!selected.length" 
              @click="handleBatchDelete" 
              hover>批量删除</v-btn>
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
                  label="状态"
                  required
                  hint="请选择要修改的状态"
                  persistent-hint
                  
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
            :items-per-page-options="[5, 10]"
            :loading="loading"
            density="compact"
            item-key="id" 
            show-divider
            show-select
            v-model="selected"
            @update:selected="handleSelectionChange">
            <template #item.statusText="{ item }">
              <v-chip 
              :color="item.statusText === '待处理' ? 'error' : item.statusText === '处理中' ? 'primary' : 'success'"
              variant="outlined"
              text-color="white"
              small
              class="font-weight-bold"
              >
              {{ item.statusText }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
     
</template>
  
<script lang="ts" setup>
import { ref, onMounted} from 'vue';
import { axiosInstance } from '../../utils/request';

// 定义表格数据类型
interface TableItem {
  id: number;
  index: number;
  recordTime: string;
  nodeName: string;
  responseTime: string;
  status: number; 
  statusText: string;
  userNames: string;
}

const tableHeaders = ref([
  { title: '序号', key: 'index' },
  { title: '记录时间', key: 'recordTime' },
  { title: '节点名', key: 'nodeName' },
  { title: '响应时间', key: 'responseTime' },
  { title: '状态', key: 'statusText', },
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
const nodeOptions = ref<string[]>([]);

const startDateMenu = ref(false);
const endDateMenu = ref(false);

const selected = ref<TableItem[]>([]);
const showStatusDialog = ref(false);
const selectedStatus = ref('');
const endDateError = ref('');
const statusError = ref('');

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
      // 检查原始数据的ID字段
      console.log('原始数据记录:', response.data.data.records);
      response.data.data.records.forEach((item: any, index: number) => {
        console.log(`原始记录 ${index + 1}:`, {
          id: item.id,
          idType: typeof item.id,
          hasId: 'id' in item,
          keys: Object.keys(item)
        });
      });
      
      // 处理数据格式
      tableData.value = response.data.data.records.map((item: any, index: number) => ({
        ...item,
        // 使用原始ID，确保ID存在
        id: Number(item.id),
        // 转换 userNames 数组为字符串
        userNames: Array.isArray(item.userNames) ? item.userNames.join(', ') : item.userNames,
        // 转换状态数字为中文
        statusText: getStatusText(item.status),
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
  
  // 将中文状态转换为数字
  const statusMap: { [key: string]: number } = {
    '待处理': 0,
    '处理中': 1,
    '已处理': 2
  };
  const status = statusMap[selectedStatus.value];
  const ids = Array.from(selected.value);

  try {
    const requestBody = { ids, status };
    await axiosInstance.post('/node-alert/updateStatus', requestBody);

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
  
  const ids = Array.from(selected.value);

  // 详细检查每个选中项目的ID
  selected.value.forEach((item, index) => {
    console.log(`选中项目 ${index + 1}:`, {
      id: item.id,
      idType: typeof item.id,
      nodeName: item.nodeName,
      recordTime: item.recordTime
    });
  });
  
  try {
    const requestBody = { ids };
    const response = await axiosInstance.post('/node-alert/deleteAlertRecord', requestBody);
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
  await fetchTableData(buildTableParams());
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
  await fetchTableData(buildTableParams());
};

// 处理状态变化
const handleStatusChange = async () => {
  // 验证状态必选
  if (!filters.value.status) {
    statusError.value = '请选择状态';
    return;
  }
  statusError.value = '';
  await fetchTableData(buildTableParams());
};

// 处理选择变化
const handleSelectionChange = (newSelected: TableItem[]) => {
  console.log('handleSelectionChange 被调用');
  console.log('新的选中项目:', newSelected);
  console.log('新的选中数量:', newSelected.length);
  
  // 详细检查每个选中项目的ID
  newSelected.forEach((item, index) => {
    console.log(`选中项目 ${index + 1}:`, {
      id: item.id,
      idType: typeof item.id,
      nodeName: item.nodeName,
      recordTime: item.recordTime
    });
  });
  
  selected.value = newSelected;
};

async function fetchNodeOptions() {
  const response = await axiosInstance.get('/node-alert/getUserNodeName');
  nodeOptions.value = response.data.data;
}

onMounted(() => {
  // 设置默认状态为"待处理"
  filters.value.status = '待处理';
  fetchNodeOptions();
  fetchTableData({ page: 3, size: 5, status: 0 });
});

</script>
  
<style scoped>
.modern-alarm-bg {
  background: #e0e4ec42;
/* background: linear-gradient(135deg, #e3f2fd 0%, #f8fdff 100%); */
overflow: hidden;
}

.gap-2 {
  gap: 8px;
}

.table-title {
  font-size: 18px;
  font-weight: 600;
  color: #1976d2;
}

::v-deep .v-data-table__td {
  border-bottom: 1px solid #000000 !important;
}
</style>