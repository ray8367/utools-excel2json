<template>
  <div
    class="main_wrapper grid-c h-screen px-20px pb-20px relative overflow-hidden dark:(bg-dark-300 text-white)"
  >
    <!-- 设置按钮 -->
    <div id="setting-wrapper" class="icon setting_icon" @click="打开模态框()">
      <icon-settings />
    </div>
    <!-- 命名翻译模式按钮 -->
    <div
      class="icon code_icon"
      :class="{ active: 命名模式 }"
      @click="切换模式()"
    >
      <icon-code />
    </div>
    <div
      class="p-20px flex flex-col h-full w-full shadow-xl rounded-8px dark:(shadow-[#161616] shadow-lg bg-dark-300 )"
    >
      <div class="text_wrapper flex flex-1 relative">
        <!-- 清除按钮 -->
        <transition name="component-scale">
          <template v-if="!['', undefined, null].includes(用户输入)">
            <MimicryBtn
              key="1"
              class="absolute right-10px bottom-8px"
              @click="清空输入框()"
            >
              <icon-close />
            </MimicryBtn>
          </template>
        </transition>

        <!-- 上方文本域 -->
        <a-textarea
          ref="用户输入框Ref"
          v-model="用户输入"
          class="rounded-t-8px"
          placeholder="请输入要翻译的内容"
        />
      </div>
      <section class="tools_wrapper flex my-8px">
        <!-- 中间翻译Api选项 -->
        <a-radio-group
          v-model="当前翻译服务"
          type="button"
          @change="切换翻译服务()"
        >
          <a-radio
            v-for="item in (翻译服务选项 || []).slice(0, 4)"
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
          <template v-if="命名模式">
            <a-select
              v-model="命名模式类型"
              :style="{ width: '130px' }"
              @change="命名模式切换类型()"
            >
              <a-option
                v-for="(item, index) in 切换类型数组"
                :key="index"
                :value="item.name"
              >
                {{ item.label }}
              </a-option>
            </a-select>
          </template>

          <template v-else>
            <a-cascader
              v-model:model-value="源语言目标语言数组"
              path-mode
              :options="语种树的数据"
              :style="{ width: '240px' }"
              value-key="id"
              :format-label="格式化级联内容"
              @change="切换源语言目标语言()"
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
          <codeBg v-if="命名模式 && [-1, 200].includes(结果对象.数据.结果码)" />
          <transition name="fade-in-standard">
            <Loading
              v-if="翻译加载"
              class="rounded-b-8px border-solid border-[#e9e9e9] border-width-1px absolute top-0 z-100"
            />
          </transition>
          <div
            class="text_wrapper text_readonly flex flex-1 absolute top-0 h-full w-full"
            :class="{ 'code_font-family': 命名模式 }"
          >
            <a-textarea
              v-model="结果对象.数据.结果文字"
              class="rounded-b-8px relative z-1"
              placeholder="翻译结果"
              readonly
            />
            <transition v-if="readAloud && !命名模式" name="fade-in-standard">
              <div
                v-show="应该显示复制按钮"
                class="absolute left-10px bottom-8px z-1 flex space-x-8px"
              >
                <!-- 播放按钮 -->
                <MimicryBtn :loading="朗读加载" @click="点击朗读()">
                  <icon-sound />
                </MimicryBtn>

                <!-- 开始暂停按钮 -->
                <MimicryBtn v-show="音频Url" @click="playing = !playing">
                  <component :is="playing ? IconPause : IconPlayArrowFill" />
                </MimicryBtn>
              </div>
            </transition>

            <transition name="fade-in-standard" mode="out-in">
              <div
                v-show="应该显示复制按钮"
                class="absolute bottom-8px left-1/2 transform -translate-x-1/2 z-1 flex space-x-8px"
              >
                <ColorfulBtn
                  v-if="copyBtnShow.includes(1)"
                  @click="复制按钮(1)"
                >
                  <icon-copy /> 仅复制
                </ColorfulBtn>
                <ColorfulBtn
                  v-if="copyBtnShow.includes(2)"
                  @click="复制按钮(2)"
                >
                  <icon-fullscreen-exit /> 复制并隐藏
                </ColorfulBtn>
                <ColorfulBtn
                  v-if="copyBtnShow.includes(3)"
                  @click="复制按钮(3)"
                >
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
    ref="设置弹框Ref"
    @ok="设置确定()"
    @cancel="设置取消()"
    @reset="resetHandler()"
  />

  <audio ref="音频Ref" style="display: none">
    <source :src="音频Url" type="audio/mpeg" />
    <source :src="音频Url" type="audio/ogg" />
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
import { 显示引导, 清除引导 } from '@/utils/showGuide.js'
import { getDbStorageItem } from '@/utils/storage.js'
import { 切换类型数组 } from '@/assets/changeCaseMap.js'
import { 语种树, 服务不支持的对象 } from '@/assets/translateApiOption.js'
import { voiceReadingToBase64 } from '@/apis/mstts/index.js'
import { voiceMap } from '@/apis/mstts/data.js'

