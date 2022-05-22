/**
 * 腾讯翻译接口
 * https://cloud.tencent.com/document/api/551/15619
 *  */

import { getKeyByTag } from '@/store/userSetting'
import google from './google'
import { languageCorrectionByTag } from '@/utils/language'

const TAG_NAME = 'tencent'
const last = {
  optionsStr: '',
  result: ''
}

/**
 * 机器翻译
 * @param {String} options.q 请求翻译query(UTF-8编码)
 * @param {String} options.from 翻译源语言(可设置为auto)
 * @param {String} options.to 翻译目标语言(不可设置为auto)
 * @param {Boolean} options.isRefresh 强制刷新
 */
export default function (options) {
  const { q, isRefresh } = options
  // 空值优化
  if (!q) {
    return ''
  }

  // 重复值优化
  const optionsStr = JSON.stringify(options)
  if (!isRefresh && optionsStr === last.optionsStr) {
    return last.result
  }
  last.optionsStr = optionsStr

  // 语言修正
  let { from, to } = languageCorrectionByTag(TAG_NAME, options)

  const keyConfig = getKeyByTag(TAG_NAME)
  if (!keyConfig || !keyConfig.secretId || !keyConfig.secretKey) {
    const result = {
      code: 199,
      text:
        '翻译失败：' +
        '🚨没有配置服务哦，我猜你大概率是没有填腾讯翻译的信息，现在，你应该马不停蹄的点击右下角的设置按钮，去填写相关信息🚧'
    }
    last.result = result
    return result
  }
  const params = {
    SourceText: q,
    Source: from,
    Target: to,
    ProjectId: 0
  }

  if (window.servers) {
    return window.servers
      .tencentTextTranslate(keyConfig, params)
      .then(res => {
        const result = {
          code: 200,
          text: res.TargetText
        }
        last.result = result
        return result
      })
      .catch(async err => {
        const errQ = err.toString()
        // 翻译报错
        let { code: gCode, text: gText } = await google({
          q: errQ,
          from: 'auto',
          to: 'zh'
        })

        const result = {
          code: 199,
          text: gCode === 200 && gText ? gText : errQ
        }
        last.result = result
        return result
      })
  } else {
    const result = {
      code: 100,
      text: '请使用utools来调用该接口'
    }
    last.result = result
    return result
  }
}
