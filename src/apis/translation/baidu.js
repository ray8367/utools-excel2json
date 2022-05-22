/**
 * 百度翻译接口
 * https://fanyi-api.baidu.com/doc/21
 *  */
import md5 from 'crypto-js/md5'
import axios from 'axios'
import { getKeyByTag } from '@/store/userSetting'

const TAG_NAME = 'baidu'

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

const last = {
  optionsStr: '',
  result: ''
}

async function baiduTranslator({ q, from, to, appid, token }) {
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
    const res = await axios.get(url, { params })
    const { error_code, error_msg, trans_result } = res.data
    let result
    if (error_code) {
      // 翻译失败
      result = {
        code: 199,
        error_code: error_code,
        text: error_code + '：' + errors[error_code] || '翻译失败：' + error_msg
      }
      if (error_code === '54003') {
        // 访问频率受限，再次发起翻译
        result.code = 110
      }
    } else {
      // 翻译成功
      let text = ''
      trans_result.map(item => {
        text += item.dst + '\n'
      })
      result = {
        code: 200,
        text: text
      }
    }
    last.result = result
    return result
  } catch (err) {
    const result = {
      code: 199,
      text: '翻译失败：' + err.message
    }
    last.result = result
    return result
  }
}

/**
 * 通用翻译TODO: 近期考虑统一各翻译的通用设置
 * @param {String} options.q 请求翻译query(UTF-8编码)
 * @param {String} options.from 翻译源语言(可设置为auto)
 * @param {String} options.to 翻译目标语言(不可设置为auto)
 * @param {Boolean} options.isRefresh 强制刷新
 */
export default async function (options) {
  const { q, from, to, isRefresh } = options
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

  const keyConfig = getKeyByTag(TAG_NAME)
  if (!keyConfig || !keyConfig.appid || !keyConfig.token) {
    const result = {
      code: 199,
    }
    last.result = result
    return result
  }
  const { appid, token } = keyConfig

  let res = await baiduTranslator({ q, from, to, appid, token })
  console.log('res:', res)
  if (res.code === 110) {
    // 访问频率受限，再次发起翻译
    res = await baiduTranslator({ q, from, to, appid, token })
  }
  return res
}
