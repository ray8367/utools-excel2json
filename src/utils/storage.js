/** 密钥存取(临时) */
import { apiOptions } from '@/assets/translateApiOption'

const utools = window.utools
const KEY_SETTING = 'keyConfig'
const HOME_OPTION = 'homeOption'
const DEFAULT_API = 'defaultApi'
const FONT_SIZE = 'fontSize'

/** 数据存储某一项 */
function getDbStorageItem(key) {
  if (utools) {
    return utools.dbStorage.getItem(key)
  } else {
    return window.localStorage.getItem(key)
  }
}

/** 数据读取某一项 */
function setDbStorageItem(key, value) {
  if (utools) {
    return utools.dbStorage.setItem(key, value)
  } else {
    return window.localStorage.setItem(key, value)
  }
}

/** 获取默认的首页api */
function getDefaultHomeApi() {
  return apiOptions.slice(0, 4).map(i => i.value)
}

// 密钥存储
export const keyStorage = {
  /** 获取密钥配置信息 */
  get() {
    const strData = getDbStorageItem(KEY_SETTING) || '{}'
    try {
      return JSON.parse(strData)
    } catch (error) {
      return {}
    }
  },

  /** 存储密钥配置信息 */
  set(data) {
    setDbStorageItem(KEY_SETTING, JSON.stringify(data))
  }
}

// 首页可使用翻译选项
export const homeOptionStorage = {
  get() {
    const strData = getDbStorageItem(HOME_OPTION)
    if (strData) {
      try {
        return JSON.parse(strData)
      } catch (error) {
        return getDefaultHomeApi()
      }
    } else {
      return getDefaultHomeApi()
    }
  },

  set(data) {
    setDbStorageItem(HOME_OPTION, JSON.stringify(data))
  }
}

// 首选翻译
export const defaultStorage = {
  get() {
    return getDbStorageItem(DEFAULT_API) || getDefaultHomeApi()[0]
  },

  set(data) {
    setDbStorageItem(DEFAULT_API, data)
  }
}

// 字体大小
export const fontSizeStorage = {
  get() {
    const fontSize = getDbStorageItem(FONT_SIZE) || 16
    return Number.parseInt(fontSize)
  },

  set(data) {
    setDbStorageItem(FONT_SIZE, data)
  }
}
