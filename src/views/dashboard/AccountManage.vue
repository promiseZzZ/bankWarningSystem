<template>
    <v-container fluid class="modern-account-bg">
        <v-data-table
            :headers="headers"
            :items="items"
            :items-per-page="5"
            class="elevation-1"
        >
        <template #item.permissionLevel="{ item }">
            <v-chip 
            :color="item.permissionLevel === '已授权' ? 'green': 'grey'"
            variant="outlined"
            text-color="white"
            small
            class="font-weight-bold"
            >
                {{ item.permissionLevel }}
            </v-chip>
        </template>
            <template #item.actions="{ item }">
                <v-icon small class="mr-2" @click="openEditDialog(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteUser(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>

    <v-dialog v-model="editDialog" max-width="420px">
        <v-card elevation="2" rounded>
            <v-card-title class="text-h6 font-weight-bold text-center">
                编辑用户信息
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <v-row class="mb-2" dense>
                    <v-col cols="6">
                        <v-sheet class="pa-2 text-center" color="#f5f7fa" rounded>
                            <span class="grey--text text--darken-2">姓名：</span>{{ editUser.name }}
                        </v-sheet>
                    </v-col>
                    <v-col cols="6">
                        <v-sheet class="pa-2 text-center" color="#f5f7fa" rounded>
                            <span class="grey--text text--darken-2">工号：</span>{{ editUser.jobNumber }}
                        </v-sheet>
                    </v-col>
                </v-row>
                <v-text-field
                    v-model="editUser.phone"
                    label="电话"
                    outlined
                    dense
                    class="mb-2"
                ></v-text-field>
                <v-text-field
                    v-model="editUser.email"
                    label="邮箱"
                    outlined
                    dense
                    class="mb-2"
                ></v-text-field>
                <v-select
                    v-model="editUser.permissionLevel"
                    :items="permissionLevels"
                    label="权限等级"
                    outlined
                    dense
                    class="mb-2"
                    hint="请选择用户权限"
                    persistent-hint
                ></v-select>
            </v-card-text>
            <v-card-actions class="justify-end">
                <v-btn color="primary" rounded @click="saveEdit">保存</v-btn>
                <v-btn rounded @click="editDialog = false">取消</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { axiosInstance } from '../../utils/request';
import { roleTypes } from 'element-plus';

const permissionLevels = ['已授权', '未授权'];

const headers = [
  { title: '姓名', key: 'name' },
  { title: '工号', key: 'jobNumber' },
  { title: '电话', key: 'phone' },
  { title: '邮箱', key: 'email' },
  { title: '权限等级', key: 'permissionLevel' },
  { title: '操作', key: 'actions' },
];

const items = ref<any[]>([]);
const editDialog = ref(false);
const editUser = ref({ name: '', jobNumber: '', phone: '', email: '', permissionLevel: '' });
let editIndex = -1;



async function fetchTableData() {
  try{
    const response = await axiosInstance.get('/user/getNormalUsers');
    if (response.data && Array.isArray(response.data.data)) {
      items.value = response.data.data.map((item: any) => ({
        name: item.userName,
        jobNumber: item.code,
        phone: item.phone,
        email: item.email,
        permissionLevel: item.roleId === 1 ? '已授权' : '未授权',
      }));
    }
  }catch(error){
    console.error('获取用户信息失败:', error);
  }
}

function openEditDialog(item: any) {
  editIndex = items.value.findIndex(u => u.jobNumber === item.jobNumber);
  editUser.value = { ...item };
  editDialog.value = true;
}

async function saveEdit() {
  const params = {
    code: editUser.value.jobNumber,
    phone: editUser.value.phone,
    email: editUser.value.email,
    roleId: editUser.value.permissionLevel === '已授权' ? 1 : 0,
  }
  try{
    const response = await axiosInstance.put('/user/updateUser', params);
    if(response.data.code === 0){
      if (editIndex !== -1){
        items.value[editIndex].phone = editUser.value.phone;
        items.value[editIndex].email = editUser.value.email;
        items.value[editIndex].permissionLevel = editUser.value.permissionLevel;
      }
      editDialog.value = false;

      await fetchTableData();
    }
  }catch(error){
    console.error('更新用户信息失败:', error);
  }
}

function deleteUser(item: any) {
  items.value = items.value.filter(u => u.jobNumber !== item.jobNumber);
}

onMounted(() => {
  fetchTableData();
});
</script>

<style scoped>
.modern-account-bg {
  background: #e0e4ec42;
  /* background: linear-gradient(135deg, #e3f2fd 0%, #f8fdff 100%); */
  overflow: hidden;
}
.modern-card {
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(33, 150, 243, 0.10);
  background: #fff;
  transition: box-shadow 0.2s;
}
</style>