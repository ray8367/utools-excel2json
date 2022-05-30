/**
 * 百度翻译接口
 * https://fanyi-api.baidu.com/doc/21
 *  */
import md5 from 'crypto-js/md5'
import axios from 'axios'
import { toResultData } from '../common'

function generateReqKey(config) {
  const { method, url } = config
  return [method, url].join('&')
}

const pendingRequest = new Map()
// 把当前请求信息添加到pendingRequest对象中
function addPendingRequest(config) {
  const requestKey = generateReqKey(config)
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken(cancel => {
      if (!pendingRequest.has(requestKey)) {
        pendingRequest.set(requestKey, cancel)
      }
    })
}

// 检查是否存在重复请求，若存在则取消已发的请求
function removePendingRequest(config) {
  const requestKey = generateReqKey(config)
  if (pendingRequest.has(requestKey)) {
    // console.log('从pendingRequest对象中移除请求:', requestKey)
    const cancelToken = pendingRequest.get(requestKey)
    cancelToken('cancel')
    pendingRequest.delete(requestKey)
  }
}

axios.interceptors.request.use(
  function (config) {
    removePendingRequest(config)
    addPendingRequest(config)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    removePendingRequest(response.config) // 从pendingRequest对象中移除请求
    return response
  },
  error => {
    removePendingRequest(error.config || {}) // 从pendingRequest对象中移除请求
    return Promise.reject(error)
  }
)

const errors = {
  52001: '请求超时，请重试',
  52002: '系统错误，请重试',
  52003: '未授权用户，请检查appid是否正确或者服务是否开通',
  54000: '必填参数为空，请检查是否少传参数',
  54001: '签名错误，请检查您的签名生成方法',
  54003:
    '访问频率受限，请降低您的调用频率，或进行身份认证后切换为高级版/尊享版',
  54004: '账户余额不足，请前往管理控制台为账户充值',
  54005: '长query请求频繁，请降低长query的发送频率，3s后再试',
  58000:
    '客户端IP非法，检查个人资料里填写的IP地址是否正确，可前往开发者信息-基本信息修改',
  58001: '译文语言方向不支持，检查译文语言是否在语言列表里',
  58002: '服务当前已关闭，请前往管理控制台开启服务',
  90107: '认证未通过或未生效，请前往我的认证查看认证进度'
}

/**
 * 通用翻译
 * @param {String} options.q 请求翻译query(UTF-8编码)
 * @param {String} options.from 翻译源语言(可设置为auto)
 * @param {String} options.to 翻译目标语言 (可设置为auto)
 * @param {Object} options.keyConfig key配置
 */
export default async function baiduTranslator({ q, from, to, keyConfig }) {
  const { appid, token } = keyConfig
  // 	随机数:可为字母或数字的字符串
  const salt = new Date().getTime()
  // 签名:(appid+q+salt+密钥)的MD5值
  const sign = md5(appid + q + salt + token).toString()
  const url = import.meta.env.VITE_BAIDU_BASEURL
  const params = {
    q: q,
    from,
    to,
    appid,
    salt,
    sign
  }

  try {
    const res = await axios.get(url, {
      params
    })
    const { error_code, error_msg, trans_result } = res.data
    let result
    if (error_code) {
      // 翻译失败
      result = toResultData(500, null, errors[error_code] || error_msg)

      if (error_code === '54003') {
        // 访问频率受限，返回503
        result = toResultData(503)
      }
    } else {
      // 翻译成功
      let text = ''
      trans_result.map(item => {
        text += item.dst + '\n'
      })

      result = toResultData(200, { text })
    }
    return result
  } catch (err) {
    if (err.message === 'cancel') {
      return toResultData(204)
    } else {
      return toResultData(500)
    }
  }
}
