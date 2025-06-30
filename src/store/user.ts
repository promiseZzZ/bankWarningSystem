import { ref} from 'vue';
import { defineStore } from 'pinia';
import { axiosInstance } from '../utils/request'

export const useUserStore = defineStore(
    'user',
    () => {
        const token = ref('');
        const setToken = (newToken:string) => {
            token.value = newToken
        }
        const removeToken = () => {
            token.value = ''
        }

        const user = ref('');
        const getUser = async () => {
            const response = await axiosInstance.get('/user/info');
            user.value = response.data.userName
        }

        return {
            token,
            setToken,
            removeToken,
            user,
            getUser
        }
    },
    {
        persist:true
    }
)