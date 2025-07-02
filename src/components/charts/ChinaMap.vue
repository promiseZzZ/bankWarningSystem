<template>
    <div class="china-map-wrap">
        <v-chart :option="option" autoresize class="china-map-echart" @click="onMapClick"/>
    </div>
</template>

<script setup lang="ts">
import { defineProps, computed,  onMounted } from 'vue';
import VChart from 'vue-echarts';
import * as echarts from 'echarts';

const emit = defineEmits(['provinceClick']);

const props = defineProps<{
    geoJson: any,
    data: Array<{name: string, value: number}>
}>();

const option = computed(() => ({
  title: {
    text: '外汇买入全国分布',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c}'
  },

  visualMap: {
    min: 0,
    max: 1000000,
    left: 'left',
    top: 'bottom',
    text: ['高', '低'],
    inRange: { color: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4'] },
    show: true
  },
  series: [
    {
      itemStyle: {
        areaColor: '#FFFFFF',
        borderColor: '#009ce0',
        borderWidth: 0.5,
      },
      zoom:1.8,
      center: [104.114129, 37.550339],
      emphasis: {
        itemStyle: {
          areaColor: '#009ce0',
          borderColor: '#009ce0',
          borderWidth: 0.5
        }
      },
      name: '省份数据',
      type: 'map',
      map: 'china',
      roam: true,
      label: { show: true },
      data: props.data
    }
  ]
}))


//注册地图
onMounted(() => {
    if (!echarts.getMap('china')) {
        echarts.registerMap('china', props.geoJson);
    }
});

function onMapClick(params: any){
    if (params && params.name) {
    emit('provinceClick', params.name)
  }
}
</script>

<style scoped>
.china-map-wrap {
  width: 100%;
  height: 100%;
}
.china-map-echart {
  width: 100%;
  height: 420px;
  min-height: 300px;
}
</style>