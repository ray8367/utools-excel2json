import { defineStore } from 'pinia'
import { homeOptionStorage, defaultStorage, keyStorage } from '@/utils/storage'

export const userSettingStore = defineStore('settings', {
  state: () => {
    return {
      // 首页显示的翻译接口
      homeOption: homeOptionStorage.get(),
      defaultApi: defaultStorage.get(),
      keyConfig: keyStorage.get()
    }
  },

  getters: {},

  actions: {
    /**设置首页可见翻译 */
    setHomeOption(data) {
      this.homeOption = data
      homeOptionStorage.set(data)
    },

    /** 设置默认翻译 */
    setDefaultStorage(data) {
      this.defaultApi = data
      defaultStorage.set(data)
    },

    /** 设置密钥 */
    setKeyConfig(data) {
      this.keyConfig = data
      keyStorage.set(data)
    }
  }
})
