<template>
    <v-container fluid class="pa-6 modern-offline-bg">
      <!-- 日期选择 -->
      <v-row>
        <v-col cols="12">
          <v-dialog 
          v-model="dateDialog" 
          :close-on-content-click="false" 
          location="bottom end"
          elevation="12"
          attach="body">
            <template v-slot:activator="{ props}">
              <v-btn size="large" rounded="lg" color="rgb(0 20 40)" v-bind="props">选择日期</v-btn>
            </template>
              <v-date-picker
                hide-header
                width="500px"
                height="500px"
                rounded="xl"

                elevation="8"
                v-model="currentDate"
                @update:modelValue="onDateSelected"
                max="2025-07-03"
                min="2025-01-01"

              />
          </v-dialog>
          <span class="current-date-title ml-4">当前数据日期为:</span>
          <span class="current-date-value ml-4">{{ currentDate }}</span>
          </v-col>
        </v-row>

        <!--  上部分地图和柱状图 -->
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
                <v-card  class="modern-card" height="240" elevation="8" hover>
                    <div class="fill-height d-flex align-center justify-center grey--text">
                      <BarChart :data="barData2" title="外汇买入金额分布"  />
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <!-- 下部分饼图 -->
        <v-row class="mt-6">
            <v-col cols="4">
                <v-card height="200" class="d-flex flex-column modern-card" elevation="8" hover>
                    <PieChart :data="pieData1" :title="pieTitle1" />
                </v-card>    
            </v-col>
            <v-col cols="4">
                <v-card height="200" class="d-flex align-center justify-center modern-card" elevation="8" hover>
                    <PieChart :data="pieData2" :title="pieTitle2" />
                 </v-card>    
             </v-col>
             <v-col cols="4">
                 <v-card height="200" class="d-flex align-center justify-center modern-card" elevation="8" hover>
                     <PieChart :data="pieData3" :title="pieTitle3" />
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
  

 const currentDate = ref(formatDate(new Date(2025, 6, 1), 'yyyy-MM-dd'));
 const dateDialog = ref(false);
 const tempDate = ref(currentDate.value);

   // 地图数据
  const mapData = ref([{name: '', value: 0}]);

  // 柱状图数据
  const barData1 = ref([]);
  const barData2 = ref([]);

    // 饼图数据
  const pieData1 = ref([{name: '', value: 0}]);
  const pieData2 = ref([{name: '', value: 0}]);
  const pieData3 = ref([{name: '', value: 0}]);

  // 饼图标题

  const pieTitle1 = ref('全国外汇交易用途分布');
  const pieTitle2 = ref('全国外汇交易年龄分布');
  const pieTitle3 = ref('全国外汇交易币种分布');

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

    // 饼图请求函数2
  async function fetchPieData2( aggDate: string, location: string, pieData: any) {
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

    // 饼图请求函数3
  async function fetchPieData3( aggDate: string, location: string,  pieData: any) {
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

  async function onDateSelected(val: string) {
    const formatedDate = formatDate(new Date(val), 'yyyy-MM-dd');
    currentDate.value = formatedDate;
    tempDate.value = val;
    
    dateDialog.value = false;

    // 更新数据
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

    console.log('选择的日期', currentDate.value);

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
  }) 


  async function getProvince(province: string){
    console.log('点击的省份', province);
    
    const userStore = useUserStore();
    const token = userStore.token;
    if (!token) {
      console.error('未获取到token,请先登录');
    }
    
    // 更新饼图标题
    pieTitle1.value = `${province}外汇交易用途分布`;
    pieTitle2.value = `${province}外汇交易年龄分布`;
    pieTitle3.value = `${province}外汇交易币种分布`;
    
    // 点击省份时更新饼图
    await fetchPieData1(currentDate.value, province, pieData1);
    await fetchPieData2(currentDate.value, province, pieData2);
    await fetchPieData3(currentDate.value, province, pieData3);
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

.modern-date-btn {
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 1px;
  padding: 0 24px;
  height: 44px;
  border-radius: 24px;
  box-shadow: 0 2px 8px 0 rgba(33, 150, 243, 0.10);
  background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
  color: #fff;
  transition: box-shadow 0.2s, background 0.2s;
}
.modern-date-btn:hover {
  background: linear-gradient(90deg, #1565c0 0%, #64b5f6 100%);
  box-shadow: 0 4px 16px 0 rgba(33, 150, 243, 0.18);
}
.current-date-title {
  font-size: 20px;
  color: #000000;
  font-weight: 500;
  margin-left: 16px;
  letter-spacing: 1px;
}
.current-date-value {
  font-size: 20px;
  color: #1976d2;
  font-weight: 500;
}
</style>