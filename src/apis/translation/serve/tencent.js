/**
 * 腾讯翻译接口
 * https://cloud.tencent.com/document/api/551/15619
 *  */
import SHA256 from 'crypto-js/sha256'
import encHex from 'crypto-js/enc-hex'
import hmacSHA256 from 'crypto-js/hmac-sha256'
import axios from 'axios'
import google from './google'
import { toResultData } from '../common'
import dayjs from 'dayjs'
/**
 * 机器翻译
 * @param {String} options.q 请求翻译query(UTF-8编码)
 * @param {String} options.from 翻译源语言(可设置为auto)
 * @param {String} options.to 翻译目标语言(不可设置为auto)
 * @param {Object} options.keyConfig key配置
 */
export default async function ({ q, from, to, keyConfig }) {
  const url = import.meta.env.VITE_TENCENT_BASEURL
  const nowTime = dayjs()
  const timestamp = nowTime.unix()
  const date = nowTime.format('YYYY-MM-DD')
  const params = {
    SourceText: q,
    Source: from,
    Target: to,
    ProjectId: 0
  }

  const authorization = toSign(params, keyConfig, timestamp, date)
  const headers = {
    'X-TC-Action': 'TextTranslate',
    'X-TC-Version': '2018-03-21',
    'X-TC-Region': 'ap-shanghai',
    'X-TC-Timestamp': timestamp,
    'X-TC-Authorization': authorization,
    'Content-Type': 'application/json',
    Host: 'cvm.tencentcloudapi.com'
  }

  const res = await axios.post(url, params, headers)

  console.log('res:', res)

  // if (window.servers) {
  //   return window.servers
  //     .tencentTextTranslate(keyConfig, params)
  //     .then(res => {
  //       return toResultData(200, { text: res.TargetText })
  //     })
  //     .catch(async err => {
  //       const errQ = err.toString()
  //       // 翻译报错 谷歌翻译报错
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
}

/**
 * 机器翻译
 * @param {String} options.q 请求翻译query(UTF-8编码)
 * @param {String} options.from 翻译源语言(可设置为auto)
 * @param {String} options.to 翻译目标语言(不可设置为auto)
 * @param {Object} options.keyConfig key配置
 */
export function old({ q, from, to, keyConfig }) {
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

/** 生成签名 */
function toSign(params, keyConfig, timestamp, date) {
  console.log('toSign()')

  const payload = JSON.stringify(params)
  const { secretId, secretKey } = keyConfig
  /** 1. 拼接规范请求串 */
  console.log('1. 拼接规范请求串 ')
  const HTTPRequestMethod = 'POST',
    CanonicalURI = '/',
    CanonicalQueryString = '',
    CanonicalHeaders =
      'content-type:application/json; charset=utf-8\nhost:cvm.tencentcloudapi.com\n',
    SignedHeaders = 'content-type;host'
  // const HashedRequestPayload = SHA256(body).toString(encHex).toLowerCase()
  const HashedRequestPayload = SHA256(payload).toString(encHex).toLowerCase()

  const CanonicalRequest =
    HTTPRequestMethod +
    '\n' +
    CanonicalURI +
    '\n' +
    CanonicalQueryString +
    '\n' +
    CanonicalHeaders +
    '\n' +
    SignedHeaders +
    '\n' +
    HashedRequestPayload
  console.log('CanonicalRequest:', CanonicalRequest)
  /** 2. 拼接待签名字符串 */
  console.log('2. 拼接待签名字符串')
  const Algorithm = 'TC3-HMAC-SHA256'
  const RequestTimestamp = timestamp // 时间戳
  const CredentialScope = `${date}/cvm/tc3_request` // 需与时间戳的日期保持一致
  const HashedCanonicalRequest = SHA256(CanonicalRequest)
    .toString(encHex)
    .toLowerCase()

  const StringToSign =
    Algorithm +
    '\n' +
    RequestTimestamp +
    '\n' +
    CredentialScope +
    '\n' +
    HashedCanonicalRequest

  console.log('StringToSign:', StringToSign)
  /** 3. 计算签名 */
  console.log(' 3. 计算签名')

  const SecretDate = hmacSHA256(date, 'TC3' + secretKey)
  const SecretService = hmacSHA256('cvm', SecretDate)
  const SecretSigning = hmacSHA256('tc3_request', SecretService)
  const Signature = hmacSHA256(StringToSign, SecretSigning).toString(encHex)
  console.log('Signature:', Signature)

  /** 4. 拼接 Authorization */
  console.log(' 拼接 Authorization')
  const Authorization =
    Algorithm +
    ' ' +
    'Credential=' +
    secretId +
    '/' +
    CredentialScope +
    ', ' +
    'SignedHeaders=' +
    SignedHeaders +
    ', ' +
    'Signature=' +
    Signature

  console.log('Authorization:', Authorization)
  return Authorization
}
