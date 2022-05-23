/**
 * 阿里翻译接口
 * https://help.aliyun.com/document_detail/97592.html
 *  */

import google from '../serve/google'
import { toResultData } from '../common'

/**
 * 机器翻译
 * @param {String} options.q 请求翻译query(UTF-8编码)
 * @param {String} options.from 翻译源语言(可设置为auto)
 * @param {String} options.to 翻译目标语言(不可设置为auto)
 * @param {Object} options.keyConfig key配置
 */
export default function ({ q, from, to, keyConfig }) {
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
        return toResultData(200, { text: Data.Translated })
      })
      .catch(async err => {
        const errQ = err.toString()
        // 翻译报错
        let { code: gCode, text: gText } = await google({
          q: errQ,
          from: 'auto',
          to: 'zh-CN'
        })
        return toResultData(500, null, gCode === 200 && gText ? gText : errQ)
      })
  } else {
    return toResultData(503)
  }
}

/** 签名 */
// function toSign() {
//   /** 1. 计算body的MD5值，然后再对其进行base64编码，编码后的值设置到 Header中。 */
//   /** 2. 使用请求中的Header参数构造规范化的Header字符串 */
//   /** 3. CanonicalizedResource 表示客户想要访问资源的规范描述，需要将子资源和qurey一同按照字典序，从小到大排列并以 & 为分隔符生成子资源字符串(?后的所有参数)，示例如下(alimt所有请求都不带参数)。*/
//   /** 4. 将上两步构造的规范化字符串按照下面的规则构造成待签名的字符串。 */
//   /** 5. 按照 RFC2104的定义，计算待签名字符串StringToSign的 HMAC 值，按照 Base64 编码规则把上面的 HMAC 值编码成字符串，并在前面加上AccessKeyId，即得到签名值（Authorization） */
// }
