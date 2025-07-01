import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', {
    state: () => ({
        username: '',
        token: '',
        role: 0,
        isRolesLoaded: false
    }),
    actions: {
        setToken(newToken: string) {
            this.token = newToken;
        },
        setRole(newRole: number) {
            this.role = newRole;
            this.isRolesLoaded = true;
        },
        removeToken() {
            this.token = '';
        },
        resetUser() {
            this.token = '';
            this.role = 0;
            this.isRolesLoaded = false;
        },
        getUser() {
            async () => {
                const response = await axios.get('/api/user/getuser');
                this.username = response.data.data.username;
            }
        }
    },
    persist: true
});