const 语种树的数据 = ref(语种树())
const 源语言目标语言数组 = ref(['auto', 'zh'])
const 音频Ref = ref()
const 音频Url = ref('')
const { playing } = useMediaControls(音频Ref, { src: 音频Url })
const store = userSettingStore()
const {
  homeOption,
  getHomeApiOptions: 翻译服务选项,
  getHomeFontSize: textFont,
  copyBtnBehavior,
  copyBtnShow,
  readAloud,
  readingPreference
} = storeToRefs(store)
const 命名模式 = computed(() => store.codeMode) // 命名翻译模式
const 翻译加载 = ref(false) // 是否正在翻译
const 用户输入 = ref('') // 输入的内容
const 结果对象 = reactive({
  数据: {
    结果文字: ``, // 翻译结果
    结果码: -1, // 翻译结果状态(code = 200 为成功,code = -1为等待用户操作,code = 401为未配置翻译API)
    结果编号: nanoid()
  }
})
const { copy } = useClipboard() // 复制结果功能
const keys = useMagicKeys()
const 当前翻译服务 = ref('') // 当前翻译api
const 命名模式类型 = ref('camelCase') // 命名模式要转换的类型
const 设置弹框Ref = ref() // 设置弹窗的ref
const 用户输入框Ref = ref() // 输入textarea的dom
const 朗读加载 = ref(false) // 译文发音按钮的Loading

const utools = window?.utools

function 格式化级联内容(options) {
  const 文字 = options.map(option => option.label)
  return 文字.join(`\u3000\u3000 → \u3000\u3000`)
}
// 发音按钮
async function 点击朗读() {
  重置音频()
  const 声音对象 = voiceMap[源语言目标语言数组.value[1]] || voiceMap['zh']
  // 读取发音配置
  const 声音 = 声音对象[readingPreference.value]
  朗读加载.value = true
  await 播放音频(声音)
  朗读加载.value = false
}

// 重置音频
function 重置音频() {
  playing.value = false
  音频Url.value = ''
}

// 播放语音
async function 播放音频(voice) {
  const params = {
    voice,
    text: 结果对象.数据?.结果文字
  }
  const 原始文件流 = await voiceReadingToBase64(params)
  if (原始文件流.type === 'audio/mp3') {
    音频Url.value = window.URL.createObjectURL(原始文件流)
    playing.value = true
  } else {
    Message.error('啊哦，播放出错了，请再试一次吧！')
  }
}

// 清空输入框
function 清空输入框() {
  用户输入.value = ''
  输入框获取焦点()
}

// 输入框获取焦点
function 输入框获取焦点() {
  用户输入框Ref.value.focus()
}

// 设置弹框点击了确定
function 设置确定() {
  nextTick(() => {
    // 重新读取设置
    读取设置()
    // 输入框获取焦点
    输入框获取焦点()
    // 设置成功，刷新上一次翻译
    开始翻译(当前翻译服务.value, true)
  })
}

// 设置弹框点击了取消
function 设置取消() {
  输入框获取焦点()
}

// 打开设置模态框
function 打开模态框() {
  设置弹框Ref.value.openSettingModal()
}

// 变更模式
const 切换模式 = throttle(() => {
  Message.success({
    content: `命名翻译模式${命名模式.value ? '关闭' : '开启'}`,
    duration: 1000
  })
  // 如果未输入，则结果码设为-1，即为等待用户操作状态，-1会触发Code动画
  // 否则，将结果码设为0，后面会触发翻译，翻译成功后继而变为200，会在成功后触发Code动画
  // 如果连续翻译，结果码从200 => 200并不会触发Code动画，符合预期
  结果对象.数据.结果码 = !用户输入.value ? -1 : 0

  store.setCodeMode(!命名模式.value)
  输入框获取焦点()
  setTimeout(() => {
    开始翻译()
  }, 0)
}, 1000)

