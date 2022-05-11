import { defineStore } from 'pinia'

export const useSettingStore = defineStore('settings', {
  state: () => {
    return {
      name: '张三',
      age: 18
    }
  },
  getters: {},
  actions: {}
})
