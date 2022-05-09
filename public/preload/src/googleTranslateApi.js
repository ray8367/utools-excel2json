/**
 * 谷歌翻译
 */
const rawTranslate = require('@vitalets/google-translate-api')

module.exports = {
  textTranslate: function (text, opts) {
    opts.to = opts.to || 'zh'
    opts.tld = 'cn'
    return rawTranslate(text, opts)
  }
}
