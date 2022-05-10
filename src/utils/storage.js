/**密钥存取(临时) */
// import * as keyDatas from '@/config'
const utools = window.utools
const KEY_SETTING = 'keyConfig'
const HOME_OPTION = 'homeOption'
const DEFAULT_API = 'defaultApi'

// 密钥存储
export const keyStorage = {
  /**获取密钥配置信息 */
  get() {
    return utools.dbStorage.getItem(KEY_SETTING) || {}
  },

  /**存储密钥配置信息 */
  set(data) {
    utools.dbStorage.setItem(KEY_SETTING, data)
  },

  /**
   * 获取指定密钥
   * @param {String} tag 第三方api标识
   */
  getKeyByTag(tag) {
    const keyConfig = this.get()
    console.log('keyConfig:', keyConfig)
    return keyConfig[tag]
  },

  /**存储指定密钥 */
  setKeyByTag(tag, data) {
    const keyConfig = this.get()
    keyConfig[tag] = data
    utools.dbStorage.setItem(KEY_SETTING, keyConfig)
  }
}

// 首页选项
export const homeOptionStorage = {
  get() {
    return utools.dbStorage.getItem(HOME_OPTION)
  },

  set() {
    return utools.dbStorage.setItem(HOME_OPTION)
  }
}

// 首选翻译
export const defaultStorage = {
  get() {
    return utools.dbStorage.getItem(DEFAULT_API)
  },

  set() {
    return utools.dbStorage.setItem(DEFAULT_API)
  }
}
