import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: null,
  }),

  getters: {
    isLoggedIn() {
      return !!this.user
    },

    isAdmin() {
      return this.user?.role === 'admin'
    }
  },

  actions: {
    fetch() {
      let user = localStorage.getItem('user')
      let token = localStorage.getItem('token')

      this.user = user
      this.token = token
    },
    setUser(user) {
      this.user = user
    },

    setToken(token) {
      this.token = token
    }
  }
})
