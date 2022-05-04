/**
 * 百度翻译接口
 * https://fanyi-api.baidu.com/doc/21
 *  */
import md5 from 'md5'
import axios from 'axios'
const TYPE_NAEM = 'baidu'
import { getKey } from '../keyStorage'

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
 * @param {String} param0.q 请求翻译query(UTF-8编码)
 * @param {String} param0.from 翻译源语言(可设置为auto)
 * @param {String} param0.to 翻译目标语言(不可设置为auto)
 */
export default function ({ q, from, to }) {
  if (!q) {
    return ''
  }
  const url = import.meta.env.VITE_BAIDU_BASEURL
  const { appid, token } = getKey(TYPE_NAEM)
  // 	随机数:可为字母或数字的字符串
  const salt = new Date().getTime()
  // 签名:(appid+q+salt+密钥)的MD5值
  const sign = md5(appid + q + salt + token)

  const params = {
    q: q,
    from,
    to,
    appid,
    salt,
    sign
  }

  return axios
    .get(url, { params })
    .then(res => {
      const { error_code, error_msg, trans_result } = res.data
      if (error_code) {
        return errors[error_code] || '翻译失败：' + error_msg
      } else {
        let result = ''
        trans_result.map(item => {
          result += item.dst + '\n'
        })
        return result
        // return trans_result[0].dst
      }
    })
    .catch(err => {
      return '翻译失败：' + err.message
      // console.log('err:', err)
    })
}
