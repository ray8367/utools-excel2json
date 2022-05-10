/**
 * 腾讯翻译接口
 * https://cloud.tencent.com/document/api/551/15619
 *  */

const TYPE_NAEM = 'tencent'
import { getKey } from '../keyStorage'
import google from './google'
import { languageCorrection } from '@/utils/language'

const last = {
  optionsStr: '',
  result: ''
}

/**
 * 机器翻译
 * @param {String} options.q 请求翻译query(UTF-8编码)
 * @param {String} options.from 翻译源语言(可设置为auto)
 * @param {String} options.to 翻译目标语言(不可设置为auto)
 */
export default function (options) {
  const { q } = options
  // 空值优化
  if (!q) {
    return ''
  }

  // 重复值优化
  const optionsStr = JSON.stringify(options)
  if (optionsStr === last.optionsStr) {
    return last.result
  }
  last.optionsStr = optionsStr

  // 语言修正
  const languageOpt = {
    zh: 'zh',
    en: 'en',
    jp: 'ja',
    ru: 'ru',
    de: 'de',
    fra: 'fr'
  }
  let { from, to } = languageCorrection(languageOpt, options)

  const credential = getKey(TYPE_NAEM)
  const params = {
    SourceText: q,
    Source: from,
    Target: to,
    ProjectId: 0
  }

  if (window.servers) {
    return window.servers
      .tencentTextTranslate(credential, params)
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
          text: gCode === 200 ? gText : errQ
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
