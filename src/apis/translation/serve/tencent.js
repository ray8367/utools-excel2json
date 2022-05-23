/**
 * 腾讯翻译接口
 * https://cloud.tencent.com/document/api/551/15619
 *  */

import google from './google'
import { toResultData } from '../common'

/**
 * 机器翻译
 * @param {String} options.q 请求翻译query(UTF-8编码)
 * @param {String} options.from 翻译源语言(可设置为auto)
 * @param {String} options.to 翻译目标语言(不可设置为auto)
 * @param {Object} options.keyConfig key配置
 */
export default function ({ q, from, to, keyConfig }) {
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
        return toResultData(200, { text: res.TargetText })
      })
      .catch(async err => {
        const errQ = err.toString()
        // 翻译报错 谷歌翻译报错
        let { code: gCode, text: gText } = await google({
          q: errQ,
          from: 'auto',
          to: 'zh-CN'
        })
        return toResultData(500, null, gCode === 200 && gText ? gText : errQ)
      })
  } else {
    return toResultData(403)
  }
}
