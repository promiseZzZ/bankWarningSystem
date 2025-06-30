<template>
  <div class="container">
    <a-upload-dragger
      v-model:fileList="fileList"
      class="uploadfile"
      name="file"
      :multiple="false"
      accept=".doc,.docx"
      :action="uploadAction"
      :headers="headers"
      :before-upload="beforeUpload"
      @change="handleUploadChange"
    >
      <p class="ant-upload-drag-icon">
        <inbox-outlined></inbox-outlined>
      </p>
      <br>
      <p class="ant-upload-text" style="font-size: 30px;">Click or drag Word file to upload</p>
      <br><br><br><br>
      <p class="ant-upload-hint" style="font-size: 20px;">
        Support for single Word document upload. Strictly prohibit uploading sensitive data.
        <br>Filename must contain project Name
      </p>
      <br><br>
    </a-upload-dragger>

    <a-button 
      type="primary" 
      :disabled="!fileList.length || uploading || !hasValidPid"
      @click="handleDetection"
      style="margin-top: 20px;"
      :loading="detecting"
    >
      Start Detection
    </a-button>

    <!-- 结果展示模态框 -->
    <a-modal 
      v-model:visible="visible" 
      title="Detection Results" 
      width="50%"
      :footer="null"
    >
     <a-spin :spinning="resultLoading">
      <div v-for="(item, index) in currentResult.content" :key="index" class="result-item">
        <div class="highlight-text">
          <span 
            v-for="(word, wordIndex) in item.text.split(' ')" 
            :key="wordIndex"
            :style="{ color: item.textwrong[wordIndex] ? 'red' : 'black' }"
          >
            {{ word }}&nbsp;
          </span>
        </div>
        <img 
          :src="`http://172.20.10.12:8081/images/p${currentPid}/${item.image.split('/').pop()}`" 
          style="max-width: 100%; margin: 10px 0;"
        />
        <a-divider />
        </div>
      </a-spin>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadChangeParam, UploadFile } from 'ant-design-vue';
import { useUserStore } from '../../store/user';

interface ContentItem {
  id: number;
  image: string;
  text: string;
  textwrong: number[];
}

interface ProjectResult {
  pid: number;
  userid: number;
  newsName: string;
  processTime: string;
  content: ContentItem[];
}

const resultLoading = ref(false);
const visible = ref(false);
const fileList = ref<UploadFile[]>([]);
const uploading = ref(false);
const detecting = ref(false);
const currentPid = ref<number>(0);
const currentResult = ref<ProjectResult>({
  pid: 0,
  userid: 0,
  newsName: '',
  processTime: '',
  content: []
});

const userStore = useUserStore();
const uploadAction = ref('http://172.20.10.12:8081/file/upload');
const headers = computed(() => ({
  Authorization: userStore.token || ''
}));

// 计算属性检查文件名是否包含有效的PID
const hasValidPid = computed(() => {
  if (!fileList.value.length) return false;
  const filename = fileList.value[0].name;
  const pidPart = filename.split('.')[0].split('_')[0];
  return !isNaN(Number(pidPart)) && Number(pidPart) > 0;
});

const beforeUpload = (file: UploadFile) => {
  if (!userStore.token) {
    message.error('请先登录');
    return false;
  }
  
  const filename = file.name;
  const pidPart = filename.split('.')[0].split('_')[0];
  const pid = Number(pidPart);
  
  if (isNaN(pid)) {
    message.error('文件名必须包含项目ID (如: "123_document.docx")');
    return false;
  }
  
  currentPid.value = pid;
  return true;
};

const handleUploadChange = (info: UploadChangeParam) => {
  if (info.file.status === 'uploading') {
    uploading.value = true;
    return;
  }
  
  if (info.file.status === 'done') {
    uploading.value = false;
    if (info.file.response) {
      currentResult.value = info.file.response.records[0];
      message.success('文件上传成功');
    }
  } else if (info.file.status === 'error') {
    uploading.value = false;
    message.error(info.file.response?.message || '文件上传失败');
  }
};

const handleDetection = async () => {
  if (!fileList.value.length || !hasValidPid.value) return;
  detecting.value = true;
  resultLoading.value = true; // 开启结果加载状态
  try {
    if (currentResult.value.content?.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      visible.value = true;
      message.success('检测完成');
    } else {
      message.error('请先上传文件并等待上传完成');
    }
  } catch (error: any) {
    message.error('检测失败: ' + (error.message || '服务器错误'));
    console.error('检测失败:', error);
  } finally {
    detecting.value = false;
    resultLoading.value = false; // 关闭结果加载状态
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
}

.uploadfile {
  height: 500px;
  width: 1000px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.result-item {
  margin-bottom: 30px;
}

.highlight-text {
  font-size: 16px;
  line-height: 1.8;
  white-space: pre-wrap;
}

.ant-btn-primary {
  height: 40px;
  padding: 0 30px;
  font-size: 16px;
}
</style>