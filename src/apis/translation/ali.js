/**
 * 阿里翻译接口
 * https://help.aliyun.com/document_detail/97592.html
 *  */

const TAG_NAME = 'ali'
import { keyStorage } from '@/utils/storage'
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
  const languageOpt = {
    zh: 'zh',
    en: 'en',
    jp: 'ja',
    ru: 'ru',
    de: 'de',
    fra: 'fr',
    cht: 'zh-tw',
    kor: 'ko'
  }
  let { from, to } = languageCorrection(languageOpt, options)

  const keyConfig = keyStorage.getKeyByTag(TAG_NAME)
  if (!keyConfig || !keyConfig.accessKeyId || !keyConfig.accessKeySecret) {
    const result = {
      code: 199,
      text: '翻译失败：' + '没有配置服务哦，请前往设置页面配置后再使用'
    }
    last.result = result
    return result
  }
  console.log('22?')
  var params = {
    SourceText: q,
    SourceLanguage: from,
    TargetLanguage: to,
    FormatType: 'text',
    Scene: 'general'
  }

  if (window.servers) {
    return window.servers
      .aliTextTranslate(keyConfig, params)
      .then(res => {
        const { Data } = res
        let result = {
          text: Data.Translated,
          code: 200
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

/**签名 */
// function toSign() {
//   /** 1. 计算body的MD5值，然后再对其进行base64编码，编码后的值设置到 Header中。 */
//   /** 2. 使用请求中的Header参数构造规范化的Header字符串 */
//   /** 3. CanonicalizedResource 表示客户想要访问资源的规范描述，需要将子资源和qurey一同按照字典序，从小到大排列并以 & 为分隔符生成子资源字符串(?后的所有参数)，示例如下(alimt所有请求都不带参数)。*/
//   /** 4. 将上两步构造的规范化字符串按照下面的规则构造成待签名的字符串。 */
//   /** 5. 按照 RFC2104的定义，计算待签名字符串StringToSign的 HMAC 值，按照 Base64 编码规则把上面的 HMAC 值编码成字符串，并在前面加上AccessKeyId，即得到签名值（Authorization） */
// }
