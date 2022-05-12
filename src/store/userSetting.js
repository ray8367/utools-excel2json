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

  getters: {
    /**获取设置表单 */
    getSetingFormData: state => {
      const { homeOption, defaultApi, keyConfig } = state
      return {
        homeHasApi: homeOption, // 首页展示的翻译方式
        defaultApi: defaultApi, // 默认翻译方式
        appid: keyConfig.baidu?.appid, // 百度
        token: keyConfig.baidu?.token, // 百度
        secretId: keyConfig.tencent?.secretId, // 腾讯
        secretKey: keyConfig.tencent?.secretKey, // 腾讯
        accessKeyId: keyConfig.ali?.accessKeyId, // 阿里
        accessKeySecret: keyConfig.ali?.accessKeySecret, // 阿里
        youdaoId: keyConfig.youdao?.appid, // 有道
        youdaoSecret: keyConfig.youdao?.appkey // 有道
      }
    }
  },

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
    },

    /**
     * 获取指定密钥
     * @param {String} tag 第三方api标识
     */
    getKeyByTag(tag) {
      return this.keyConfig[tag] || {}
    }
  }
})

export function getKeyByTag(tag) {
  const settingStore = userSettingStore()
  const { keyConfig } = settingStore
  return keyConfig[tag] || {}
}
