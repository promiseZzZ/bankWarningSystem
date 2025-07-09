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
    color: props.colors || [
      '#1976D2', // 主蓝色
      '#42A5F5', // 浅蓝色
      '#64B5F6', // 天蓝色
      '#90CAF9', // 淡蓝色
      '#BBDEFB', // 极浅蓝
      '#2196F3', // 标准蓝
      '#1E88E5', // 深蓝色
      '#1565C0'  // 更深蓝
    ],
    tooltip: { 
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e0e0e0',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      }
    },
    legend: { 
      top: 10, 
      data: props.series.map(s => s.name),
      textStyle: {
        color: '#666',
        fontSize: 12
      },
      itemGap: 12
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true},
    xAxis: { 
      type: 'category', 
      boundaryGap: false, 
      data: props.xAxis,
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: { 
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisLabel: {
        color: '#666'
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0'
        }
      }
    },
    visualMap: {
      show: false,
      dimension: 1,
      pieces: [
        {
          lt: 1500,
          color: '#1976D2' // 正常状态 - 蓝色
        },
        {
          gt: 1500,
          lt: 2000,
          color: '#FF9800' // 警告状态 - 橙色
        },
        {
          gt: 2000,
          color: '#F44336' // 异常状态 - 红色
        }
      ]
    },
    series: props.series.map(s => ({
      ...s,
      type: 'line',
      smooth: true,
      emphasis: { 
        focus: 'series',
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(25, 118, 210, 0.3)'
        }
      },
      lineStyle: {
        width: 2
      },
      itemStyle: {
        borderWidth: 2,
        borderColor: '#fff'
      }
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