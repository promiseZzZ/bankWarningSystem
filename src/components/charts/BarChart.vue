<template>
  <div ref="chartRef" :style="{ width: '100%', height: '100%' }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import * as echarts from 'echarts'

interface ChartData {
  name: string
  value: number
}

interface Props {
  data: ChartData[]
  title?: string
  xAxisName?: string
  yAxisName?: string
  color?: string[]
  direction?: 'horizontal' | 'vertical' // 新增方向配置：horizontal为水平条形图，vertical为垂直条形图
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  title: '',
  xAxisName: '',
  yAxisName: '',
  color: () => ['#0c77b9'],
  direction: 'horizontal' // 默认为水平条形图
})

const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

// 按数据大小降序排列
const sortedData = computed(() => {
  return [...props.data].sort((a, b) => a.value - b.value)
})

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  updateChart()
}

// 更新图表数据
const updateChart = () => {
  if (!chartInstance) return

  let option: echarts.EChartsOption

  if (props.direction === 'horizontal') {
    // 水平条形图：x轴为数值，y轴为种类
    option = {
      title: {
        text: props.title,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const data = params[0]
          return `${data.name}: ${data.value}`
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: props.xAxisName,
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
          fontSize: 12
        }
      },
      yAxis: {
        type: 'category',
        name: props.yAxisName,
        nameLocation: 'middle',
        nameGap: 50,
        data: sortedData.value.map(item => item.name),
        axisLabel: {
          fontSize: 12,
          width: 80,
          overflow: 'truncate'
        }
      },
      series: [
        {
          name: '数值',
          type: 'bar',
          data: sortedData.value.map(item => item.value),
          itemStyle: {
            color: (params: any) => {
              return props.color[params.dataIndex % props.color.length]
            }
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}'
          }
        }
      ]
    }
  } else {
    // 垂直条形图：x轴为种类，y轴为数值
    option = {
      title: {
        text: props.title,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const data = params[0]
          return `${data.name}: ${data.value}`
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        name: props.xAxisName,
        nameLocation: 'middle',
        nameGap: 30,
        data: sortedData.value.map(item => item.name),
        axisLabel: {
          fontSize: 12,
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: props.yAxisName,
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          fontSize: 12
        }
      },
      series: [
        {
          name: '数值',
          type: 'bar',
          data: sortedData.value.map(item => item.value),
          itemStyle: {
            color: (params: any) => {
              return props.color[params.dataIndex % props.color.length]
            }
          },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}'
          }
        }
      ]
    }
  }

  chartInstance.setOption(option)
}

// 监听数据变化
watch(() => props.data, () => {
  nextTick(() => {
    updateChart()
  })
}, { deep: true })

// 监听窗口大小变化
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* 图表容器样式 */
</style>