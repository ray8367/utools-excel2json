export const voiceMap = {
  auto: 'zh-CN-XiaoxiaoNeural',
  zh: 'zh-CN-XiaoxiaoNeural',
  en: 'en-GB-LibbyNeural',
  jp: 'ja-JP-NanamiNeural',
  ru: 'ru-RU-SvetlanaNeural',
  de: 'de-AT-IngridNeural',
  fra: 'fr-FR-DeniseNeural',
  cht: 'zh-TW-HsiaoChenNeural',
  kor: 'ko-KR-SunHiNeural'
}
const baseUrl = import.meta.env.VITE_UNIAPI_BASEURL

/**
 * 语音朗读
 * TODO: 暂未找到较合适的文件删除方案,会导致云存储空间浪费;文件到云函数解析后再次经过上传，加长了请求周期
 * @param {*} text 要朗读的文本
 * @param {*} voice 朗读文本的角色信息
 * @param {*} lastAudioId 上一次的语音id
 * @returns
 */
export async function voiceReading(text, voice, lastAudioId) {
  const res = await fetch(baseUrl + '/mstts', {
    method: 'POST',
    body: JSON.stringify({
      text,
      voice,
      lastAudioId
    })
  }).then(res => res.json())
  return res
}
