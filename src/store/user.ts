import { defineStore } from 'pinia';

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
            return this.username;
        },
        setUser(newUser: string) {
            this.username = newUser;
        },
        logout() {
            this.$reset();
            this.token = '';
            this.role = 0;
            this.isRolesLoaded = false;
        }
    },
    persist: true
});