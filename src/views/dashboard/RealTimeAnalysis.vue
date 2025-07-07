<template>
  <v-container fluid class="pa-6 modern-offline-bg" >
    <!-- 上部分地图和折线图 -->
    <v-row>
          <v-col cols="8" >
              <v-card class="pa-6 modern-card elevation-8" height="500" hover>
                  <div class="fill-height d-flex align-center justify-center grey--text ">
                    <ChinaMap :geoJson="ChinaMapJson" :data="mapData" />
                  </div>
              </v-card>
          </v-col>
          <v-col cols="4" class="d-flex flex-column justify-space-between">
            <v-card height="100" class="modern-card elevation-8" hover >
              <v-card-subtitle class="subtitle">最近10秒数据</v-card-subtitle>
              <div class="indicator-panel">
                <v-row align="center" justify="space-around">
                  <v-col class="indicator-cell">
                    <span class="indicator-cell-title">ATM交易金额</span>
                    <span class="indicator-cell-value">{{ atmData.amount }}</span>
                  </v-col>
                  <v-col class="indicator-cell">
                    <span class="indicator-cell-title">ATM交易笔数</span>
                    <span class="indicator-cell-value">{{ atmData.count }}</span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="indicator-cell">
                    <span class="indicator-cell-title">外汇交易金额</span>
                    <span class="indicator-cell-value">{{ FXData.amount }}</span>
                  </v-col>
                  <v-col class="indicator-cell">
                    <span class="indicator-cell-title">外汇交易笔数</span>
                    <span class="indicator-cell-value">{{ FXData.count }}</span>
                  </v-col>
                </v-row>
              </div>
            </v-card>
              <v-card class="mb-4 modern-card elevation-8" height="180" hover>
                  <div class="fill-height d-flex align-center justify-center grey--text">
                    <LineChart title="ATM交易金额"
                    :xData="lineData1.xData"
                    :series="[{name: 'ATM', data: lineData1.series}]"
                    />
                  </div>
              </v-card>
              <v-card  class="modern-card elevation-8"  height="180" hover>
                  <div class="fill-height d-flex align-center justify-center grey--text">
                    <LineChart title="外汇交易金额"
                    :xData="lineData2.xData"
                    :series="[{name: 'FX', data: lineData2.series}]"
                    />
                  </div>
              </v-card>
          </v-col>
      </v-row>

      <!-- 下部分饼图 -->
      <v-row class="mt-6">
          <v-col cols="4">
              <v-card height="200" class="d-flex flex-column modern-card elevation-8" hover>
                <PieChart :data="piedata1" title="全国外汇交易用途分布" />
              </v-card>    
          </v-col>
          <v-col cols="4">
              <v-card height="200" class="d-flex align-center justify-center modern-card elevation-8" hover>
                <PieChart :data="piedata2" title="全国外汇交易年龄分布" />
               </v-card>    
           </v-col>
           <v-col cols="4">
               <v-card height="200" class="d-flex align-center justify-center modern-card elevation-8" hover>
                <PieChart :data="piedata3" title="全国外汇交易币种分布" />
               </v-card>    
           </v-col>
      </v-row>
  </v-container>
