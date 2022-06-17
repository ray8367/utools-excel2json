<template>
  <div
    class="main_wrapper grid-c h-screen px-20px pb-20px relative overflow-hidden dark:(bg-dark-300 text-white)"
  >
    <!-- 设置按钮 -->
    <div
      id="setting-wrapper"
      class="icon setting_icon"
      @click="openSettingModal"
    >
      <icon-settings />
    </div>
    <!-- 命名翻译模式按钮 -->
    <div
      class="icon code_icon"
      :class="{ active: codeMode }"
      @click="changeMode"
    >
      <icon-code />
    </div>
    <div
      class="p-20px flex flex-col h-full w-full shadow-xl rounded-8px dark:(shadow-[#161616] shadow-lg bg-dark-300 )"
    >
      <div class="text_wrapper flex flex-1 relative">
        <!-- 清除按钮 -->
        <transition name="component-scale">
          <template v-if="!['', undefined, null].includes(userInput)">
            <MimicryBtn
              key="1"
              class="absolute right-10px bottom-8px"
              @click="clearInput"
            >
              <icon-close />
            </MimicryBtn>
          </template>
        </transition>

        <!-- 上方文本域 -->
        <a-textarea
          ref="inputRef"
          v-model="userInput"
          class="rounded-t-8px"
          placeholder="请输入要翻译的内容"
        />
      </div>
      <section class="tools_wrapper flex my-8px">
        <!-- 中间翻译Api选项 -->
        <a-radio-group
          v-model="currentTranslation"
          type="button"
          @change="changeRadioHandler"
        >
          <a-radio
            v-for="item in (translateApiOptions || []).slice(0, 4)"
            :key="item.item"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
        <div
          class="border-solid border-[#f2f3f5] border-b-width-1px flex-1 flex justify-end items-center space-x-8px dark:border-[#3d3d3d]"
        >
          <!-- 命名翻译模式的select -->
          <template v-if="codeMode">
            <a-select
              v-model="codeSelect"
              :style="{ width: '130px' }"
              @change="changeCodeSelect"
            >
              <a-option
                v-for="(item, index) in changeCaseArr"
                :key="index"
                :value="item.name"
              >
                {{ item.label }}
              </a-option>
            </a-select>
          </template>

          <template v-else>
            <a-cascader
              v-model:model-value="fromToArr"
              path-mode
              :options="translateTreeData"
              :style="{ width: '240px' }"
              value-key="id"
              :format-label="formatCascader"
              @change="changeTranslateType"
            />
          </template>
        </div>
      </section>

      <a-resize-box
        :directions="['top']"
        :style="{
          minHeight: '22%',
          maxHeight: '78%',
          height: 'calc(50% - 21.5px)'
        }"
      >
        <div class="flex h-full relative">
          <!-- -1：等待用户操作、200：翻译成功均应该显示<code/> -->
          <codeBg
            v-if="codeMode && [-1, 200].includes(resultObj.data.resultCode)"
          />
          <transition name="fade-in-standard">
            <Loading
              v-if="pageLoading"
              class="rounded-b-8px border-solid border-[#e9e9e9] border-width-1px absolute top-0 z-100"
            />
          </transition>
          <div
            class="text_wrapper text_readonly flex flex-1 absolute top-0 h-full w-full"
            :class="{ 'code_font-family': codeMode }"
          >
            <a-textarea
              v-model="resultObj.data.resultText"
              class="rounded-b-8px relative z-1"
              placeholder="翻译结果"
              readonly
            />
            <transition v-if="!codeMode" name="fade-in-standard">
              <div
                v-show="shouldShowCopyBtn"
                class="absolute left-10px bottom-8px z-1 flex space-x-8px"
              >
                <!-- 播放按钮 -->
                <MimicryBtn :loading="toReadLoading" @click="readAloud">
                  <icon-sound />
                </MimicryBtn>

                <!-- 开始暂停按钮 -->
                <MimicryBtn v-show="audioUrl" @click="playing = !playing">
                  <component :is="playing ? IconPause : IconPlayArrowFill" />
                </MimicryBtn>
              </div>
            </transition>

            <transition name="fade-in-standard" mode="out-in">
              <div
                v-show="shouldShowCopyBtn"
                class="absolute bottom-8px left-1/2 transform -translate-x-1/2 z-1 flex space-x-8px"
              >
                <ColorfulBtn v-if="copyBtnShow.includes(1)" @click="copyFn(1)">
                  <icon-copy /> 仅复制
                </ColorfulBtn>
                <ColorfulBtn v-if="copyBtnShow.includes(2)" @click="copyFn(2)">
                  <icon-fullscreen-exit /> 复制并隐藏
                </ColorfulBtn>
                <ColorfulBtn v-if="copyBtnShow.includes(3)" @click="copyFn(3)">
                  <icon-edit /> 复制并输入
                </ColorfulBtn>
              </div>
            </transition>
          </div>
        </div>
      </a-resize-box>
    </div>
  </div>

  <!-- 设置弹窗 -->
  <SettingModal
    ref="settingModalRef"
    @ok="settingOk"
    @cancel="settingCancel"
    @reset="resetHandler"
  />

  <audio ref="audioRef" style="display: none">
    <source :src="audioUrl" type="audio/mpeg" />
    <source :src="audioUrl" type="audio/ogg" />
  </audio>
