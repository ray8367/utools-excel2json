// export function baidsadsadu1 from './baidu'
import baidu from './baidu'
import tencent from './tencent'
import google from './google'

export default {
  baidu,
  tencent,
  google
}

/**
 * 翻译
 * @param {String} tag 翻译标识
 * @param {Object} params 参数
 */
export function translationCommon(tag, params) {
  const applys = {
    baidu,
    tencent,
    google
  }
  function defaultFun() {
    return {
      code: 0,
      text: '请选择翻译引擎'
    }
  }
  const fn = applys[tag] || defaultFun

  return fn(params)
}
