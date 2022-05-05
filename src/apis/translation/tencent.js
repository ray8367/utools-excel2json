/**
 * 腾讯翻译接口
 * https://cloud.tencent.com/document/api/551/15619
 *  */

const TYPE_NAEM = 'tencent'
import { getKey } from '../keyStorage'

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
  const { q, from, to } = options
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
        const { TargetText } = res
        last.result = TargetText
        return TargetText
      })
      .catch(err => {
        last.result = err
        return err
      })
  } else {
    const err = '请使用utools来调用该接口'
    last.result = err
    return err
  }
}
