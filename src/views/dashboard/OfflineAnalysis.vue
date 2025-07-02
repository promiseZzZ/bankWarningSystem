<template>
    <v-container fluid class="pa-6 modern-offline-bg">
        <v-menu :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn color="primary" v-bind="props">选择日期</v-btn>
          </template>
          <v-date-picker v-model="tempDate" @update:modelValue="onDateSelected" color="primary" />
        </v-menu>

        <v-row>
            <v-col cols="8">
                <v-card class="pa-6 modern-card" height="500" elevation="8" hover>
                    <div class="fill-height d-flex align-center justify-center grey--text">
                      <ChinaMap :geoJson="ChinaMapJson" :data="mapData" @provinceClick="getProvince" />
                    </div>
                </v-card>
            </v-col>
            <v-col cols="4" class="d-flex flex-column justify-space-between">
                <v-card class="mb-6 modern-card" height="240" elevation="8" hover>
                    <div class="fill-height d-flex align-center justify-center grey--text">
                      <BarChart :data="barData1" title="ATM交易金额分布" />
                    </div>
                </v-card>
                <v-card height="240" class="modern-card" elevation="8" hover>
                    <div class="fill-height d-flex align-center justify-center grey--text">
                      <BarChart :data="barData2" title="外汇买入金额分布"  />
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mt-6">
            <v-col cols="3">
                <v-card height="200" class="d-flex flex-column modern-card" elevation="8" hover>
                    <PieChart :data="pieData1" :title="pieTitle1" />
                </v-card>    
            </v-col>
            <v-col cols="3">
                <v-card height="200" class="d-flex align-center justify-center modern-card" elevation="8" hover>
                    <PieChart :data="pieData2" :title="pieTitle2" />
                 </v-card>    
             </v-col>
             <v-col cols="3">
                 <v-card height="200" class="d-flex align-center justify-center modern-card" elevation="8" hover>
                     <PieChart :data="pieData3" :title="pieTitle3" />
                 </v-card>    
             </v-col>
             <v-col cols="3">
                 <v-card height="200" class="d-flex align-center justify-center modern-card" elevation="8" hover>
                     <PieChart :data="pieData4" :title="pieTitle4" />
                </v-card>    
            </v-col>
        </v-row>
    </v-container>
  </template>
  
  
  <script lang="ts" setup>
  import PieChart from '../../components/charts/PieChart.vue';
  import ChinaMap from '../../components/charts/ChinaMap.vue';
  import BarChart from '../../components/charts/BarChart.vue';
  import ChinaMapJson from '../../assets/china.json';
  import {ref, onMounted} from 'vue';
  import {axiosInstance} from '../../utils/request';
  import {formatDate} from 'date-fns';
  import {useUserStore} from '../../store/user';
  
  
  //测试数据
  const currentDate = ref(formatDate(new Date(2025, 6, 1), 'yyyy-MM-dd'));

  // 地图数据
  const mapData = ref([{name: '', value: 0}]);

  // 柱状图数据
  const barData1 = ref([]);

  const barData2 = ref([]);

     // 饼图数据
   const pieData1 = ref([{name: '', value: 0}]);
   const pieData2 = ref([{name: '', value: 0}]);
   const pieData3 = ref([{name: '', value: 0}]);
   const pieData4 = ref([{name: '', value: 0}]);

   // 饼图标题
   const pieTitle1 = ref('全国外汇交易平台分布');
   const pieTitle2 = ref('全国外汇交易用途分布');
   const pieTitle3 = ref('全国外汇交易年龄分布');
   const pieTitle4 = ref('全国外汇交易币种分布');

     // 地图请求函数
   async function fetchMapData( transactionType: string, aggDate: string, mapData: any) {
     try {
       // 这里替换为实际的后端API地址
       const response = await axiosInstance.post('offline/getProvince', {
         transactionType: transactionType,
         aggDate: aggDate,
         location: '全国'
       });
       if (response.data) {
         // 更新饼图数据
         mapData.value = response.data.data;
       }
     } catch (error) {
       console.error('获取数据失败:', error);
     }
   }

  // 柱状图请求函数
  async function fetchBarData( transactionType: string, aggDate: string, barData: any) {
    try {
      // 这里替换为实际的后端API地址
      const response = await axiosInstance.post('/offline/getAmountRange', {
        transactionType: transactionType,
        aggDate: aggDate,
        location: '全国'
      });
      if (response.data) {
        // 更新饼图数据
        barData.value = response.data.data;
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  }


  // 饼图请求函数1
  async function fetchPieData1( aggDate: string, location: string, pieData: any) {
    try {
      // 这里替换为实际的后端API地址
      const response = await axiosInstance.post('/offline/getPlatform', {
        transactionType: 'FX',
        aggDate: aggDate,
        location: location
      });
      if (response.data) {
        // 更新饼图数据
        pieData.value = response.data.data;
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  }

  // 饼图请求函数2
  async function fetchPieData2( aggDate: string, location: string, pieData: any) {
    try {
      // 这里替换为实际的后端API地址
      const response = await axiosInstance.post('/offline/getPurpose', {
        transactionType: 'FX',
        aggDate: aggDate,
        location: location
      });
      if (response.data) {
        // 更新饼图数据
        pieData.value = response.data.data;
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  }

    // 饼图请求函数3
  async function fetchPieData3( aggDate: string, location: string, pieData: any) {
    try {
      // 这里替换为实际的后端API地址
      const response = await axiosInstance.post('/offline/getAgeRange', {
        transactionType: 'FX',
        aggDate: aggDate,
        location: location
      });
      if (response.data) {
        // 更新饼图数据
        pieData.value = response.data.data;
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  }

    // 饼图请求函数4
  async function fetchPieData4( aggDate: string, location: string,  pieData: any) {
    try {
      // 这里替换为实际的后端API地址
      const response = await axiosInstance.post('/offline/getCurrency', {
        transactionType: 'FX',
        aggDate: aggDate,
        location: location
      });
      if (response.data) {
        // 更新饼图数据
        pieData.value = response.data.data;
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  }

  const dateMenu = ref(false);
  const tempDate = ref(currentDate.value);

  function onDateSelected(val: string) {
    currentDate.value = val;
    dateMenu.value = false;

    
  }

  onMounted(async () => {
    const userStore = useUserStore();
    const token = userStore.token;
    if (!token) {
      console.error('未获取到token,请先登录');
      return;
    }
    
    // 地图
    await fetchMapData('FX', currentDate.value, mapData)
    // 柱状图1
    await fetchBarData('FX', currentDate.value, barData1)
    // 柱状图2
    await fetchBarData('ATM', currentDate.value, barData2)
    // 饼图1
    await fetchPieData1(currentDate.value, '全国', pieData1)
    // 饼图2
    await fetchPieData2(currentDate.value, '全国', pieData2)
    // 饼图3
    await fetchPieData3(currentDate.value, '全国', pieData3)
    // 饼图4
    await fetchPieData4(currentDate.value, '全国', pieData4)
  }) 


  async function getProvince(province: string){
    console.log('点击的省份', province);
    
    const userStore = useUserStore();
    const token = userStore.token;
    if (!token) {
      console.error('未获取到token,请先登录');
    }
    
    // 更新饼图标题
    pieTitle1.value = `${province}外汇交易平台分布`;
    pieTitle2.value = `${province}外汇交易用途分布`;
    pieTitle3.value = `${province}外汇交易年龄分布`;
    pieTitle4.value = `${province}外汇交易币种分布`;
    
    // 点击省份时更新饼图
    await fetchPieData1(currentDate.value, province, pieData1);
    await fetchPieData2(currentDate.value, province, pieData2);
    await fetchPieData3(currentDate.value, province, pieData3);
    await fetchPieData4(currentDate.value, province, pieData4);
   }
</script>
  
<style scoped>
.modern-offline-bg {
  background: #e0e4ec42;
  /* background: linear-gradient(135deg, #e3f2fd 0%, #f8fdff 100%); */
  min-height: 100vh;
}
.modern-card {
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(33, 150, 243, 0.10);
  background: #fff;
  transition: box-shadow 0.2s;
}


.pie-title, .bar-title, .map-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1976d2;
  margin-bottom: 8px;
  letter-spacing: 1px;
}
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