/**
 * 腾讯云翻译
 */
const tencentcloud = require('tencentcloud-sdk-nodejs/tencentcloud/services/tmt')

// 导入对应产品模块的client models。
const TmtClient = tencentcloud.tmt.v20180321.Client

function initClient({ secretId, secretKey }) {
  const clientConfig = {
    // 腾讯云认证信息
    credential: {
      secretId,
      secretKey
    },
    // 产品地域
    region: 'ap-shanghai',
    // 可选配置实例
    profile: {
      signMethod: 'TC3-HMAC-SHA256', // 签名方法
      httpProfile: {
        reqMethod: 'POST', // 请求方法
        reqTimeout: 30 // 请求超时时间，默认60s
      }
    }
  }

  return new TmtClient(clientConfig)
}

module.exports = {
  textTranslate: function (credential, params) {
    let client = initClient(credential)
    return client.TextTranslate(params)
  }
}
