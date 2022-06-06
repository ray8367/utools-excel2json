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
  100002: '关键参数缺失，例如Action, Version参数。',
  100003: '缺少身份认证的必要信息，例如Auth信息。',
  100004: '缺少请求必要信息，例如：Access Key，Service，Region等。',
  100005: '缺少签名结果。',
  100006: '请求过期或请求的签名时间来自未来。',
  100007: '请求的服务不存在。',
  100008: '请求接口不存在。',
  100009: '请求的Access Key不合法。',
  100010: '签名结果不正确。',
  100012: '子用户缺少权限。',
  100013: '子用户拥有的权限不支持当前操作。',
  100014: '内部错误。',
  100015: '已通过身份认证，但服务无法连接。',
  100016: '服务执行超时。',
  100018: '请求过于频繁，超出了基本限速。',
  100019: '处于熔断状态的服务暂时不可访问，稍后重试。',
  100020: 'Http method不合法。',
  100023: '服务存在故障。',
  100024: 'Authorization头格式错误，检查Authorization。',
  100025: 'Authorization头中的Credential格式错误，检查Credential。',
  100026: '错误的STS or STS2，可能是多种错误，例如签名错误、过期等。'
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

  const query = 'Action=TranslateText&Version=2020-06-01'
  const bodyData = {
    TextList: [q],
    SourceLanguage: from,
    TargetLanguage: to
  }

  const headers = toSign(query, bodyData, keyConfig)

  try {
    const res = await axios.post(url + `?${query}`, bodyData, { headers })
    const { TargetText, Error } = res.data?.ResponseMetadata
    let result
    const apiError = Error?.CodeN
    if (apiError) {
      return toResultData(500, null, errors[apiError])
    } else {
      result = toResultData(200, { text: TargetText })
    }
    return result
  } catch (err) {
    const apiError = err?.response?.data?.ResponseMetadata?.Error?.CodeN
    console.log('apiError:', apiError)
    if (apiError) {
      return toResultData(500, null, errors[apiError])
    } else {
      console.error(err)
      return toResultData(500)
    }
  }
}

/** 获取规范化header数组 */
function getCanonicalHeadersArr(headers) {
  let result = []
  Object.keys(headers).forEach(key => {
    result.push({
      key: key.toLowerCase(),
      value: headers[key]
    })
  })
  result.sort((h1, h2) => {
    return h1.key.charCodeAt() - h2.key.charCodeAt()
  })
  console.log(result)
  return result
}

/** 生成签名 */
function toSign(query, bodyData, keyConfig) {
  const payload = JSON.stringify(bodyData)
  const { accessKeyId, secretAccessKey } = keyConfig
  const nowTime = dayjs().add('-8', 'h')
  const xDate = nowTime.format('YYYYMMDDTHHmmss[Z]')
  const date = xDate.slice(0, 8)
  const headers = {
    'X-Host': 'open.volcengineapi.com',
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Sha256': SHA256(payload).toString(encHex),
    'X-Date': xDate
  }
  const headerArr = getCanonicalHeadersArr(headers)
  const headerKeys = headerArr.map(item => item.key)
  const region = 'cn-north-1'
  const service = 'translate'
  /** 1. 创建一个正规化请求  */
  const HTTPRequestMethod = 'POST'
  const CanonicalURI = '/'
  const CanonicalQueryString = query
  let CanonicalHeaders = ''
  headerArr.forEach(item => {
    CanonicalHeaders += `${item.key}:${item.value}\n`
  })
  const SignedHeaders = headerKeys.join(';')

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
  const Algorithm = 'HMAC-SHA256'
  const RequestDate = xDate
  const CredentialScope = `${date}/${region}/${service}/request`
  const StringToSign =
    Algorithm +
    '\n' +
    RequestDate +
    '\n' +
    CredentialScope +
    '\n' +
    // HexEncode(Hash(CanonicalRequest))
    SHA256(CanonicalRequest).toString(encHex)
  console.log(StringToSign)

  /** 3：构建签名 */
  console.log('3：构建签名')
  // const Signingkey = HMAC(HMAC(HMAC(HMAC(kSecret,"20201230"),"cn-north-1"),"iam"),"request");
  const signingkey_temp1 = hmacSHA256(date, secretAccessKey)
  const signingkey_temp2 = hmacSHA256(region, signingkey_temp1)
  const signingkey_temp3 = hmacSHA256(service, signingkey_temp2)
  const Signingkey = hmacSHA256('request', signingkey_temp3)
  const signature = hmacSHA256(StringToSign, Signingkey).toString(encHex)
  console.log(signature)
  /** 4：将签名添加到请求当中 */
  console.log('4：将签名添加到请求当中')
  const authorization = `HMAC-SHA256 Credential=${accessKeyId}/${CredentialScope}, SignedHeaders=${SignedHeaders}, Signature=${signature}`
  console.log('authorization:', authorization)
  headers.Authorization = authorization
  console.log(headers)
  return headers
}
