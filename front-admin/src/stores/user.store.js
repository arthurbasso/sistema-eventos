import { defineStore } from "pinia";
import usersApi from "@/api/users.api";
import eventsApi from "@/api/events.api";

export const useUserStore = defineStore('user', {
  state: () => ({
    token: null
  }),

  getters: {
    isLoggedIn() {
      return !!this.token
    },

    getTokenPayload() {
      if (this.token) {
        return JSON.parse(atob(this.token.split('.')[1]))
      } else {
        return null
      }
    },

    getUserId() {
      return this.getTokenPayload?.user_id || null
    },

    isAdmin() {
      return this.getTokenPayload?.is_admin === true
    }
  },

  actions: {
    fetch() {
      let token = localStorage.getItem('token')

      this.token = token
      usersApi.setToken(token)
      eventsApi.setToken(token)
    },

    setToken(token) {
      localStorage.setItem('token', token)
      this.token = token
      usersApi.setToken(token)
      eventsApi.setToken(token)
    },

    doLogout() {
      localStorage.removeItem('token')
      this.token = null
    }
  }
})