// 修改翻译服务，同时保存当前选中的服务作为默认，并翻译
function 切换翻译服务() {
  store.setDefaultStorage(当前翻译服务.value)
  setTimeout(() => {
    开始翻译()
  }, 0)
}

// 分发翻译请求，并开始翻译，默认根据Radio的值来确定翻译api
async function 开始翻译(val = 当前翻译服务.value, isRefresh) {
  重置音频()
  // 如果没输入内容，则不翻译
  if ([undefined, null, ''].includes(用户输入.value)) {
    结果对象.数据.结果文字 = ''
    return
  }

  翻译加载.value = true
  const obj = {
    q: 用户输入.value,
    from: 源语言目标语言数组.value[0],
    to: 源语言目标语言数组.value[1],
    isRefresh
  }
  const { text, code } = await translationCommon(val, obj)
  const calcText = 命名模式.value
    ? 获取翻译模式对应类型数据(text, 命名模式类型.value)
    : text
  结果对象.数据 = {
    结果文字: calcText,
    结果码: code,
    结果编号: nanoid()
  }
  翻译加载.value = false
  nextTick(() => 输入框获取焦点())
}
// 切换命名翻译模式的方式select
function 命名模式切换类型() {
  const result = 获取翻译模式对应类型数据(
    结果对象.数据.结果文字,
    命名模式类型.value
  )
  结果对象.数据.结果文字 = result
}

// 获取命名翻译模式的翻译结果
function 获取翻译模式对应类型数据(翻译结果 = '', type = 'camelCase') {
  const 当前类型数据 = 切换类型数组.find(item => item.name === type)
  if (!翻译结果) return 翻译结果
  if (!当前类型数据) return 翻译结果
  return 当前类型数据.handle(翻译结果)
}

// 切换翻译的From和To
function 切换源语言目标语言() {
  输入框获取焦点()
  setTimeout(() => {
    开始翻译()
  }, 0)
}

function 首次引导() {
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

  显示引导(option, 'firstUseMain')
}

// 读取配置
function 读取设置() {
  //  首次加载设置当前选中为设置的默认翻译
  if (!homeOption.value.includes(当前翻译服务.value)) {
    当前翻译服务.value = store.defaultApi
  }
}

/** 根据关键字切换命名翻译模式 */
function 改变命名模式类型(code) {
  // codeMode&xx
  const reg = /^codeMode__/
  if (reg.test(code)) {
    store.setCodeMode(true)
    const modeName = code.split('__')[1]
    命名模式类型.value = modeName
  } else {
    store.setCodeMode(false)
  }
}

// 初始化utools
function utools初始化() {
  utools.onPluginEnter(({ code, payload }) => {
    设置弹框Ref.value.closeSettingModal()
    用户输入.value = code === 'anyword' ? payload : ''
    改变命名模式类型(code)
  })
  utools.subInputBlur()
}

// 快捷键复制结果
const 快捷键复制 = throttle(async () => {
  await 仅复制()
  if (!utools) return
  const 行为 = copyBtnBehavior.value
  if (行为 === 'close') {
    await 延迟关闭utools()
  } else if (行为 === 'closeInput') {
    await 延迟关闭utools()
    await 粘贴()
  }
}, 300)

// 延迟时间关闭utools
function 延迟关闭utools(delayTime = 300) {
  if (!utools) return
  return new Promise(resolve => {
    delay(function () {
      utools.hideMainWindow()
      resolve()
    }, delayTime)
  })
}

// 复制按钮
const 复制按钮 = throttle((val = 1) => {
  switch (val) {
    case 1:
      仅复制()
      break
    case 2:
      复制并隐藏()
      break
    case 3:
      复制并输入()
      break
  }
}, 300)

// 仅复制
async function 仅复制() {
  await copy(结果对象.数据.结果文字)
  Message.success({ content: '复制成功', duration: 2500 })
}

// 复制并隐藏
async function 复制并隐藏() {
  await 仅复制()
  await 延迟关闭utools()
}

// 复制并输入
async function 复制并输入() {
  await 复制并隐藏()
  await 粘贴()
}

// 粘贴
async function 粘贴() {
  if (!utools) return
  const key = utools.isMacOs() ? 'command' : 'ctrl'
  await utools.simulateKeyboardTap('v', key)
}

// 重置后首页设置
function resetHandler() {
  清空输入框()
  读取设置()
}

// 重置From和To
function 重置源语言和目标语言() {
  源语言目标语言数组.value = ['auto', 'zh']
}

