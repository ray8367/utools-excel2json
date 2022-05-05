/**密钥存取(临时) */
import { baidu, tencent } from '@/config'

/**
 * 获取密钥
 * @param {String} type 第三方api标识 百度翻译:baidu
 */
export function getKey(type) {
  const keyDatas = {
    baidu,
    tencent
  }
  return keyDatas[type]
}
