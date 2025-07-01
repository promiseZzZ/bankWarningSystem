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
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: props.xAxis },
    yAxis: { type: 'value' },
    series: props.series.map(s => ({
      ...s,
      type: 'line',
      stack: 'Total',
      areaStyle: {},
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
    font-weight: bold;
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