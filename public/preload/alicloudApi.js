/**
 * 阿里云翻译
 */
const Core = require('@alicloud/pop-core')

function initClient({ accessKeyId, accessKeySecret }) {
  return new Core({
    accessKeyId: accessKeyId,
    accessKeySecret: accessKeySecret,
    // securityToken: '<your-sts-token>', // use STS Token
    endpoint: 'https://mt.aliyuncs.com',
    apiVersion: '2018-10-12'
  })
}

module.exports = {
  textTranslate: function (credential, params) {
    let client = initClient(credential)

    const requestOption = {
      method: 'POST',
      formatParams: false
    }
    return client.request('TranslateGeneral', params, requestOption)
  }
}
