<template>
  <v-container fluid class="pa-6" >
    <v-row>
        <v-col cols="12">
        </v-col>
    </v-row>
      <v-row>
          <v-col cols="8" >
              <v-card class="pa-6" height="500" >
                  <div class="fill-height d-flex align-center justify-center grey--text ">
                  </div>
              </v-card>
          </v-col>
          <v-col cols="4" class="d-flex flex-column justify-space-between">
            <v-card height="100">

            </v-card>
              <v-card class="mb-4" height="180">
                  <div class="fill-height d-flex align-center justify-center grey--text">
                  </div>
              </v-card>
              <v-card height="180">
                  <div class="fill-height d-flex align-center justify-center grey--text">
                  </div>
              </v-card>
          </v-col>
      </v-row>

      <v-row class="mt-6">
          <v-col cols="3">
              <v-card height="200" class="d-flex flex-column ">
              </v-card>    
          </v-col>
          <v-col cols="3">
              <v-card height="200" class="d-flex align-center justify-center ">
               </v-card>    
           </v-col>
           <v-col cols="3">
               <v-card height="200" class="d-flex align-center justify-center ">
               </v-card>    
           </v-col>
           <v-col cols="3">
               <v-card height="200" class="d-flex align-center justify-center ">
              </v-card>    
          </v-col>
      </v-row>
  </v-container>
</template>


<script lang="ts" setup>

</script>

<style scoped>
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