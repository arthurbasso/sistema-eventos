import { defineStore } from "pinia";

export const useAppStore = defineStore('app', {
  state: () => ({
    offlineMode: false
  }),

  getters: {
    isOffline() {
      return this.offlineMode
    }
  },

  actions: {
    fetch() {
      this.offlineMode = localStorage.getItem('offlineMode') === 'true'
    },

    setOfflineMode(offlineMode) {
      localStorage.setItem('offlineMode', offlineMode)
      this.offlineMode = offlineMode
    }
  }
})
