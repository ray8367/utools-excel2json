/**
 * 阿里翻译接口
 * https://help.aliyun.com/document_detail/97592.html
 *  */

import md5 from 'crypto-js/md5'
import Base64 from 'crypto-js/enc-base64'
import hmacSHA1 from 'crypto-js/hmac-sha1'
import { nanoid } from 'nanoid'
import axios from 'axios'
import google from '../serve/google'
import { toResultData } from '../common'

/**
 * 机器翻译
 * @param {String} options.q 请求翻译query(UTF-8编码)
 * @param {String} options.from 翻译源语言(可设置为auto)
 * @param {String} options.to 翻译目标语言(不可设置为auto)
 * @param {Object} options.keyConfig key配置
 */
export default async function ({ q, from, to, keyConfig }) {
  const date = new Date().toGMTString()

  var params = {
    Action: 'TranslateGeneral',
    SourceText: q,
    SourceLanguage: from,
    TargetLanguage: to,
    FormatType: 'text',
    Scene: 'general'
  }
  const bodyString = JSON.stringify(params)

  const { bodyMd5, uuid, authHeader } = toSign(date, bodyString, keyConfig)
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json;chrset=utf-8',
    'Content-MD5': bodyMd5,
    'Content-Length': bodyString.length,
    'x-acs-Date': date,
    'x-acs-Host': 'mt.cn-hangzhou.aliyuncs.com',
    Authorization: authHeader,
    'x-acs-signature-nonce': uuid,
    'x-acs-signature-method': 'HMAC-SHA1',
    'x-acs-version': '2019-01-02'
  }

  console.log('headers:', headers)

  const url = import.meta.env.VITE_ALI_BASEURL + '/api/translate/web/ecommerce'

  try {
    const res = await axios.post(url, params, { headers })
    console.log('res:', res)
  } catch (err) {
    console.error(err)
    return toResultData(500)
  }

  // if (window.servers) {
  //   return window.servers
  //     .aliTextTranslate(keyConfig, params)
  //     .then(res => {
  //       const { Data } = res
  //       return toResultData(200, { text: Data.Translated })
  //     })
  //     .catch(async err => {
  //       const errQ = err.toString()
  //       // 翻译报错
  //       let { code: gCode, text: gText } = await google({
  //         q: errQ,
  //         from: 'auto',
  //         to: 'zh-CN'
  //       })
  //       return toResultData(500, null, gCode === 200 && gText ? gText : errQ)
  //     })
  // } else {
  //   return toResultData(403)
  // }
  return toResultData(200, { text: '逗你玩~' })
}

/** 签名 */
function toSign(date, bodyString, keyConfig) {
  console.log('toSign()')
  const { accessKeySecret, accessKeyId } = keyConfig

  /** 1.对body做MD5+BASE64加密 */
  const bodyMd5 = Base64.stringify(md5(bodyString))
  console.log('bodyMd5:', bodyMd5)
  const uuid = nanoid()
  const stringToSign =
    'POST' +
    '\n' + // HTTP_Verb只支持POST
    'application/json' +
    '\n' + // Accept为application/json
    bodyMd5 +
    '\n' + // 第1步中计算出来的MD5值
    'application/json;chrset=utf-8' +
    '\n' + // Content-Type值为application/json;chrset=utf-8
    date +
    '\n' + // Date值为GMT时间
    'x-acs-signature-method:HMAC-SHA1\n' +
    'x-acs-signature-nonce:' +
    uuid +
    '\n' +
    'x-acs-version:2019-01-02' +
    '\n'
  console.log('stringToSign:', stringToSign)

  /** 2.计算 HMAC-SHA1 */
  const signature = hmacSHA1(stringToSign, accessKeySecret).toString()
  console.log('signature:', signature)

  /** 3. 得到 authorization header */
  const authHeader = 'acs ' + accessKeyId + ':' + signature
  return {
    bodyMd5,
    uuid,
    authHeader
  }
}
