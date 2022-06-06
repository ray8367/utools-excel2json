/**
 * 火山翻译接口
 * https://www.volcengine.com/docs/4640/62099
 *  */
import SHA256 from 'crypto-js/sha256'
import encHex from 'crypto-js/enc-hex'
import hmacSHA256 from 'crypto-js/hmac-sha256'
import axios from 'axios'
import { toResultData } from '../common'
import dayjs from 'dayjs'

const errors = {
  100001: '一般不出现这个问题，这是系统开发兜底的错误提示',
  100002: '关键参数缺失，例如Action, Version参数',
  100003: '缺少身份认证的必要信息，例如Auth信息',
  100004: '缺少请求必要信息，例如：Accesskey，service，region等',
  100005: '缺少签名结果',
  100006: '请求过期或请求的签名时间来自未来',
  100007: '请求的服务不存在',
  100008: '请求接口不存在',
  100009: '请求的AK不合法',
  100010: '签名结果不正确',
  100011:
    '使用service aksk访问请求，仅能访问自己的接口和公共服务的接口。公共服务例如：iam',
  100012: '子用户请求缺少权限（默认是deny的）',
  100013: '子用户拥有的权限不支持当前操作',
  100014: '业务服务存在故障，这里的业务一般指具体的imagex、vod。故障不来自TOP',
  100015: '业务服务连接不上，这里的业务一般指具体的imagex、vod。',
  100016: '内部服务执行超时，请查看服务在TOP上配置的超时时间。',
  100017: 'Service aksk请求内部服务时缺少了账号信息',
  100018: '请求过于频繁，超出了基本限速',
  100019: '处于熔断状态的服务暂时不可访问，稍后重试',
  100020: 'Http method不合法',
  100021: '请求需要验证Project的权限，当前Project权限验证不合法'
}

/**
 * 机器翻译
 * @param {String} options.q 请求翻译query(UTF-8编码)
 * @param {String} options.from 翻译源语言(可设置为auto)
 * @param {String} options.to 翻译目标语言(不可设置为auto)
 * @param {Object} options.keyConfig key配置
 */
export default async function ({ q, from, to, keyConfig }) {
  const url = import.meta.env.VITE_HUOSHAN_BASEURL
  const nowTime = dayjs()
  const timestamp = nowTime.unix().toString()
  // const date = nowTime.format('YYYY-MM-DD')
  const query = 'Action=TranslateText&Version=2020-06-01'
  const params = {
    TextList: [q],
    SourceLanguage: from,
    TargetLanguage: to
  }

  const authorization = toSign(query, params, keyConfig, timestamp, nowTime)
  const headers = {
    'Content-Type': 'application/json'
  }
  try {
    const res = await axios.post(url + `?${query}`, params, { headers })
    const { TargetText, Error } = res.data?.Response
    let result
    if (Error) {
      // 翻译失败
      result = toResultData(500, null, errors[Error.Code])
    } else {
      console.log('TargetText:', TargetText)
      result = toResultData(200, { text: TargetText })
    }
    return result
  } catch (err) {
    const apiError = err?.response?.data?.ResponseMetadata?.Error?.CodeN
    if (apiError) {
      console.log('sss')
      return toResultData(500, null, errors[apiError])
    } else {
      console.error(err)
      return toResultData(500)
    }
  }
}

/** 规范化header */
function getCanonicalHeadersEntry(headerName, headerValue) {
  let result = `${headerName}:${headerValue.trim()}\n`
  return result.toLowerCase()
}

/** 生成签名 */
function toSign(query, params, keyConfig, timestamp, nowTime) {
  const payload = JSON.stringify(params)
  const { secretId, secretKey } = keyConfig
  /** 1. 创建一个正规化请求  */
  const HTTPRequestMethod = 'POST'
  const CanonicalURI = '/'
  const CanonicalQueryString = query
  const CanonicalHeaders = getCanonicalHeadersEntry(
    'Content-Type',
    'application/json'
  )
  const SignedHeaders = 'content-type'

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
    SHA256(payload).toString(encHex)

  console.log(CanonicalRequest)

  /** 2. TODO:创建签名字符串 */
  console.log('2. 创建签名字符串')
  const StringToSign =
    'HMAC-SHA256' +
    '\n' +
    nowTime.format('YYYYMMDDTHHMMSSZ') +
    '\n' +
    nowTime.format('YYYYMMDD') +
    '/region/service/request' +
    '\n' +
    // HexEncode(Hash(CanonicalRequest))
    SHA256(CanonicalRequest).toString(encHex)
  console.log(StringToSign)
}
