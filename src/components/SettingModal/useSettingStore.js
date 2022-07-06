/**
 * 用户设置存储业务
 */

import { 用户设置存储 } from '@/store/userSetting'

export default function (formData) {
  // 从pinia读取设置
  const settingStore = 用户设置存储()

  // 获取设置
  function 获取设置() {
    const tempFormData = settingStore.getSetingFormData
    Object.keys(formData).forEach(key => {
      formData[key] = tempFormData[key]
    })
  }

  function 保存设置() {
    // 密钥格式转换
    const keyDatas = {
      baidu: {
        appid: formData.appid,
        token: formData.token
      },

      tencent: {
        secretId: formData.secretId,
        secretKey: formData.secretKey
      },

      youdao: {
        appid: formData.youdaoId,
        appkey: formData.youdaoSecret
      },

      ali: {
        accessKeyId: formData.accessKeyId,
        accessKeySecret: formData.accessKeySecret
      },

      caiyun: {
        token: formData.caiyunToken
      },

      huoshan: {
        accessKeyId: formData.huoshanAccessKeyId,
        secretAccessKey: formData.huoshanSecretAccessKey
      }
    }
    settingStore.setHomeOption(formData.homeHasApi)
    settingStore.setDefaultStorage(formData.defaultApi)
    settingStore.setKeyConfig(keyDatas)
    settingStore.setFontSize(formData.textFont)
    settingStore.setCopyBtnBehavior(formData.copyBtnBehavior)
    settingStore.setCodeMode(formData.codeMode)
    settingStore.setCopyBtnShow(formData.copyBtnShow)
    settingStore.setCopyBtnShow(formData.copyBtnShow)
    settingStore.setReadAloud(formData.readAloud)
    settingStore.setReadingPreference(formData.readingPreference)
    settingStore.setTheme(formData.theme)
    settingStore.setDefaultForeignLanguage(formData.defaultForeignLanguage)
  }

  function 重置设置() {
    settingStore.reset()
  }

  return {
    获取设置,
    保存设置,
    重置设置
  }
}
