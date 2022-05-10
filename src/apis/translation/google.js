/**
 * 谷歌翻译接口
 * https://github.com/vitalets/google-translate-api
 *  */
import { languageCorrection } from '@/utils/language'

const last = {
  optionsStr: '',
  result: ''
}

/**
 * 机器翻译
 * @param {String} options.q 请求翻译query
 * @param {String} options.from 翻译源语言(可设置为auto)
 * @param {String} options.to 翻译目标语言(不可设置为auto)
 */
export default function (options) {
  // 空值优化
  const { q } = options
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
    zh: 'zh-CN',
    en: 'en',
    jp: 'ja',
    ru: 'ru',
    de: 'de',
    fra: 'fr',
    cht: 'zh-TW',
    kor: 'ko'
  }
  let { from, to } = languageCorrection(languageOpt, options)

  if (window.servers) {
    return window.servers
      .googleTextTranslate({
        q,
        from,
        to
      })
      .then(res => {
        const result = {
          code: 200,
          text: res.text
        }
        last.result = result
        return result
      })
      .catch(err => {
        console.log('err:', err)

        const result = {
          code: 199,
          text: '翻译失败：' + err
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
