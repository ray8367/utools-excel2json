/**翻译密钥获取或配置 */
import { keyStorage, homeOptionStorage, defaultStorage } from '@/utils/storage'

// export default function () {
//   //  首页翻译方式选项
//   const homeOptions = ref([])

//   // 默认翻译
//   const defaultApi = ref('baidu')

//   // 密钥值
//   const keysOptions = ref({})

//   onMounted(() => {
//     keysOptions.value = keyStorage.get()
//     homeOptions.value = homeOptionStorage.get() || apiOptions
//     defaultApi.value = defaultStorage.get() || 'baidu'
//   })

//   return {
//     homeOptions,
//     defaultApi,
//     keysOptions,
//     saveSetting
//   }
// }

function testInit() {
  const setData = {
    keysOptions: {
      baidu: {
        appid: '20190324000280623',
        token: 'uXMeEILLbOwuPz5BbekJ'
      },

      tencent: {
        secretId: 'AKIDTmpc8NL2ViBPM2RaS3NREkzyh9KEsFK8',
        secretKey: 'Zrsc5IEsGOFo69vPcYCZfT1II0SdXA9t'
      },

      youdao: {
        appid: '30990f23a6937c8b',
        appkey: 'C3mghAaw8FoUCKkGSBJMF5jm7prKZQfS'
      },

      ali: {
        accessKeyId: 'LTAI5tQPT1B6nfGYCZ1oN3xD',
        accessKeySecret: '31KbiyH05LkrTxjgw8El6KBDDe8fD5'
      }
    },
    homeHasApi: ['baidu', 'tencent', 'youdao', 'ali'],
    defaultApi: 'baidu'
  }
  saveSetting(setData)
}

/**获取设置 */
export function getSetting() {
  testInit()
  //  首页翻译方式选项
  const homeOptions = homeOptionStorage.get() || []
  // 默认翻译
  const defaultApi = defaultStorage.get() || 'baidu'
  // 密钥值
  const keysOptions = keyStorage.get()

  return {
    homeOptions,
    defaultApi,
    keysOptions
  }
}

/**保存设置 */
export function saveSetting(data) {
  console.log('保存设置：', data)
  keyStorage.set(data.keysOptions)
  homeOptionStorage.set(data.homeHasApi)
  defaultStorage.set(data.defaultApi)
}
