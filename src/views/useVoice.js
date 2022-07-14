/** 语音朗读相关业务 */
import { storeToRefs } from 'pinia'
import { 用户设置存储 } from '@/store/userSetting'
import { 语音朗读生成base64 } from '@/apis/mstts/index.js'
import { 声音映射 } from '@/apis/mstts/data.js'
import { updateLog } from '@/apis/log'
import { Message as 提示 } from '@arco-design/web-vue'
import axios from 'axios'
import { nanoid } from 'nanoid'
import { v4 as uuidv4 } from 'uuid'

export default function (form和to的数组, 结果对象) {
  const { readAloud: 朗读功能, readingPreference: 朗读性别偏好 } = storeToRefs(
    用户设置存储()
  )
  const audio本体 = ref(new Audio())
  const 音频Url = ref('')
  const 朗读loading = ref(false) // 译文发音按钮的Loading
  const { playing: 正在播放 } = useMediaControls(audio本体, { src: 音频Url })
  const tokenData = ref('')
  const websock = ref(null)
  const sockConnentParams = ref(null)

  // 发音按钮
  async function 点击朗读() {
    重置音频()
    const 声音对象 = 声音映射[form和to的数组.value[1]] || 声音映射['zh']
    // 读取发音配置
    const 声音 = 声音对象[朗读性别偏好.value]
    const 语速 = 声音对象.rate || 1
    朗读loading.value = true
    await 发起朗读请求(声音, 语速)
    // 朗读loading.value = false
  }

  // 重置音频
  function 重置音频() {
    正在播放.value = false
    音频Url.value = ''
  }

  /** 获取token */
  async function getAuthToken() {
    if (tokenData.value) {
      return tokenData.value
    } else {
      console.log('获取Token...')
      const res = await axios.get(
        'https://azure.microsoft.com/en-gb/services/cognitive-services/text-to-speech/'
      )
      const reg = /token: "(.*?)"/

      if (reg.test(res.data)) {
        const token = RegExp.$1
        tokenData.value = token
        return token
      }
    }
  }

  function websocketonmessage(e) {
    console.log('websocketonmessage :', e)
    const { data } = e
    if (typeof data === 'string') {
      if (data.indexOf('Path:turn.end') >= 0) {
        console.log('已完成')
        websock.value.close()
        // resolve(final_data);
        console.log('bufferData ', bufferData)
        朗读loading.value = false
        朗读音频()
      }
    } else {
      console.log(typeof data)
      splicingData(data)
    }
  }

  let bufferData = new Uint8Array([])
  function splicingData(data) {
    console.log('splicingData ', data)
    data.arrayBuffer().then(buffer => {
      // 返回类型为Blob的data
      bufferData = new Uint8Array([...bufferData, ...new Uint8Array(buffer)])
    })
  }

  function websocketonopen(e) {
    console.log('websocketonopen :', e)
    sendData()
  }

  function websocketonerror(e) {
    console.log('websocketonerror :', e)
  }

  function websocketclose(e) {
    console.log('websocketclose :', e)
  }

  function getXTime() {
    return new Date().toISOString()
  }

  async function sendData() {
    const { text, voice, express, role, rate, pitch, XConnectionId } =
      sockConnentParams.value
    console.log('sockConnentParams ', sockConnentParams)
    const SSML = `
    <speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US">
        <voice name="${voice}">
            <mstts:express-as style="${express}" ${
      role !== '' ? 'role="' + role + '"' : ''
    }>
                <prosody rate="${rate}%" pitch="${pitch}%">
                ${text}
                </prosody>
            </mstts:express-as>
        </voice>
    </speak>
    `
    console.log('SSML:', SSML)

    console.log('第1次上报...')
    const message_1 = `Path: speech.config\r\nX-RequestId: ${XConnectionId}\r\nX-Timestamp: ${getXTime()}\r\nContent-Type: application/json\r\n\r\n{"context":{"system":{"name":"SpeechSDK","version":"1.19.0","build":"JavaScript","lang":"JavaScript","os":{"platform":"Browser/Linux x86_64","name":"Mozilla/5.0 (X11; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0","version":"5.0 (X11)"}}}}`
    await websock.value.send(message_1)

    console.log('第2次上报...')
    const message_2 = `Path: synthesis.context\r\nX-RequestId: ${XConnectionId}\r\nX-Timestamp: ${getXTime()}\r\nContent-Type: application/json\r\n\r\n{"synthesis":{"audio":{"metadataOptions":{"sentenceBoundaryEnabled":false,"wordBoundaryEnabled":false},"outputFormat":"audio-24khz-160kbitrate-mono-mp3"}}}`
    await websock.value.send(message_2)

    console.log('第3次上报...')
    const message_3 = `Path: ssml\r\nX-RequestId: ${XConnectionId}\r\nX-Timestamp: ${getXTime()}\r\nContent-Type: application/ssml+xml\r\n\r\n${SSML}`
    await websock.value.send(message_3)
  }

  // 播放语音 - 前段websocket调用
  async function getTTSData(
    text,
    voice = 'zh-CN-Yunxi',
    express = 'general',
    role = '',
    rate = 0,
    pitch = 0
  ) {
    const Authorization = await getAuthToken()
    const XConnectionId = uuidv4().toUpperCase()

    console.log('创建webscoket连接...')
    websock.value = new WebSocket(
      `wss://eastus.tts.speech.microsoft.com/cognitiveservices/websocket/v1?Authorization=${Authorization}&X-ConnectionId=${XConnectionId}`
    )

    // 客户端接收服务端数据时触发
    websock.value.onmessage = websocketonmessage
    // 连接建立时触发
    websock.value.onopen = websocketonopen
    // 通信发生错误时触发
    websock.value.onerror = websocketonerror
    // 连接关闭时触发
    websock.value.onclose = websocketclose

    sockConnentParams.value = {
      text,
      voice,
      express,
      role,
      rate,
      pitch,
      XConnectionId
    }
  }

  async function 发起朗读请求(声音, 语速) {
    const voice = 声音 // 发音角色
    const rate = 语速
    const text = 结果对象.数据?.结果文字
    const express = 'general' // 发音风格
    const pitch = 1 // 语调

    bufferData = new Uint8Array([])

    getTTSData(
      text,
      voice,
      express,
      '',
      (rate - 1) * 100,
      ((pitch - 1) / 2) * 100
    )

    updateLog('朗读')
  }

  function bufToFile(buf, filename) {
    return new File([buf], filename)
  }

  function 朗读音频() {
    const file = bufToFile(bufferData, 'a.mp3')
    console.log('file', file)
    音频Url.value = window.URL.createObjectURL(file)
    正在播放.value = true
  }

  // // 播放语音 - preload 调用方法
  // async function 发起朗读请求V2() {
  //   const arrayBuffer = await window.servers.hehehe()
  //   console.log('arrayBuffer', arrayBuffer)
  //   console.log(typeof arrayBuffer)

  //   const file = bufToFile(arrayBuffer, 'aa.mp3')
  //   console.log('file', file)
  //   音频Url.value = window.URL.createObjectURL(file)
  //   正在播放.value = true

  //   function bufToFile(buf, filename) {
  //     return new File([buf], filename)
  //   }
  //   updateLog('朗读')
  // }

  // async function 发起朗读请求(声音, 语速) {
  //   const params = {
  //     voice: 声音,
  //     rate: 语速,
  //     text: 结果对象.数据?.结果文字
  //   }
  //   const 原始文件流 = await 语音朗读生成base64(params)
  //   if (原始文件流.type === 'audio/mp3') {
  //     音频Url.value = window.URL.createObjectURL(原始文件流)
  //     正在播放.value = true
  //   } else {
  //     提示.error('啊哦，播放出错了，请再试一次吧！')
  //   }

  //   updateLog('朗读')
  // }

  return {
    朗读功能,
    音频Url,
    朗读loading,
    正在播放,
    点击朗读,
    重置音频
  }
}