</template>

<script setup>
import { debounce, throttle } from 'lodash-es'
import { useClipboard } from '@vueuse/core'
import { nanoid } from 'nanoid'
import {
  IconSettings,
  IconCopy,
  IconCode,
  IconClose,
  IconEdit,
  IconFullscreenExit,
  IconSound,
  IconPause,
  IconPlayArrowFill
} from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import { storeToRefs } from 'pinia'
import { delay } from 'lodash-es'
import { translationCommon } from '@/apis/translation/index.js'
import { userSettingStore } from '@/store/userSetting'
import { showGuide, clearGuide } from '@/utils/showGuide.js'
import { getDbStorageItem } from '@/utils/storage.js'
import { changeCaseArr } from '@/assets/changeCaseMap.js'
import { translateTree, apiNotSupport } from '@/assets/translateApiOption.js'
import { voiceReadingToBase64 } from '@/apis/mstts/index.js'
import { voiceMap } from '@/apis/mstts/data.js'

const translateTreeData = ref(translateTree())
const fromToArr = ref(['auto', 'zh'])
const audioRef = ref()
const audioUrl = ref('')
const { playing } = useMediaControls(audioRef, { src: audioUrl })
const store = userSettingStore()
const {
  homeOption,
  getHomeApiOptions: translateApiOptions,
  getHomeFontSize: textFont,
  copyBtnBehavior,
  copyBtnShow
} = storeToRefs(store)
const codeMode = computed(() => store.codeMode) // 命名翻译模式
const pageLoading = ref(false) // 是否正在翻译
const userInput = ref('') // 输入的内容
const resultObj = reactive({
  data: {
    resultText: ``, // 翻译结果
    resultCode: -1, // 翻译结果状态(code = 200 为成功,code = -1为等待用户操作,code = 401为未配置翻译API)
    resultId: nanoid()
  }
})
const { copy } = useClipboard() // 复制结果功能
const keys = useMagicKeys()
const currentTranslation = ref('') // 当前翻译api
const codeSelect = ref('camelCase') // 当前翻译to
const settingModalRef = ref() // 设置弹窗的ref
const inputRef = ref() // 输入textarea的dom
const toReadLoading = ref(false) // 译文发音按钮的Loading

const utools = window?.utools

function formatCascader(options) {
  const labels = options.map(option => option.label)
  return labels.join(`\u3000\u3000 → \u3000\u3000`)
}
// 发音按钮
async function readAloud() {
  resetAudio()
  const voiceObj = voiceMap[fromToArr.value[1]] || voiceMap['zh']
  // TODO: 读取发音配置
  const voice = voiceObj['default']
  toReadLoading.value = true
  await voicePlay(voice)
  toReadLoading.value = false
}

// 重置音频
function resetAudio() {
  playing.value = false
  audioUrl.value = ''
}

