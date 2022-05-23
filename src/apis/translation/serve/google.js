/**
 * 谷歌翻译接口
 * https://github.com/vitalets/google-translate-api
 *  */
import { toResultData } from '../common'

/**
 * 机器翻译
 * @param {String} options.q 请求翻译query
 * @param {String} options.from 翻译源语言(可设置为auto)
 * @param {String} options.to 翻译目标语言(不可设置为auto)
 * @param {Object} options.keyConfig key配置
 */
export default function ({ q, from, to }) {
  if (window.servers) {
    return window.servers
      .googleTextTranslate({
        q,
        from,
        to
      })
      .then(res => {
        return toResultData(200, { text: res.text })
      })
      .catch(err => {
        return toResultData(500, null, err)
      })
  } else {
    return toResultData(403)
  }
}
