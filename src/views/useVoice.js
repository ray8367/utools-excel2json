/** 语音朗读相关业务 */
import { storeToRefs } from 'pinia'
import { 用户设置存储 } from '@/store/userSetting'
import {
  语音朗读生成base64,
  语音朗读生成ArrayBuffer
} from '@/apis/mstts/index.js'
import { 声音映射 } from '@/apis/mstts/data.js'
import { updateLog } from '@/apis/log'
import { Message as 提示 } from '@arco-design/web-vue'

export default function (form和to的数组, 结果对象) {
  const { readAloud: 朗读功能, readingPreference: 朗读性别偏好 } = storeToRefs(
    用户设置存储()
  )
  const audio本体 = ref(new Audio())
  const 音频Url = ref('')
  const 朗读loading = ref(false) // 译文发音按钮的Loading
  const { playing: 正在播放 } = useMediaControls(audio本体, { src: 音频Url })

  // 发音按钮
  async function 点击朗读() {
    重置音频()
    const 声音对象 = 声音映射[form和to的数组.value[1]] || 声音映射['zh']
    // 读取发音配置
    const 声音 = 声音对象[朗读性别偏好.value]
    const 语速 = 声音对象.rate || 1
    朗读loading.value = true
    if (window.utools) {
      await 播放音频V2(声音, 语速)
    } else {
      await 播放音频(声音, 语速)
    }
    朗读loading.value = false
  }

  // 重置音频
  function 重置音频() {
    正在播放.value = false
    音频Url.value = ''
  }

  // 播放语音
  async function 播放音频(声音, 语速) {
    const params = {
      voice: 声音,
      rate: 语速,
      text: 结果对象.数据?.结果文字
    }
    const 原始文件流 = await 语音朗读生成base64(params)
    if (原始文件流.type === 'audio/mp3') {
      音频Url.value = window.URL.createObjectURL(原始文件流)
      正在播放.value = true
    } else {
      提示.error('啊哦，播放出错了，请再试一次吧！')
    }

    updateLog('朗读')
  }

  // 播放语音
  async function 播放音频V2(声音, 语速) {
    const params = {
      voice: 声音,
      rate: 语速,
      text: 结果对象.数据?.结果文字
    }
    const arrayBuffer = await 语音朗读生成ArrayBuffer(params)
    const file = new File([arrayBuffer], 'temp.mp3')
    音频Url.value = window.URL.createObjectURL(file)
    正在播放.value = true
  }

  return {
    朗读功能,
    音频Url,
    朗读loading,
    正在播放,
    点击朗读,
    重置音频
  }
}
