<template>
    <div class="stacked-line-chart-wrap">
      <div class="chart-title" v-if="title">{{ title }}</div>
      <v-chart :option="option" autoresize class="stacked-line-echart" />
    </div>
</template>
  
<script setup lang="ts">
  import { defineProps, computed } from 'vue'
  import VChart from 'vue-echarts'
  
  interface SeriesItem {
    name: string
    data: number[]
    // 可扩展更多配置
  }
  
  const props = defineProps<{
    title?: string
    xAxis: string[]
    series: SeriesItem[]
    colors?: string[]
  }>()
  
  const option = computed(() => ({
    color: props.colors || ['#5470C6', '#91CC75', '#FAC858', '#EE6666'],
    tooltip: { trigger: 'axis' },
    legend: { top: 10, data: props.series.map(s => s.name) },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true},
    xAxis: { type: 'category', boundaryGap: false, data: props.xAxis },
    yAxis: { type: 'value' },
    visualMap: {
      show: false,
      dimension: 1,
      pieces: [
        {
          lt: 1500,
          color: '#27ae60'
        },
        {
          gt: 1500,
          lt: 2000,
          color: '#ffc107'
        },
        {
          gt: 2000,
          color: '#e74c3c'
        }
      ]
    },
    series: props.series.map(s => ({
      ...s,
      type: 'line',
      smooth: false,
      emphasis: { focus: 'series' }
    }))
  }))
</script>
  
<style scoped>
  .stacked-line-chart-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .chart-title {
    font-size: 20px;
    font-weight: 650;
    margin-left: 10px;
    margin-bottom: 8px;
    text-align: center;
    width: 100%;
  }
  .stacked-line-echart {
    width: 100%;
    height: 220px;
    min-height: 120px;
  }
</style>