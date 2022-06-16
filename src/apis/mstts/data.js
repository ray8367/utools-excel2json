const nameMap = new Map([
  ['云健', 'zh-CN-YunjianNeural'],
  ['晓秋', 'zh-CN-XiaoqiuNeural'],
  ['Jane', 'en-US-JaneNeural'],
  ['Christopher', 'en-US-ChristopherNeural'],
  ['圭太', 'ja-JP-KeitaNeural'],
  ['七海', 'ja-JP-NanamiNeural'],
  ['Svetlana', 'ru-RU-SvetlanaNeural'],
  ['Dmitry', 'ru-RU-DmitryNeural'],
  ['inJoon', 'ko-KR-InJoonNeural'],
  ['Sun-Hi', 'ko-KR-SunHiNeural'],
  ['Conrad', 'de-DE-ConradNeural'],
  ['Elke', 'de-DE-ElkeNeural'],
  ['Maurice', 'fr-FR-MauriceNeural'],
  ['Denise', 'fr-FR-DeniseNeural']
])

function getShortName (str = '') {
  return nameMap.get(str) || 'zh-CN-XiaoxiaoNeural'
}

export const voiceMap = {
  zh: {
    male: getShortName('云健'),
    female: getShortName('晓秋'),
    default: getShortName('云健')
  },
  en: {
    male: getShortName('Christopher'),
    female: getShortName('Jane'),
    default: getShortName('Jane')
  },
  jp: {
    male: getShortName('圭太'),
    female: getShortName('七海'),
    default: getShortName('圭太')
  },
  ru: {
    male: getShortName('Dmitry'),
    female: getShortName('Svetlana'),
    default: getShortName('Svetlana')
  },
  de: {
    male: getShortName('Conrad'),
    female: getShortName('Elke'),
    default: getShortName('Conrad')
  },
  fra: {
    male: getShortName('Maurice'),
    female: getShortName('Denise'),
    default: getShortName('Maurice')
  },
  cht: {
    male: getShortName('云健'),
    female: getShortName('晓秋'),
    default: getShortName('云健')
  },
  kor: {
    male: getShortName('inJoon'),
    female: getShortName('Sun-Hi'),
    default: getShortName('inJoon')
  }
}
