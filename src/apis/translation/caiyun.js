/**
 * 彩云小译
 * https://ai.youdao.com/DOCSIRMA/html/%E8%87%AA%E7%84%B6%E8%AF%AD%E8%A8%80%E7%BF%BB%E8%AF%91/API%E6%96%87%E6%A1%A3/%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E6%9C%8D%E5%8A%A1/%E6%96%87%E6%9C%AC%E7%BF%BB%E8%AF%91%E6%9C%8D%E5%8A%A1-API%E6%96%87%E6%A1%A3.html
 *  */

import axios from 'axios'
import { getKeyByTag } from '@/store/userSetting'
import { languageCorrectionByTag } from '@/utils/language'

const TAG_NAME = 'caiyun'

const last = {
  optionsStr: '',
  result: ''
}

/**
 * 通用翻译
 * @param {String} options.q 请求翻译query(UTF-8编码)
 * @param {String} options.from 翻译源语言(可设置为auto)
 * @param {String} options.to 翻译目标语言 (可设置为auto)
 * @param {Boolean} options.isRefresh 强制刷新
 */
export default function (options) {
  let { q, isRefresh } = options

  // 空值优化
  if (!q) {
    return ''
  }

  // 重复值优化
  const optionsStr = JSON.stringify(options)

  // 语言修正
  let { from, to } = languageCorrectionByTag(TAG_NAME, options)

  if (!isRefresh && optionsStr === last.optionsStr) {
    return last.result
  }
  last.optionsStr = optionsStr

  const url = import.meta.env.VITE_CAIYUN_BASEURL
  const keyConfig = getKeyByTag(TAG_NAME)
  if (!keyConfig || !keyConfig.token) {
    const result = {
      code: 199,
      text:
        '翻译失败：' +
        '没有配置服务哦🚨，我猜你大概率是没有填彩云小译的信息，现在，你应该马不停蹄的点击右下角的设置按钮，去填写相关信息🖊️'
    }
    last.result = result
    return result
  }

  // 翻译方式
  const direction = from + '2' + to
  const data = {
    source: q,
    trans_type: direction,
    request_id: 'demo',
    detect: true
  }

  const headers = {
    'content-type': 'application/json',
    'x-authorization': 'token ' + keyConfig.token
  }

  return axios
    .post(url, data, { headers })
    .then(res => {
      console.log('res:', res.data)
      const { target } = res.data
      let result
      if (target) {
        // 翻译成功
        result = {
          code: 200,
          text: target
        }
      } else {
        // 翻译失败
        result = {
          code: 199,
          text: '翻译失败'
        }
      }
      last.result = result
      return result
    })
    .catch(err => {
      const result = {
        code: 199,
        text: '翻译失败：' + err.message
      }
      last.result = result
      return result
    })
}
