import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', {
  state: () => {
    return {
      currentTheme: undefined
    }
  },
  getters: {},
  actions: {}
})
