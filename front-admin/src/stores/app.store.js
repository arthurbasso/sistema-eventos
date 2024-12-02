import { defineStore } from "pinia";
import { changeOfflineMode } from "@/api/offline";

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
      localStorage.setItem('offlineMode', offlineMode)
      await changeOfflineMode(offlineMode)
    }
  }
})