// 播放语音
async function voicePlay(voice) {
  const params = {
    voice,
    text: resultObj.data?.resultText
  }
  const originBlob = await voiceReadingToBase64(params)
  if (originBlob.type === 'audio/mp3') {
    audioUrl.value = window.URL.createObjectURL(originBlob)
    playing.value = true
  } else {
    Message.error('啊哦，播放出错了，请再试一次吧！')
  }
}

// 清空输入框
function clearInput() {
  userInput.value = ''
  inputFocus()
}

// 输入框获取焦点
function inputFocus() {
  inputRef.value.focus()
}

// 设置弹框点击了确定
function settingOk() {
  nextTick(() => {
    // 重新读取设置
    readSetting()
    // 输入框获取焦点
    inputFocus()
    // 设置成功，刷新上一次翻译
    startTranslation(currentTranslation.value, true)
  })
}

// 设置弹框点击了取消
function settingCancel() {
  inputFocus()
}

// 打开设置模态框
function openSettingModal() {
  settingModalRef.value.openSettingModal()
}

// 变更模式
const changeMode = throttle(() => {
  Message.success({
    content: `命名翻译模式${codeMode.value ? '关闭' : '开启'}`,
    duration: 1000
  })
  // 如果未输入，则resultCode设为-1，即为等待用户操作状态，-1会触发Code动画
  // 否则，将resultCode设为0，后面会触发翻译，翻译成功后继而变为200，会在成功后触发Code动画
  // 如果连续翻译，resultCode从200 => 200并不会触发Code动画，符合预期
  resultObj.data.resultCode = !userInput.value ? -1 : 0

  store.setCodeMode(!codeMode.value)
  inputFocus()
  setTimeout(() => {
    startTranslation()
  }, 0)
}, 1000)

// 修改翻译服务，同时保存当前选中的服务作为默认，并翻译
function changeRadioHandler() {
  store.setDefaultStorage(currentTranslation.value)
  setTimeout(() => {
    startTranslation()
  }, 0)
}

// 分发翻译请求，并开始翻译，默认根据Radio的值来确定翻译api
async function startTranslation(val = currentTranslation.value, isRefresh) {
  resetAudio()
  // 如果没输入内容，则不翻译
  if ([undefined, null, ''].includes(userInput.value)) {
    resultObj.data.resultText = ''
    return
  }

  pageLoading.value = true
  const obj = {
    q: userInput.value,
    from: fromToArr.value[0],
    to: fromToArr.value[1],
    isRefresh
  }
  const { text, code } = await translationCommon(val, obj)
  const calcText = codeMode.value ? getCodeResult(text, codeSelect.value) : text
  resultObj.data = {
    resultText: calcText,
    resultCode: code,
    resultId: nanoid()
  }
  pageLoading.value = false
  nextTick(() => inputFocus())
}
// 切换命名翻译模式的方式select
function changeCodeSelect() {
  const result = getCodeResult(resultObj.data.resultText, codeSelect.value)
  resultObj.data.resultText = result
}

// 获取命名翻译模式的翻译结果
function getCodeResult(text = '', type = 'camelCase') {
  const changeCase = changeCaseArr.find(item => item.name === type)
  if (!text) return text
  if (!changeCase) return text
  return changeCase.handle(text)
}

// 切换翻译的From和To
function changeTranslateType() {
  inputFocus()
  setTimeout(() => {
    startTranslation()
  }, 0)
}

function firstGuide() {
  const option = {
    id: 'firstUseMain',
    title: '欢迎使用易翻😁',
    text: '初次使用，应该点击这里去配置一下服务哦~',
    attachTo: {
      element: '#setting-wrapper',
      on: 'left'
    },
    classes: 'guide_wrapper'
  }

  showGuide(option, 'firstUseMain')
}

// 读取配置
function readSetting() {
  //  首次加载设置当前选中为设置的默认翻译
  if (!homeOption.value.includes(currentTranslation.value)) {
    currentTranslation.value = store.defaultApi
  }
}

/** 根据关键字切换命名翻译模式 */
function changeCodeModeByKeyword(code) {
  // codeMode&xx
  const reg = /^codeMode__/
  if (reg.test(code)) {
    store.setCodeMode(true)
    const modeName = code.split('__')[1]
    codeSelect.value = modeName
  } else {
    store.setCodeMode(false)
  }
}

