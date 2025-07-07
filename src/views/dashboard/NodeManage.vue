<template>
    <v-container fluid class="modern-account-bg">
        <v-data-table
            :headers="headers"
            :items="items"
            :items-per-page="10"
            class="elevation-1"
            hide-default-footer
        >
            <template #item.actions="{ item }">
                <v-icon small class="mr-2" @click="openEditDialog(item)">mdi-pencil</v-icon>
                <v-icon small @click="deleteUser(item)">mdi-delete</v-icon>
            </template>
        </v-data-table>

    <v-dialog v-model="editDialog" max-width="420px">
        <v-card elevation="2" rounded>
            <v-card-title class="text-h6 font-weight-bold text-center">
                绑定负责人
            </v-card-title>
            <v-card-text>
                <v-row class="mb-2" dense>
                    <v-col cols="12">
                        <v-sheet class="pa-2 text-center" color="#f5f7fa" rounded>
                            <span class="grey--text text--darken-2">节点名称：</span>{{ editUser.nodeName }}
                        </v-sheet>
                    </v-col>
                    <v-col cols="12">
                        <v-sheet class="pa-2 text-center" color="#f5f7fa" rounded>
                            <span class="grey--text text--darken-2">节点地址：</span>{{ editUser.nodeAddress }}
                        </v-sheet>
                    </v-col>
                </v-row>
                <v-select
                    v-model="editUser.owner"
                    :items="ownerOptions"
                    label="负责人"
                    outlined
                    dense
                    class="mb-2"
                    hint="请选择负责人"
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
import { ref, onMounted, Ref } from 'vue';
import { axiosInstance } from '../../utils/request';

interface EditUser {
  nodeId: string;
  nodeName: string;
  owner: string | null;
  nodeAddress: string;
}

const ownerOptions: Ref<string[]> = ref([]);
const editUser: Ref<EditUser> = ref({
  nodeId: '',
  nodeName: '',
  owner: null,
  nodeAddress: ''
});

const headers = [
  { title: '节点ID', key: 'nodeId' },
  { title: '节点名称', key: 'nodeName' },
  {title:'响应阈值', key: 'responseThreshold'},
  { title: '节点地址', key: 'nodeAddress' },
  { title: '负责人', key: 'owner' },
  { title: '操作', key: 'actions' },
];

const items = ref<any[]>([]);

const editDialog = ref(false);
let editIndex = -1;

//获取负责人列表
async function fetchOwnerList() {
    try{
        const response = await axiosInstance.get('/user/getNormalUserNames');
        if(response.data.code === 0){
            ownerOptions.value = response.data.data;
        }
    }catch(error){
        console.error('获取负责人列表失败:', error);
    }
}

//获取节点信息
async function fetchTableData() {
    try{
  const response = await axiosInstance.get('/node/getAllNodeInfo');
  if (response.data && Array.isArray(response.data.data)) {
    items.value = response.data.data.map((item: any) => ({
      nodeId: item.id,
      nodeName: item.nodeName,
      responseThreshold: item.responseThreshold,
      nodeAddress: item.address,
      owner: item.managers && item.managers.length > 0 ? item.managers[0].userName : '',
    }));
    }
  } catch (error) {
    console.error('获取节点信息失败:', error);
  }
}

function openEditDialog(item: any) {
  editIndex = items.value.findIndex(u => u.nodeId === item.nodeId);
  editUser.value = { ...item, owner: item.owner || null };
  editDialog.value = true;
}

//更新节点信息
async function saveEdit() {
  const params = {
    nodeName: editUser.value.nodeName,
    managerName: editUser.value.owner || ''
  }
  try{
    const response = await axiosInstance.post('/node-manager/updateManager', params);
    if(response.data.code === 0){
      if (editIndex !== -1){
        items.value[editIndex].owner = editUser.value.owner;
      }
      editDialog.value = false;

      await fetchTableData();
    }
  }catch(error){
    console.error('更新节点信息失败:', error);
  }
}

function deleteUser(item: any) {
  items.value = items.value.filter(u => u.nodeId !== item.nodeId);
}

onMounted(() => {
  fetchOwnerList();
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