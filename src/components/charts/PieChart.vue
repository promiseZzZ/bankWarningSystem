<template>
  <div class="pie-chart-wrap">
    <div class="pie-title" v-if="title">{{ title }}</div>
    <v-chart :option="option" autoresize class="pie-echart"/>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import VChart from 'vue-echarts';

const props = defineProps<{
    title?: string
    data: Array<{value: number, name: string}>
    colors?: string[]
}>();

const option = computed(() => ({
    color: props.colors || [
    '#FF8C00', // 深橙
    '#4682B4', // 钢蓝
    '#3CB371', // 中等海洋绿
    '#C71585', // 中紫红
    '#FFD700'  // 金黄
],
    labelLine: {show: false},
    label: {show: false},
    tooltip : {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        textStyle: {
            color: '#333'
        },
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
        top: 0, 
        right: 0, 
        orient: 'vertical',
        textStyle: {
            color: '#666',
            fontSize: 12
        },
        itemGap: 8
    },
    series: [{
        name: props.title,
        type: 'pie',
        labelLine: {show: false},
        label: {show: false},
        radius: ['30%', '70%'],
        data: props.data,
        emphasis: {
            itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
        },
        itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2
        }
    }]
}))
</script>

<style scoped>
.pie-title {
  font-size: 18px;
  font-weight: bold;
  text-align: left;
  width: 100%;
  margin-left: 10px;
  margin-top: 10px; 
  margin-bottom: 8px;
  
}

.pie-chart-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.pie-echart {
  width: 100%;
  height: 140px; /* 你可以根据卡片高度调整 */
  min-height: 100px;
}
</style>