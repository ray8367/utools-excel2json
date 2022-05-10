/**涉及node业务 */

const tencent = require('./tencentcloudApi')
const google = require('./googleTranslateApi')
const ali = require('./alicloudApi')

const _setImmediate = setImmediate
const _clearImmediate = clearImmediate
process.once('loaded', () => {
  global.setImmediate = _setImmediate
  global.clearImmediate = _clearImmediate
})

// 提供给web的方法
window.servers = {
  // 腾讯翻译
  tencentTextTranslate: (credential, params) => {
    return tencent.textTranslate(credential, params)
  },

  // 谷歌翻译
  googleTextTranslate: params => {
    // console.log('params:', params)
    const { q, from, to } = params
    return google.textTranslate(q, { from, to })
  },

  // 阿里翻译
  aliTextTranslate: (credential, params) => {
    return ali.textTranslate(credential, params)
  }
}
