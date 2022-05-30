/** 用户设置信息 */
import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash-es'

import {
  getDbStorageItem,
  setDbStorageItem,
  removeDbStorageItem
} from '@/utils/storage'
import { apiOptions } from '@/assets/translateApiOption'

const KEY_SETTING = 'keyConfig'
const HOME_OPTION = 'homeOption'
const DEFAULT_API = 'defaultApi'
const FONT_SIZE = 'fontSize'
const COPY_BTN_BEHAVIOR = 'copyBtnBehavior'
const CODE_MODE = 'codeMode'

/** 获取初始化初始值 */
function getInitState() {
  /** 获取默认的首页api */
  console.log('获取初始化初始值')
  const getDefaultHomeApi = () => {
    return apiOptions.slice(0, 4).map(i => i.value)
  }

  const initHomeOptionState = () => {
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
  }

  const initDefaultApiState = () => {
    return getDbStorageItem(DEFAULT_API) || getDefaultHomeApi()[0]
  }

  const initKeyConfigState = () => {
    const strData = getDbStorageItem(KEY_SETTING) || '{}'
    try {
      return JSON.parse(strData)
    } catch (error) {
      return {}
    }
  }

  const initFontSizeState = () => {
    const fontSize = getDbStorageItem(FONT_SIZE) || 16
    return Number.parseInt(fontSize)
  }

  const getStorageBoolean = (key, defaultState) => {
    const value = getDbStorageItem(key) || defaultState
    return value === 'true' || value === true ? true : false
  }

  return {
    homeOption: initHomeOptionState(),
    defaultApi: initDefaultApiState(),
    keyConfig: initKeyConfigState(),
    fontSize: initFontSizeState(),
    copyBtnBehavior: getDbStorageItem(COPY_BTN_BEHAVIOR) || 'open',
    codeMode: getStorageBoolean(CODE_MODE, false)
  }
}

export const userSettingStore = defineStore('settings', {
  state: () => getInitState(),

  getters: {
    /** 获取首页api选择 */
    getHomeApiOptions: state => {
      return cloneDeep(apiOptions).filter(
        i => state.homeOption.indexOf(i.value) !== -1
      )
    },

    getHomeFontSize: state => {
      return `${state.fontSize}px`
    },

    /** 获取设置页表单 */
    getSetingFormData: state => {
      const {
        homeOption,
        defaultApi,
        keyConfig,
        fontSize,
        copyBtnBehavior,
        codeMode
      } = state

      return {
        homeHasApi: homeOption, // 首页展示的翻译方式
        defaultApi: defaultApi, // 默认翻译方式
        textFont: fontSize, // 文本框字号
        appid: keyConfig.baidu?.appid, // 百度
        token: keyConfig.baidu?.token, // 百度
        secretId: keyConfig.tencent?.secretId, // 腾讯
        secretKey: keyConfig.tencent?.secretKey, // 腾讯
        accessKeyId: keyConfig.ali?.accessKeyId, // 阿里
        accessKeySecret: keyConfig.ali?.accessKeySecret, // 阿里
        youdaoId: keyConfig.youdao?.appid, // 有道
        youdaoSecret: keyConfig.youdao?.appkey, // 有道
        caiyunToken: keyConfig.caiyun?.token, // 彩云
        copyBtnBehavior, // 复制按钮行为 (open|close)
        codeMode // 命名翻译模式
      }
    }
  },

  actions: {
    /** 设置首页可见翻译 */
    setHomeOption(data) {
      this.homeOption = data
      setDbStorageItem(HOME_OPTION, JSON.stringify(data))
    },

    /** 设置默认翻译 */
    setDefaultStorage(data) {
      this.defaultApi = data
      setDbStorageItem(DEFAULT_API, data)
    },

    /** 设置密钥 */
    setKeyConfig(data) {
      this.keyConfig = data
      setDbStorageItem(KEY_SETTING, JSON.stringify(data))
    },

    /** 设置字体大小 */
    setFontSize(data) {
      this.fontSize = data
      setDbStorageItem(FONT_SIZE, data)
    },

    /** 设置复制行为 */
    setCopyBtnBehavior(data) {
      this.copyBtnBehavior = data
      setDbStorageItem(COPY_BTN_BEHAVIOR, data)
    },

    /** 设置命名翻译模式 */
    setCodeMode(data) {
      this.codeMode = data
      setDbStorageItem(CODE_MODE, data)
    },

    /** 重置设置 */
    reset() {
      const resetKeys = [
        KEY_SETTING,
        HOME_OPTION,
        DEFAULT_API,
        FONT_SIZE,
        COPY_BTN_BEHAVIOR,
        CODE_MODE
      ]
      resetKeys.forEach(key => {
        removeDbStorageItem(key)
      })

      this.$reset()
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
