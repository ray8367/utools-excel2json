export const voiceMap = {
  zh: 'zh-CN-XiaoxiaoNeural',
  en: 'en-GB-LibbyNeural',
  jp: 'ja-JP-NanamiNeural',
  ru: 'ru-RU-SvetlanaNeural',
  de: 'de-AT-IngridNeural',
  fra: 'fr-FR-DeniseNeural',
  cht: 'zh-TW-HsiaoChenNeural',
  kor: 'ko-KR-SunHiNeural'
}

/** 语音朗读 */
export async function voiceReading(text, voice) {
  const url = import.meta.env.VITE_UNIAPI_BASEURL
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      text,
      voice
    })
  }).then(res => res.json())
  return res
}
