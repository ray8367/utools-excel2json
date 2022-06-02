/** 涉及node业务 */

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
  // 谷歌翻译
  googleTextTranslate: params => {
    try {
      const { q, from, to } = params
      return google.textTranslate(q, { from, to })
    } catch (error) {
      return error
    }
  },

  // 阿里翻译
  aliTextTranslate: (params, credential) => {
    return ali.textTranslate(params, credential)
  }
}
