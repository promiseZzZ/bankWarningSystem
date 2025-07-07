<template>
  <div class="line-chart-container">
    <v-chart
      :option="chartOptions"
      :autoresize="true"
      style="width: 100%; height: 100%;"
    />
    <slot name="extra"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults } from 'vue'
import { use } from 'echarts/core'
import VChart from 'vue-echarts'
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  LineChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
])

interface LineChartProps {
  xData: string[] | number[]
  series: Array<{
    name: string
    data: number[]
  }>
  title?: string
  yAxisName?: string
  xAxisName?: string
  smooth?: boolean
  visualMap?: any
}

const props = withDefaults(defineProps<LineChartProps>(), {
  xData: () => [],
  series: () => [],
  title: '',
  yAxisName: '',
  xAxisName: '',
  smooth: true
})

const chartOptions = computed(() => ({
  title: {
    text: props.title || '',
    left: 'center'
    
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    show: false,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    name: props.xAxisName || '',
    data: props.xData,
  },
  yAxis: {
    type: 'value',
    name: props.yAxisName || ''
  },
  visualMap: props.visualMap,
  series: props.series.map(s => ({
    name: s.name,
    type: 'line',
    data: s.data,
    smooth: props.smooth,
  }))
}))
</script>

<style scoped>
.line-chart-container {
  width: 100%;
  height: 100%;
  min-height: 180px;
  position: relative;
}
</style>