// 初始化utools
function utoolsInit() {
  utools.onPluginEnter(({ code, payload }) => {
    settingModalRef.value.closeSettingModal()
    userInput.value = code === 'anyword' ? payload : ''
    changeCodeModeByKeyword(code)
  })
  utools.subInputBlur()
}

// 快捷键复制结果
const shortcutKeyCopy = throttle(async () => {
  await copyOnly()
  if (!utools) return
  const behavior = copyBtnBehavior.value
  if (behavior === 'close') {
    await delayCloseUtools()
  } else if (behavior === 'closeInput') {
    await delayCloseUtools()
    await paste()
  }
}, 300)

// 延迟时间关闭utools
function delayCloseUtools(delayTime = 300) {
  if (!utools) return
  return new Promise(resolve => {
    delay(function () {
      utools.hideMainWindow()
      resolve()
    }, delayTime)
  })
}

// 复制按钮
const copyFn = throttle((val = 1) => {
  switch (val) {
    case 1:
      copyOnly()
      break
    case 2:
      copyHidden()
      break
    case 3:
      copyInput()
      break
  }
}, 300)

// 仅复制
async function copyOnly() {
  await copy(resultObj.data.resultText)
  Message.success({ content: '复制成功', duration: 2500 })
}

// 复制并隐藏
async function copyHidden() {
  await copyOnly()
  await delayCloseUtools()
}

// 复制并输入
async function copyInput() {
  await copyHidden()
  await paste()
}

// 粘贴
async function paste() {
  if (!utools) return
  const key = utools.isMacOs() ? 'command' : 'ctrl'
  await utools.simulateKeyboardTap('v', key)
}

// 重置后首页设置
function resetHandler() {
  clearInput()
  readSetting()
}

// 重置From和To
function resetFromTo() {
  fromToArr.value = ['auto', 'zh']
}

onMounted(() => {
  utools && utoolsInit()
  inputFocus()
  readSetting()

  !getDbStorageItem('firstUseMain') && firstGuide()
})

// 监听用户输入，防抖翻译
watch(userInput, () => debounceStart())

// 加了一层防抖的翻译
const debounceStart = debounce(function () {
  startTranslation()
}, 300)

// 监听401，自动弹引导层
watch(
  () => resultObj.data.resultId,
  () => {
    if (resultObj.data.resultCode === 401) {
      const option = {
        id: 'missingParameter',
        title: '未配置服务',
        text: '你应该点击这里去配置一下服务哦~🖊️',
        attachTo: {
          element: '#setting-wrapper',
          on: 'left'
        },
        classes: 'guide_wrapper'
      }
      clearGuide()
      showGuide(option, 'firstUseMain')
    }
  }
)

watchEffect(() => {
  const current = apiNotSupport?.[currentTranslation.value]
  const customNotSupport = current?.customNotSupport
  const toNotSupport = current?.toNotSupport
  if (!current) return

  translateTreeData.value.forEach(i => {
    // 一层循环禁用掉api本身就不支持的语种
    i.disabled = current?.fromNotSupport.includes(i.value)

    // 如果存在customNotSupport这个对象，则为不支持任意互翻api，根据数据禁用对应的不支持互翻的语种
    if (customNotSupport) {
      i.children.forEach(j => {
        j.disabled = customNotSupport[i.value].includes(j.value)
      })
    } else if (toNotSupport) {
      // 如果存在toNotSupport，则代表该api支持任意互翻，禁用掉本就不支持的语种即可
      i.children.forEach(j => {
        j.disabled = toNotSupport.includes(j.value)
      })
    }
  })
})

