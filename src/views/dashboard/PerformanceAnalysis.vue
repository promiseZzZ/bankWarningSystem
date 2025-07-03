<template>
  <v-container fluid class="pa-6 modern-analysis-bg">
    <!-- 顶部统计卡片 -->
    <v-row class="mb-6" dense>
      <v-col cols="3" v-for="(item, idx) in statCards" :key="idx">
        <v-card class="pa-4 modern-card" height="120" elevation="8" hover>
          <div class="stat-title">{{ item.title }}</div>
          <div class="stat-value">{{ item.value }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- 中间两个柱状图 -->
    <v-row class="mb-6" dense>
      <v-col cols="6">
        <v-card class="pa-4 modern-card" height="260" elevation="8" hover>
          <!-- 替换为你的BarChart组件 -->
          <BarChart :data="barData1" title="警告次数分布" />  
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card class="pa-4 modern-card" height="260" elevation="8" hover>
          <BarChart :data="barData2" title="超阈值时长分布" />
        </v-card>
      </v-col>
    </v-row>

    <!-- 底部表格 -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4 modern-card" elevation="8" hover>
 <!--         <v-data-table-server
          :items-length="tableData.length"
          :items="tableData"
          :headers="tableHeaders"
          :items-per-page="10"
          :page="1"
          :sort-by="['name']"
          :sort-desc="false"
         ></v-data-table-server> -->
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import BarChart from '../../components/charts/BarChart.vue';

// 顶部统计卡片数据
const statCards = ref([
  { title: '警告次数最多节点:', value: '' },
  { title: '平均响应时间最长节点:', value: '' },
  { title: '响应时间峰值最大节点:', value: '' },
  { title: '超阈值时长最长节点:', value: '' }
]);

// 柱状图数据
const barData1 = ref([]);
const barData2 = ref([]);

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
  font-size: 22px;
  color: #1976d2;
  font-weight: bold;
}
</style>