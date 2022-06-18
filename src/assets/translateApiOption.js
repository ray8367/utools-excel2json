import { cloneDeep } from 'lodash-es'
import { nanoid } from 'nanoid'
export const apiOptions = [
  {
    label: '谷歌翻译',
    value: 'google'
  },
  {
    label: '百度翻译',
    value: 'baidu'
  },
  {
    label: '腾讯翻译',
    value: 'tencent'
  },
  {
    label: '阿里翻译',
    value: 'ali'
  },
  {
    label: '有道翻译',
    value: 'youdao'
  },
  {
    label: '彩云小译',
    value: 'caiyun'
  },
  {
    label: '火山翻译',
    value: 'huoshan'
  }
]

export const apiNotSupport = {
  google: {
    fromNotSupport: ['wyw'],
    toNotSupport: ['wyw']
  },
  baidu: {
    fromNotSupport: [],
    toNotSupport: []
  },
  tencent: {
    fromNotSupport: ['wyw'],
    customNotSupport: {
      auto: ['wyw'],
      zh: ['wyw'],
      en: ['wyw'],
      jp: ['ru', 'de', 'fra', 'wyw'],
      ru: ['jp', 'kor', 'wyw'],
      kor: ['ru', 'de', 'fra', 'wyw'],
      de: ['jp', 'kor', 'wyw'],
      fra: ['jp', 'kor', 'wyw'],
      cht: ['wyw'],
      wyw: ['zh', 'en', 'jp', 'ru', 'kor', 'de', 'fra', 'cht', 'wyw'] // 所有
    }
  },
  ali: {
    fromNotSupport: ['wyw'],
    customNotSupport: {
      auto: ['wyw'],
      zh: ['wyw'],
      en: ['cht', 'wyw'],
      jp: ['cht', 'wyw'],
      ru: ['cht', 'wyw'],
      kor: ['cht', 'wyw'],
      de: ['cht', 'wyw'],
      fra: ['cht', 'wyw'],
      cht: ['jp', 'ru', 'kor', 'de', 'fra', 'wyw'],
      wyw: ['zh', 'en', 'jp', 'ru', 'kor', 'de', 'fra', 'cht', 'wyw'] // 所有
    }
  },
  youdao: {
    fromNotSupport: ['wyw'],
    toNotSupport: ['wyw']
  },
  caiyun: {
    fromNotSupport: ['kor', 'de', 'fra', 'cht', 'wyw'],
    customNotSupport: {
      auto: ['kor', 'de', 'fra', 'cht', 'wyw'],
      zh: ['zh', 'kor', 'de', 'fra', 'cht', 'wyw'],
      en: ['en', 'jp', 'ru', 'kor', 'de', 'fra', 'cht', 'wyw'], // 只有中文
      jp: ['en', 'jp', 'ru', 'kor', 'de', 'fra', 'cht', 'wyw'], // 只有中文
      ru: ['en', 'jp', 'ru', 'kor', 'de', 'fra', 'cht', 'wyw'], // 只有中文
      kor: ['zh', 'en', 'jp', 'ru', 'kor', 'de', 'fra', 'cht', 'wyw'], // 所有
      de: ['zh', 'en', 'jp', 'ru', 'kor', 'de', 'fra', 'cht', 'wyw'], // 所有
      fra: ['zh', 'en', 'jp', 'ru', 'kor', 'de', 'fra', 'cht', 'wyw'], // 所有
      cht: ['zh', 'en', 'jp', 'ru', 'kor', 'de', 'fra', 'cht', 'wyw'], // 所有
      wyw: ['zh', 'en', 'jp', 'ru', 'kor', 'de', 'fra', 'cht', 'wyw'] // 所有
    }
  },
  huoshan: {
    fromNotSupport: ['wyw'],
    toNotSupport: ['wyw']
  }
}

const translateFromOptions = [
  { label: '自动检测', value: 'auto', disabled: false, id: nanoid() },
  { label: '中文-简', value: 'zh', disabled: false, id: nanoid() },
  { label: '英语', value: 'en', disabled: false, id: nanoid() },
  { label: '日语', value: 'jp', disabled: false, id: nanoid() },
  { label: '俄语', value: 'ru', disabled: false, id: nanoid() },
  { label: '韩语', value: 'kor', disabled: false, id: nanoid() },
  { label: '德语', value: 'de', disabled: false, id: nanoid() },
  { label: '法语', value: 'fra', disabled: false, id: nanoid() },
  { label: '中文-繁', value: 'cht', disabled: false, id: nanoid() },
  { label: '文言文', value: 'wyw', disabled: false, id: nanoid() }
]

export function translateTree (arr = translateFromOptions) {
  const tmpArr = cloneDeep(arr)
  tmpArr.forEach(i => {
    i.children = arr
      .filter(r => r.value !== 'auto')
      .map(r => {
        return {
          ...r,
          id: nanoid()
        }
      })
  })
  return tmpArr
}
