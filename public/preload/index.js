const tencent = require('./tencentcloudApi')

// const params = {
//   ProjectId: 0,
//   SourceText: 'hello',
//   Source: 'en',
//   Target: 'zh'
// }

// tencent
//   .textTranslate(credential, params)
//   .then(res => {
//     console.log('res:', res)
//   })
//   .catch(err => {
//     console.log('err:', err)
//   })

// 提供给web的方法
window.servers = {
  tencentTextTranslate: (credential, params) => {
    return tencent.textTranslate(credential, params)
  }
}