onMounted(() => {
  utools && utools初始化()
  输入框获取焦点()
  读取设置()

  !getDbStorageItem('firstUseMain') && 首次引导()
})

// 监听用户输入，防抖翻译
watch(用户输入, () => 防抖翻译())

// 加了一层防抖的翻译
const 防抖翻译 = debounce(function () {
  开始翻译()
}, 300)

// 监听401，自动弹引导层
watch(
  () => 结果对象.数据.结果编号,
  () => {
    if (结果对象.数据.结果码 === 401) {
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
      清除引导()
      显示引导(option, 'firstUseMain')
    }
  }
)

watchEffect(() => {
  const 当前服务规则 = 服务不支持的对象?.[当前翻译服务.value]
  const 当前不支持的 = 当前服务规则?.自定义不支持
  const 当前目标语言不支持的 = 当前服务规则?.目标语言不支持
  if (!当前服务规则) return

  语种树的数据.value.forEach(源语言项 => {
    // 一层循环禁用掉api本身就不支持的语种
    源语言项.disabled = 当前服务规则?.源语言不支持.includes(源语言项.value)

    // 如果存在自定义不支持这个对象，则为不支持任意互翻api，根据数据禁用对应的不支持互翻的语种
    if (当前不支持的) {
      源语言项.children.forEach(目标语言项 => {
        目标语言项.disabled = 当前不支持的[源语言项.value].includes(
          目标语言项.value
        )
      })
    } else if (当前目标语言不支持的) {
      // 如果存在目标语言不支持，则代表该api支持任意互翻，禁用掉本就不支持的语种即可
      源语言项.children.forEach(目标语言项 => {
        目标语言项.disabled = 当前目标语言不支持的.includes(目标语言项.value)
      })
    }
  })
})

watchEffect(() => {
  const 当前服务规则 = 服务不支持的对象?.[当前翻译服务.value]
  if (!当前服务规则) return
  const 自定义不支持 = 当前服务规则?.自定义不支持
  const 目标语言不支持 = 当前服务规则?.目标语言不支持
  const 源语言 = 源语言目标语言数组.value[0]
  const 目标语言 = 源语言目标语言数组.value[1]

  // 判断from是否不支持
  // 如果当前的翻译from，在当前api的源语言不支持中不存在，就恢复默认
  if (当前服务规则?.源语言不支持.includes(源语言)) {
    console.log('因为from不兼容，触发重置')
    重置源语言和目标语言()
    return
  }

  // 判断to是否不支持

  // 如果是不支持互翻的api，且当前from的对应to为不支持的，就恢复默认
  if (自定义不支持 && 自定义不支持[源语言].includes(目标语言)) {
    console.log('不支持互翻的api，因为to不兼容，触发重置')
    重置源语言和目标语言()
  }

  // 如果是支持互翻的，则取目标语言不支持数组中进行判断
  if (目标语言不支持 && 目标语言不支持.includes(目标语言)) {
    console.log('支持互翻的api，因为to不兼容，触发重置')
    重置源语言和目标语言()
  }
})

// 监听代码模式
watchEffect(() => {
  if (命名模式.value) {
    源语言目标语言数组.value = ['auto', 'en']
  } else {
    重置源语言和目标语言()
  }
})

// 是否应该显示复制按钮
const 应该显示复制按钮 = computed(() => {
  return 结果对象.数据.结果文字?.trim() && 结果对象.数据.结果码 === 200
})

// 监听复制快捷键
watchEffect(() => {
  const WindowsCopyKeys = keys['ctrl+shift+c']
  const MacCopyKeys = keys['command+shift+c']
  if ((WindowsCopyKeys.value || MacCopyKeys.value) && 应该显示复制按钮.value) {
    快捷键复制()
  }
})

// 设置弹窗的状态
const 设置弹框正在活动 = computed(() => {
  return 设置弹框Ref.value.modalVis
})

// Tab键切换翻译方式
onKeyStroke('Tab', e => {
  if (设置弹框正在活动.value) return
  e.preventDefault()
  let 当前服务索引 = 翻译服务选项.value.findIndex(
    i => i.value === 当前翻译服务.value
  )
  当前服务索引 += 1
  当前服务索引 > 翻译服务选项.value.length - 1 && (当前服务索引 = 0)
  const nextApi = 翻译服务选项.value[当前服务索引]?.value
  当前翻译服务.value = nextApi
  setTimeout(() => {
    防抖翻译()
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
