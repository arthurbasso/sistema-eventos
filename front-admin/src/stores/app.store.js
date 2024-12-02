import { defineStore } from "pinia";
import { enableOfflineMode, disableOfflineMode } from "@/api/offline";

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

    async setOfflineMode(offlineMode) {
      if (offlineMode) {
        await enableOfflineMode(offlineMode)
        this.offlineMode = true
      } else {
        this.offlineMode = false
        await disableOfflineMode(offlineMode)
      }
    }
  }
})