watchEffect(() => {
  const currentApi = currentTranslation.value
  const current = apiNotSupport?.[currentApi]
  if (!current) return
  const customNotSupport = current?.customNotSupport
  const toNotSupport = current?.toNotSupport
  const from = fromToArr.value[0]
  const to = fromToArr.value[1]

  // 判断from是否不支持
  // 如果当前的翻译from，在当前api的fromNotSupport中不存在，就恢复默认
  if (current?.fromNotSupport.includes(from)) {
    console.log('因为from不兼容，触发重置')
    resetFromTo()
    return
  }

  // 判断to是否不支持

  // 如果是不支持互翻的api，且当前from的对应to为不支持的，就恢复默认
  if (customNotSupport && customNotSupport[from].includes(to)) {
    console.log('不支持互翻的api，因为to不兼容，触发重置')
    resetFromTo()
  }

  // 如果是支持互翻的，则取toNotSupport数组中进行判断
  if (toNotSupport && toNotSupport.includes(to)) {
    console.log('支持互翻的api，因为to不兼容，触发重置')
    resetFromTo()
  }
})

// 监听代码模式
watchEffect(() => {
  if (codeMode.value) {
    fromToArr.value = ['auto', 'en']
  } else {
    resetFromTo()
  }
})

// 是否应该显示复制按钮
const shouldShowCopyBtn = computed(() => {
  return resultObj.data.resultText?.trim() && resultObj.data.resultCode === 200
})

// 监听复制快捷键
watchEffect(() => {
  const WindowsCopyKeys = keys['ctrl+shift+c']
  const MacCopyKeys = keys['command+shift+c']
  if ((WindowsCopyKeys.value || MacCopyKeys.value) && shouldShowCopyBtn.value) {
    shortcutKeyCopy()
  }
})

// 设置弹窗的状态
const settingActive = computed(() => {
  return settingModalRef.value.modalVis
})

// Tab键切换翻译方式
onKeyStroke('Tab', e => {
  if (settingActive.value) return
  e.preventDefault()
  let currentIndex = translateApiOptions.value.findIndex(
    i => i.value === currentTranslation.value
  )
  currentIndex += 1
  currentIndex > translateApiOptions.value.length - 1 && (currentIndex = 0)
  const nextApi = translateApiOptions.value[currentIndex]?.value
  currentTranslation.value = nextApi
  setTimeout(() => {
    debounceStart()
  }, 0)
})
</script>

<style lang="scss" scoped>
.icon {
  transition: all 250ms ease;
  @apply text-20px text-[#999] cursor-pointer hover: text-[#666];
}
.code_icon {
  @apply absolute left-3px bottom-3px;
  &:hover {
    transform: rotate(180deg);
  }
  &:active {
    transform: scale(0.8) rotate(180deg);
  }
  &.active {
    color: $primary-color;
  }
}
.setting_icon {
  @apply absolute right-3px bottom-3px;

  &:hover {
    transform: rotate(60deg);
  }
  &:active {
    color: $primary-color;
    transform: scale(0.8) rotate(60deg);
  }
}

// 文本域公用样式
.text_wrapper {
  ::v-deep(.arco-textarea) {
    height: 100%;
    padding-right: 26px;
    padding-bottom: 50px;
    font-size: v-bind(textFont);
    resize: none;
  }

  ::v-deep(.arco-textarea-wrapper) {
    background-color: transparent;
    border-color: #e9e9e9;
  }

  ::v-deep(.arco-textarea-focus) {
    border-color: $primary-color;
  }

  // 深色模式
  @media (prefers-color-scheme: dark) {
    ::v-deep(.arco-textarea-wrapper) {
      background-color: transparent;
      border-color: #00000000;
    }

    ::v-deep(.arco-textarea-focus) {
      border-color: #777;
    }
    ::v-deep(.arco-textarea) {
      background-color: #242425a6;
    }
  }
}

// 下面的文本域样式
.text_readonly {
  position: relative;
  ::v-deep(.arco-textarea-focus) {
    border-color: #e9e9e9;
  }

  @media (prefers-color-scheme: dark) {
    ::v-deep(.arco-textarea-focus) {
      border-color: transparent;
    }
  }
}

.tools_wrapper {
  ::v-deep(.arco-select-view-value) {
    display: grid;
    text-align: center;
  }
  @media (prefers-color-scheme: dark) {
    ::v-deep(.arco-radio-checked) {
      color: #fff;
      text-shadow: 0 3px 15px #ffffffb8;
      background-color: #222 !important;
    }
  }
}
</style>
