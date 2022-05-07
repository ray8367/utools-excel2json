/**
 * 谷歌翻译
 */
const rawTranslate = require('@vitalets/google-translate-api')

const languages = rawTranslate.languages
languages['zh'] = languages['zh-CN']
languages['zh-tw'] = languages['zh-TW']

module.exports = {
  textTranslate: function (text, opts) {
    opts.to = opts.to || 'zh'
    opts.tld = 'cn'
    return rawTranslate(text, opts)
  }
}
