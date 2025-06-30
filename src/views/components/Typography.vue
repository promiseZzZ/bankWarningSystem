<template>
  <div class="container">
    <!-- 搜索表单 -->
    <a-form layout="inline" :model="searchParams" class="search-form">
      <a-form-item label="新闻名称">
        <a-input v-model:value="searchParams.newsName" placeholder="请输入新闻名称" />
      </a-form-item>
      <a-form-item label="起始时间">
        <a-date-picker 
          v-model:value="searchParams.startTime" 
          format="YYYY-MM-DD"
          placeholder="选择起始时间"
        />
      </a-form-item>
      <a-form-item label="结束时间">
        <a-date-picker 
          v-model:value="searchParams.endTime" 
          format="YYYY-MM-DD"
          placeholder="选择结束时间"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleSearch">查询</a-button>
        <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
      </a-form-item>
    </a-form>

    <a-table 
      :columns="columns" 
      :data-source="dataSource" 
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-button type="link" @click="showDetail(record)">查看新闻检测</a-button>
        </template>
        <template v-else-if="column.key === 'processTime'">
          {{ formatDate(record.processTime) }}
        </template>
        <template v-else-if="column.key === 'result'">
          <span :style="{color: record.result === 1 ? '#52c41a' : '#ff4d4f',fontWeight: 500}">
            {{ record.result === 1 ? '真' : '假' }}
          </span>
        </template>
      </template>
    </a-table>

    <!-- 检测结果模态框 -->
    <a-modal 
      v-model:visible="detailVisible" 
      title="新闻检测详情" 
      width="50%"
      :footer="null"
    >
      <div v-for="(item, index) in currentContent" :key="index" class="result-item">
        <p class="content-text">
          <span 
            v-for="(word, wordIndex) in item.text.split(' ')" 
            :key="wordIndex"
            :style="{ color: item.textwrong[wordIndex] ? 'red' : 'black' }"
          >
            {{ word }}&nbsp;
          </span>
        </p>
        <img 
          :src="getImageUrl(item.image)" 
          style="max-width: 100%; margin: 10px 0;"
        />
        <a-divider />
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { axiosInstance } from '../../utils/request';

interface ProjectRecord {
  pid: number;
  newsName: string;
  processTime: string;
  content: ContentItem[];
  result: string;
}

interface ContentItem {
  id: number;
  image: string;
  text: string;
  textwrong: number[];
}

interface SearchParams {
  newsName: string;
  startTime?: string | null;
  endTime?: string | null;
  [key: string]: any; // 添加索引签名，允许字符串索引
}

// 表格列配置
const columns = [
  {
    title: '新闻名称',
    dataIndex: 'newsName',
    key: 'newsName',
  },
  {
    title: '处理时间',
    key: 'processTime',
  },
  {
    title: '检测结果',
    dataIndex: 'result',
    key: 'result',
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
  },
];

// 响应式数据
const dataSource = ref<ProjectRecord[]>([]);
const loading = ref(false);
const detailVisible = ref(false);
const currentContent = ref<ContentItem[]>([]);
const currentPid = ref<number>(0);

// 搜索参数
const searchParams = reactive<SearchParams>({
  newsName: '',
  startTime: null,
  endTime: null
});

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showTotal: (total: any) => `共 ${total} 条`,
  pageSizeOptions: ['10', '20', '50'],
});

// 获取数据
const fetchData = async () => {
  try {
    loading.value = true;
    
    // 格式化时间参数
    const params: SearchParams = {
      ...searchParams,
      startTime: searchParams.startTime ? dayjs(searchParams.startTime).format('YYYY-MM-DD') : undefined,
      endTime: searchParams.endTime ? dayjs(searchParams.endTime).format('YYYY-MM-DD') : undefined
    };
    
    // 移除值为空的参数
    (Object.keys(params) as Array<keyof SearchParams>).forEach(key => {
      if (params[key] === undefined || params[key] === '' || params[key] === null) {
        delete params[key];
      }
    });

    const response = await axiosInstance.post(`/project/list/${pagination.pageSize}/${pagination.current}`, params);
    console.log('API Response:', response);
    dataSource.value = response.data.records;
    pagination.total = response.data.total;
  } catch (error) {
    message.error('数据加载失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 分页变化处理
const handleTableChange = (pag: { current: number; pageSize: number }) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  fetchData();
};

// 查询处理
const handleSearch = () => {
  pagination.current = 1; // 重置到第一页
  fetchData();
};

// 重置查询
const resetSearch = () => {
  searchParams.newsName = '';
  searchParams.startTime = null;
  searchParams.endTime = null;
  handleSearch();
};

// 显示详情
const showDetail = (record: ProjectRecord) => {
  currentPid.value = record.pid;  // 保存当前项目的pid
  currentContent.value = record.content;
  detailVisible.value = true;
};

// 图片地址处理
const getImageUrl = (imagePath: string) => {
  const fileName = imagePath.split('/').pop();
  return `http://172.20.10.12:8081/images/p${currentPid.value}/${fileName}`;
};

// 日期格式化
const formatDate = (dateString: string) => {
  return dayjs(dateString).format('YYYY-MM-DD');
};

// 初始化加载数据
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.container {
  padding: 20px;
}

/* 搜索表单样式 */
.search-form {
  margin-bottom: 20px;
}

/* 表单项标签样式 */
:deep(.ant-form-item-label > label) {
  font-size: 20px !important;  /* 标签字体变大 */
  color: #333;
}

/* 输入框样式 */
:deep(.ant-input), 
:deep(.ant-picker-input > input) {
  font-size: 20px !important;  /* 输入内容字体 */
  height: 38px;
}

/* 表格整体样式 */
:deep(.ant-table) {
  font-size: 20px !important;  /* 表格基础字体 */
}

/* 表头样式 */
:deep(.ant-table-thead > tr > th) {
  font-size: 20px !important;  /* 表头字体加大 */
  font-weight: 600;
  color: #333;
  background-color: #fafafa !important;
}

/* 表格内容样式 */
:deep(.ant-table-tbody > tr > td) {
  font-size: 20px !important;  /* 表格内容字体 */
  color: #666;
}

/* 操作按钮样式 */
:deep(.ant-btn-link) {
  font-size: 20px !important;  /* 操作按钮字体 */
}

.result-item {
  margin-bottom: 20px;
}

.content-text {
  font-size: 20px !important;  /* 详情模态框字体 */
  line-height: 1.6;
  margin: 10px 0;
}

/* 调整分页器文字 */
:deep(.ant-pagination-item),
:deep(.ant-pagination-prev),
:deep(.ant-pagination-next),
:deep(.ant-select-selector) {
  font-size: 14px !important;
}

.search-form :deep(.ant-btn) {
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.3s;
}

/* 查询按钮 */
.search-form :deep(.ant-btn-primary) {
  font-size: 16px;
  background: #1890ff;
  border-color: #1890ff;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
}

/* 重置按钮 */
.search-form :deep(.ant-btn:not(.ant-btn-primary)) {
  font-size: 16px;
  color: #666;
  border-color: #d9d9d9;
}

/* 悬停效果 */
.search-form :deep(.ant-btn-primary:hover),
.search-form :deep(.ant-btn-primary:focus) {
  background: #40a9ff;
  border-color: #40a9ff;
}

.search-form :deep(.ant-btn:not(.ant-btn-primary):hover) {
  color: #1890ff;
  border-color: #1890ff;
}
</style>