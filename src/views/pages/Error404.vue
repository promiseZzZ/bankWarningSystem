<script setup lang="ts">
import { useRouter } from 'vue-router';
const userouter = useRouter();
function goback(){
    userouter.push({path:'/auth/login'})
}
</script>
<template>
    <div class="d-flex justify-center align-center text-center h-100vh">
        <div>
            <img src="../../assets/images/background/errorimage.svg" width="500" alt="404" />
            <h1 class="text-h1 pt-3">Opps!!!</h1>
            <h4 class="text-h4 my-8">This page you are looking for could not be found.</h4>
            <v-btn flat color="primary" @click="goback()" class="mb-4">Go Back to Home</v-btn>
        </div>    
    </div>
</template>
