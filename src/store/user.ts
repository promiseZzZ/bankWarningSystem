import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore(
    'user',
    () => {
        const token = ref('');
        const role = ref('');
        const isRolesLoaded = ref(false);

        const setToken = (newToken:string) => {
            token.value = newToken
        }
        const removeToken = () => {
            token.value = ''
        }
        const setRole = (newRole:string) => {
            role.value = newRole;
            isRolesLoaded.value = true;
        }
        //清除用户信息
        const resetUser = () => {
            token.value = '';
            role.value = '';
            isRolesLoaded.value = false;
        }

        return {
            token,
            role,
            setToken,
            setRole,
            removeToken,
            resetUser
        }
    },
    {
        persist:true
    }
)