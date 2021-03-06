import {
  获取指定的翻译方法,
  返回状态码及信息,
  读取并检查密钥配置
} from './common'
import { languageCorrectionByTag } from '@/utils/language'
import { updateLog } from '../log'
/**
 * 翻译
 * @param {String} tag 翻译标识
 * @param {String} options.q 请求翻译query(UTF-8编码)
 * @param {String} options.from 翻译源语言(可设置为auto)
 * @param {String} options.to 翻译目标语言 (可设置为auto)
 */
export async function 通用翻译(tag, options) {
  const { q, isRefresh } = options
  // let last
  // 空值优化
  if (!q) {
    return 返回状态码及信息(400)
  }

  // 重复值优化
  // TODO: 因为重复性验证操作提到了翻译服务之前，所以对于切换翻译方式来说每次参数都不一样，原有方法没用了
  // TODO: 考虑将不同tag翻译结果整合，针对tag来做判断是否与上次相同
  // const optionsStr = JSON.stringify({ tag, ...options })
  // console.log('optionsStr:', optionsStr)
  // console.log('last:', last.optionsStr)
  // if (!isRefresh && optionsStr === last.optionsStr) {
  //   return last.result
  // }

  // 语言修正
  let { from, to } = languageCorrectionByTag(tag, options)

  // 读取密钥信息
  const checkKey = 读取并检查密钥配置(tag)
  if (!checkKey.flag) {
    return 返回状态码及信息(401, null, checkKey.msg)
  }

  const keyConfig = checkKey.keyConfig

  const fn = 获取指定的翻译方法(tag)
  if (!fn) {
    return 返回状态码及信息(400, null, '这个功能还在建设中哦')
  }

  let result = await fn({ q, from, to, keyConfig })
  if (result.code === 503) {
    // 访问频率受限，再次发起翻译
    return await 通用翻译(tag, options)
  }
  updateLog(tag)

  // last.result = result
  // last.optionsStr = optionsStr
  return result
}
