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
    color: props.colors || ['#007bff', '#dc3545', '#ffc107', '#28a745', '#6c757d', '#343a40'],
    labelLine: {show: false},
    label: {show: false},
    tooltip : {trigger: 'item'},
    legend: {top:0, right:0, orient: 'vertical'},
    series: [{
        name: props.title,
        type: 'pie',
        labelLine: {show: false},
        label: {show: false},
        radius: ['30%', '70%'],
        data: props.data
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