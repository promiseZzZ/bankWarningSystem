<template>
    <v-container fluid class="pa-6" >
        <v-row>
            <v-col cols="8" >
                <v-card class="pa-6" height="500">
                    <div class="fill-height d-flex align-center justify-center grey--text text-h4">
                        地图
                    </div>
                </v-card>
            </v-col>
            <v-col cols="4" class="d-flex flex-column justify-space-between">
                <v-card class="mb-6" height="240">
                    <div class="fill-height d-flex align-center justify-center grey--text">
                        <StackedLineChart :xAxis="xAxis1" :series="series1" title="折线图1" />
                    </div>
                </v-card>
                <v-card height="240">
                    <div class="fill-height d-flex align-center justify-center grey--text">
                        <StackedLineChart :xAxis="xAxis2" :series="series2" title="折线图2" />
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mt-6">
            <v-col cols="4">
                <v-card height="200" class="d-flex flex-column ">
                    <PieChart :data="pieData1" title="测试1" />
                </v-card>    
            </v-col>
            <v-col cols="4">
                <v-card height="200" class="d-flex align-center justify-center ">
                    <PieChart :data="pieData2" title="测试2" />
                </v-card>    
            </v-col>
            <v-col cols="4">
                <v-card height="200" class="d-flex align-center justify-center ">
                    <PieChart :data="pieData3" title="测试3" />
                </v-card>    
            </v-col>
        </v-row>
    </v-container>
  </template>
  
  <script lang="ts" setup>
  import PieChart from '../../components/charts/PieChart.vue';
  import StackedLineChart from '../../components/charts/StackedLineChart.vue';
  import {ref, onMounted} from 'vue';
  import axios from 'axios';

  // 饼图数据
  const pieData1 = ref<any[]>([])
  const pieData2 = ref<any[]>([])
  const pieData3 = ref<any[]>([])
  // 折线图数据
  const xAxis1 = ref<string[]>([])
  const series1 = ref<any[]>([])
  const xAxis2 = ref<string[]>([])
  const series2 = ref<any[]>([])

  // 折线图请求函数
  export async function fetchLineChartData(apiUrl: string, xAxisRef: any, seriesRef: any) {
    try {
      const res = await axios.get(apiUrl)
      xAxisRef.value = res.data.xAxis
      seriesRef.value = res.data.series
    } catch (error) {
      xAxisRef.value = []
      seriesRef.value = []
    }
  }
  // 饼图请求函数
  export async function fetchPieChartData(apiUrl: string, dataRef: any) {
    try {
      const res = await axios.get(apiUrl)
      dataRef.value = res.data
    } catch (error) {
      dataRef.value = []
    }
  }

  onMounted(async () => {
    // 折线图1
    await fetchLineChartData('/api/lineChartData1', xAxis1, series1)
    // 折线图2
    await fetchLineChartData('/api/lineChartData2', xAxis2, series2)
    // 饼图1
    await fetchPieChartData('/api/pieChartData1', pieData1)
    // 饼图2
    await fetchPieChartData('/api/pieChartData2', pieData2)
    // 饼图3
    await fetchPieChartData('/api/pieChartData3', pieData3)
  })
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