</template>


  <script lang="ts" setup>
  import { axiosInstance } from '../../utils/request';
  import { ref, onMounted, onUnmounted } from 'vue';
  import PieChart from '../../components/charts/PieChart.vue';
  import LineChart from '../../components/charts/LineChart.vue';
  import ChinaMap from '../../components/charts/ChinaMap.vue';
  import  ChinaMapJson  from '../../assets/china.json';


  // panel数据
  const atmData = ref({
    amount: 0,
    count: 0,
  });
  const FXData = ref({
    amount: 0,
    count: 0,
  });

  // 地图数据
  const mapData = ref([]);

  //折线图数据
  const lineData1 = ref<{
    xData: string[],
    series: number[]
  }>({
    xData: [],
    series: []
  });
  const lineData2 = ref<{
    xData: string[],
    series: number[]
  }>({
    xData: [],
    series: []
  });

  //饼图数据
  const piedata1 = ref([]);
  const piedata2 = ref([]);
  const piedata3 = ref([]);

  async function fetchPanelData(transactionType: string) {
    try {
      const response = await axiosInstance.post('/realtime/getNationCount', {
        transactionType: transactionType
      });
      if(response.data && transactionType === 'ATM') {
        atmData.value.count = response.data.data;
      } else if(response.data && transactionType === 'FX') {
        FXData.value.count = response.data.data;
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  }

  async function fetchMapData() {
    try {
      const response = await axiosInstance.get('/realtime/getProvince');
      if(response.data) {
        mapData.value = response.data.data;
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  }

  async function fetchLineDataInit(transactionType: string) {
    try {
      const response = await axiosInstance.post('/realtime/getNationAmount', {
        transactionType: transactionType
      });
      if(response.data && response.data.data && transactionType === 'ATM') {
        lineData1.value.xData = response.data.data.xdata;
        lineData1.value.series = response.data.data.data;
        atmData.value.amount = response.data.data.data[response.data.data.data.length - 1];
        console.log(atmData.value.amount);
      } else if(response.data && response.data.data && transactionType === 'FX') {
        lineData2.value.xData = response.data.data.xdata;
        lineData2.value.series = response.data.data.data;
        FXData.value.amount = response.data.data.data[response.data.data.data.length - 1];
        console.log(FXData.value.amount);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  }


  async function fetchLineData(transactionType: string) {
    try {
      const response = await axiosInstance.post('/realtime/getNationAmount', {
        transactionType: transactionType
      });
      if(response.data && response.data.data && transactionType === 'ATM') {
        // 检查数据是否相同，如果相同则不更新
        const latestXData = response.data.data.xdata[response.data.data.xdata.length - 1];
        const latestSeriesData = response.data.data.data[response.data.data.data.length - 1];
        
        if (lineData1.value.xData[lineData1.value.xData.length - 1] !== latestXData && 
            lineData1.value.series[lineData1.value.series.length - 1] !== latestSeriesData) {
          lineData1.value.xData.shift();
          lineData1.value.series.shift();
          lineData1.value.xData.push(latestXData);
          lineData1.value.series.push(latestSeriesData);
          atmData.value.amount = latestSeriesData;
        }
      } else if(response.data && response.data.data && transactionType === 'FX') {
        // 检查数据是否相同，如果相同则不更新
        const latestXData = response.data.data.xdata[response.data.data.xdata.length - 1];
        const latestSeriesData = response.data.data.data[response.data.data.data.length - 1];
        
        if (lineData2.value.xData[lineData2.value.xData.length - 1] !== latestXData && 
            lineData2.value.series[lineData2.value.series.length - 1] !== latestSeriesData) {
          lineData2.value.xData.shift();
          lineData2.value.series.shift();
          lineData2.value.xData.push(latestXData);
          lineData2.value.series.push(latestSeriesData);
          FXData.value.amount = latestSeriesData;
        }
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  } 

  async function fetchPieData1() {
    try {
      const response = await axiosInstance.get('/realtime/getPurpose');
      if(response.data) {
        piedata1.value = response.data.data;
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  }

  async function fetchPieData2() {
    try {
      const response = await axiosInstance.get('/realtime/getAgeRange');
      if(response.data) {
        piedata2.value = response.data.data;
      }
    } catch (error) { 
      console.error('获取数据失败:', error);
    }
  }

  async function fetchPieData3() {
    try {
      const response = await axiosInstance.get('/realtime/getCurrency');
      if(response.data) {
        piedata3.value = response.data.data;
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  }

  function initData() {
    fetchPanelData('ATM');
    fetchPanelData('FX');
    fetchMapData();
    fetchPieData1();
    fetchPieData2();
    fetchPieData3();
    fetchLineDataInit('ATM');
    fetchLineDataInit('FX');
  }

  // 更新数据
  function updateData() {
    fetchPanelData('ATM');
    fetchPanelData('FX');
    fetchMapData();
    fetchPieData1();
    fetchPieData2();
    fetchPieData3();
    fetchLineData('ATM');
    fetchLineData('FX');
  }

  // 定时器
  let timer: number | undefined;
  onMounted(() => {
    initData();
    
    // 每20秒请求一次数据，实现动态刷新
    timer = window.setInterval(() => {
      updateData();
    }, 5000);
  });

  onUnmounted(() => {
    if(timer) {
      clearInterval(timer);
    }
  });

  </script>

<style scoped>
.modern-offline-bg {
  background: #e0e4ec42;
  min-height: 100%;
  overflow: hidden;
}
.modern-card {
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(33, 150, 243, 0.10);
  background: #fff;
  transition: box-shadow 0.2s;
}

.subtitle {
  font-size: 0.8rem;
  color:#000000;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
}
  
.indicator-panel {
  width: 100%;
  height: 100%;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.indicator-cell {
  text-align: center;
}
.indicator-cell-title {
  color: #000000;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-left: 5px;
  margin-bottom: 10px;
  margin-right: 5px;

}
.indicator-cell-value {
  font-size: 16px;
  font-weight: bold;
  color: #1976d2;
  text-shadow: 0 2px 8px #729ac2;
  line-height: 1;
  margin-bottom: 2px;
}
.indicator-unit {
  font-size: 18px;
  color: #fff;
  margin-left: 2px;
  font-weight: normal;
}
</style>