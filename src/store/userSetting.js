/** 用户设置信息 */
import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash-es'

import {
  getDbStorageItem,
  setDbStorageItem,
  removeDbStorageItem
} from '@/utils/storage'
import { apiOptions } from '@/assets/translateApiOption'

// 配置项键名
const CONFIG_KEYS = {
  KEY_SETTING: 'keyConfig', // 密钥配置
  HOME_OPTION: 'homeOption', // 首页选择
  DEFAULT_API: 'defaultApi', // 默认使用api
  FONT_SIZE: 'fontSize', // 输入框文本大小
  COPY_BTN_BEHAVIOR: 'copyBtnBehavior', // 复制快捷键行为
  COPY_BTN_SHOW: 'copyBtnShow', // 显示的复制按钮
  CODE_MODE: 'codeMode', // 命名翻译模式
  READ_ALOUD: 'readAloud', // 语音朗读
  READING_PREFERENCE: 'readingPreference' // 朗读偏好
}

/** 获取初始化初始值 */
function getInitState() {
  /** 获取默认的首页api */
  const getDefaultHomeApi = () => {
    return apiOptions.slice(0, 4).map(i => i.value)
  }

  const initHomeOptionState = () => {
    const strData = getDbStorageItem(CONFIG_KEYS.HOME_OPTION)
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
    return getDbStorageItem(CONFIG_KEYS.DEFAULT_API) || getDefaultHomeApi()[0]
  }

  const initKeyConfigState = () => {
    const strData = getDbStorageItem(CONFIG_KEYS.KEY_SETTING) || '{}'
    try {
      return JSON.parse(strData)
    } catch (error) {
      return {}
    }
  }

  const initFontSizeState = () => {
    const fontSize = getDbStorageItem(CONFIG_KEYS.FONT_SIZE) || 16
    return Number.parseInt(fontSize)
  }

  const getStorageBoolean = (key, defaultState) => {
    const value = getDbStorageItem(key) || defaultState
    return value === 'true' || value === true ? true : false
  }

  const getCopyBtnShow = () => {
    const value = getDbStorageItem(CONFIG_KEYS.COPY_BTN_SHOW) || '[1,2,3]'
    return JSON.parse(value)
  }

  const getReadingPreference = () => {
    const value = getDbStorageItem(CONFIG_KEYS.READING_PREFERENCE) || 'default'
    return value
  }

  return {
    homeOption: initHomeOptionState(),
    defaultApi: initDefaultApiState(),
    keyConfig: initKeyConfigState(),
    fontSize: initFontSizeState(),
    copyBtnBehavior: getDbStorageItem(CONFIG_KEYS.COPY_BTN_BEHAVIOR) || 'open',
    codeMode: getStorageBoolean(CONFIG_KEYS.CODE_MODE, false),
    copyBtnShow: getCopyBtnShow(),
    readAloud: getStorageBoolean(CONFIG_KEYS.READ_ALOUD, true),
    readingPreference: getReadingPreference()
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
        codeMode,
        copyBtnShow,
        readAloud,
        readingPreference
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
        huoshanAccessKeyId: keyConfig.huoshan?.accessKeyId, // 火山
        huoshanSecretAccessKey: keyConfig.huoshan?.secretAccessKey, // 火山
        copyBtnBehavior, // 复制快捷键行为 (open:仅复制|close:复制并隐藏|closeInput:复制隐藏并输入)
        copyBtnShow, // 首页显示复制按钮 []
        codeMode, // 命名翻译模式
        readAloud, // 语音朗读
        readingPreference // 朗读偏好
      }
    }
  },

  actions: {
    /** 设置首页可见翻译 */
    setHomeOption(data) {
      this.homeOption = data
      setDbStorageItem(CONFIG_KEYS.HOME_OPTION, JSON.stringify(data))
    },

    /** 设置默认翻译 */
    setDefaultStorage(data) {
      this.defaultApi = data
      setDbStorageItem(CONFIG_KEYS.DEFAULT_API, data)
    },

    /** 设置密钥 */
    setKeyConfig(data) {
      this.keyConfig = data
      setDbStorageItem(CONFIG_KEYS.KEY_SETTING, JSON.stringify(data))
    },

    /** 设置字体大小 */
    setFontSize(data) {
      this.fontSize = data
      setDbStorageItem(CONFIG_KEYS.FONT_SIZE, data)
    },

    /** 设置复制快捷键行为 */
    setCopyBtnBehavior(data) {
      this.copyBtnBehavior = data
      setDbStorageItem(CONFIG_KEYS.COPY_BTN_BEHAVIOR, data)
    },

    /** 设置复制按钮 */
    setCopyBtnShow(data) {
      this.copyBtnShow = data
      setDbStorageItem(CONFIG_KEYS.COPY_BTN_SHOW, JSON.stringify(data))
    },

    /** 设置命名翻译模式 */
    setCodeMode(data) {
      this.codeMode = data
      setDbStorageItem(CONFIG_KEYS.CODE_MODE, data)
    },

    /** 设置语音朗读开启 */
    setReadAloud(data) {
      this.readAloud = data
      setDbStorageItem(CONFIG_KEYS.READ_ALOUD, data)
    },

    /** 设置语音朗读偏好 */
    setReadingPreference(data) {
      this.readingPreference = data
      setDbStorageItem(CONFIG_KEYS.READING_PREFERENCE, data)
    },

    /** 重置设置 */
    reset() {
      Object.keys(CONFIG_KEYS).forEach(key => {
        removeDbStorageItem(CONFIG_KEYS[key])
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
