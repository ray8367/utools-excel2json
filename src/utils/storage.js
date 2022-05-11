/**密钥存取(临时) */
// import * as keyDatas from '@/config'
const utools = window.utools
const KEY_SETTING = 'keyConfig'
const HOME_OPTION = 'homeOption'
const DEFAULT_API = 'defaultApi'

function getDbStorageItem(key) {
  if (utools) {
    return utools.dbStorage.getItem(key)
  } else {
    return window.localStorage.getItem(key)
  }
}

function setDbStorageItem(key, value) {
  if (utools) {
    return utools.dbStorage.setItem(key, value)
  } else {
    return window.localStorage.setItem(key, value)
  }
}

// 密钥存储
export const keyStorage = {
  /**获取密钥配置信息 */
  get() {
    const strData = getDbStorageItem(KEY_SETTING) || '{}'
    try {
      return JSON.parse(strData)
    } catch (error) {
      return {}
    }
  },

  /**存储密钥配置信息 */
  set(data) {
    setDbStorageItem(KEY_SETTING, JSON.stringify(data))
  },

  /**
   * 获取指定密钥
   * @param {String} tag 第三方api标识
   */
  getKeyByTag(tag) {
    const keyConfig = this.get()
    return keyConfig[tag]
  },

  /**存储指定密钥 */
  setKeyByTag(tag, data) {
    const keyConfig = this.get()
    keyConfig[tag] = data
    this.set(keyConfig)
  }
}

// 首页选项
export const homeOptionStorage = {
  get() {
    const defaultOptions = ['baidu', 'tencent', 'youdao', 'ali']
    const strData = getDbStorageItem(HOME_OPTION)
    // return strData ? JSON.parse(strData) : defaultOptions
    if (strData) {
      try {
        return JSON.parse(strData)
      } catch (error) {
        return defaultOptions
      }
    } else {
      return defaultOptions
    }
  },

  set(data) {
    setDbStorageItem(HOME_OPTION, JSON.stringify(data))
  }
}

// 首选翻译
export const defaultStorage = {
  get() {
    return getDbStorageItem(DEFAULT_API) || 'baidu'
  },

  set(data) {
    setDbStorageItem(DEFAULT_API, data)
  }
}
