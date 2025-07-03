<template>
  <v-container fluid class="pa-6 modern-perf-bg">
    <!-- 顶部响应时间指标条 -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-6 modern-card" elevation="8" hover>
          <v-row align="center" justify="space-around">
            <v-col cols="auto">
              <div class="perf-item">
                <span class="perf-label">ATM01:</span>
                <span class="perf-value">32ms</span>
              </div>
            </v-col>
            <v-col cols="auto">
              <div class="perf-item">
                <span class="perf-label">ATM02:</span>
                <span class="perf-value">32ms</span>
              </div>
            </v-col>
            <v-col cols="auto">
              <div class="perf-item">
                <span class="perf-label">ATM03:</span>
                <span class="perf-value">32ms</span>
              </div>
            </v-col>
            <v-col cols="auto">
              <div class="perf-item warning">
                <span class="perf-label">ATM04:</span>
                <span class="perf-value">89ms</span>
              </div>
            </v-col>
            <v-col cols="auto">
              <div class="perf-item danger">
                <span class="perf-label">ATM05:</span>
                <span class="perf-value">220ms</span>
              </div>
            </v-col>
            <v-col cols="auto">
              <div class="perf-item">
                <span class="perf-label">FX:</span>
                <span class="perf-value">24ms</span>
              </div>
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
          <LineChart :xData="['2025-01-01', '2025-01-02', '2025-01-03', '2025-01-04', '2025-01-05', '2025-01-06', '2025-01-07']" :series="[{name: '平台1', data: [100, 200, 300,1000,300,400,100]}]" 
          :title="charts[0].title"
          />
          </div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card height="260" class="pa-6 modern-card" elevation="8" hover>
          <div class="fill-height d-flex align-center justify-center grey--text">
          <LineChart :xData="['2025-01-01', '2025-01-02', '2025-01-03', '2025-01-04', '2025-01-05', '2025-01-06', '2025-01-07']" :series="[{name: '平台1', data: [100, 200, 300,200,300,400,100]}]" 
          :title="charts[1].title"
          />
          </div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card height="260" class="pa-6 modern-card" elevation="8" hover>
          <div class="fill-height d-flex align-center justify-center grey--text">
          <LineChart :xData="['2025-01-01', '2025-01-02', '2025-01-03', '2025-01-04', '2025-01-05', '2025-01-06', '2025-01-07']" :series="[{name: '平台1', data: [100, 200, 300,200,300,400,100]}]" 
          :title="charts[2].title"
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
            <LineChart :xData="['2025-01-01', '2025-01-02', '2025-01-03', '2025-01-04', '2025-01-05', '2025-01-06', '2025-01-07']" :series="[{name: '平台1', data: [100, 200, 300,200,300,400,100]}]" 
            :title="charts[3].title"
            />
          </div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card height="260" class="pa-6 modern-card" elevation="8" hover>
          <div class="fill-height d-flex align-center justify-center grey--text">
          <LineChart :xData="['2025-01-01', '2025-01-02', '2025-01-03', '2025-01-04', '2025-01-05', '2025-01-06', '2025-01-07']" :series="[{name: '平台1', data: [100, 200, 300,200,300,400,100]}]" 
          :title="charts[4].title"
          />
          </div>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card height="260" class="pa-6 modern-card" elevation="8" hover>
          <div class="fill-height d-flex align-center justify-center grey--text"> 
          <LineChart :xData="['2025-01-01', '2025-01-02', '2025-01-03', '2025-01-04', '2025-01-05', '2025-01-06', '2025-01-07']" :series="[{name: '平台1', data: [100, 200, 300,200,300,400,100]}]" 
          :title="charts[5].title"
          />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import LineChart from '../../components/charts/LineChart.vue';
import { axiosInstance } from '../../utils/request';
import { ref, onMounted } from 'vue';
import StackedLineChart from '../../components/charts/StackedLineChart.vue';

const charts = [
  { title: 'ATMEntry响应时间' },
  { title: 'ATMService响应时间' },
  { title: 'CoreService响应时间' },
  { title: 'FXEntry响应时间' },
  { title: 'FXService响应时间' },
  { title: 'FXCoreService响应时间' }
];
</script>

<style scoped>
.modern-perf-bg {
  background: #e0e4ec42;
  min-height: 100vh;
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
}

.perf-item.warning .perf-value {
  color: #ff9800;
}

.perf-item.danger .perf-value {
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
</style>