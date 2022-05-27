<template>
  <div
    class="main_wrapper flex-c h-screen px-20px pb-20px relative overflow-hidden dark:(bg-dark-300 text-white)"
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
            <ClearBtn @click="clearInput" />
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
            <!-- 翻译From的select -->
            <a-select
              v-model="translateFrom"
              :style="{ width: '130px' }"
              @change="changeTranslateType"
            >
              <a-option
                v-for="item in translateFromOptions"
                :key="item.value"
                :value="item.value"
                :disabled="item.disabled"
              >
                {{ item.label }}
              </a-option>
            </a-select>

            <icon-arrow-right />

            <!-- 翻译To的select -->
            <a-select
              v-model="translateTo"
              :style="{ width: '130px' }"
              @change="changeTranslateType"
            >
              <a-option
                v-for="item in translateToOptions"
                :key="item.value"
                :value="item.value"
                :disabled="item.disabled"
              >
                {{ item.label }}
              </a-option>
            </a-select>
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
          <transition name="component-fade">
            <Loading
              v-if="pageLoading"
              class="rounded-b-8px border-solid border-[#e9e9e9] border-width-1px absolute top-0 w-full h-full dark:(border-transparent bg-[#29292c])"
            />
            <div
              v-else
              class="text_wrapper text_readonly flex flex-1 absolute top-0 h-full w-full"
              :class="{ code_textarea: codeMode }"
            >
              <a-textarea
                v-model="resultObj.data.resultText"
                class="rounded-b-8px relative z-1"
                placeholder="翻译结果"
                readonly
              />
              <transition name="component-fade" mode="out-in">
                <div
                  v-show="shouldShowCopyBtn"
                  class="absolute bottom-10px left-1/2 transform -translate-x-1/2 z-1"
                >
                  <ColorfulBtn @click="copyResult()">
                    <icon-copy /> 复制结果
                  </ColorfulBtn>
                </div>
              </transition>
            </div>
          </transition>
        </div>
      </a-resize-box>
    </div>
  </div>

  <!-- 设置弹窗 -->
  <SettingModal ref="settingModalRef" @ok="settingOk" @cancel="settingCancel" />
</template>

<script setup>
import { debounce, throttle, cloneDeep } from 'lodash-es'
import { useClipboard } from '@vueuse/core'
import { nanoid } from 'nanoid'
import {
  IconArrowRight,
  IconSettings,
  IconCopy,
  IconCode
} from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import { storeToRefs } from 'pinia'
import { translationCommon } from '@/apis/translation/index.js'
import { userSettingStore } from '@/store/userSetting'
import { showGuide } from '@/utils/showGuide.js'
import { getDbStorageItem } from '@/utils/storage.js'
import { changeCaseArr } from '@/assets/changeCaseMap.js'
const store = userSettingStore()
const {
  homeOption,
  getHomeApiOptions: translateApiOptions,
  getHomeFontSize: textFont,
  copyBtnBehavior
} = storeToRefs(store)
const codeMode = computed(() => store.codeMode) // 命名翻译模式
const pageLoading = ref(false) // 是否正在翻译
const userInput = ref('') // 输入的内容
const resultObj = reactive({
  data: {
    resultText: ``, // 翻译结果
    resultCode: 0, // 翻译结果状态(code = 200 为成功)
    resultId: nanoid()
  }
})
const { copy } = useClipboard() // 复制结果功能
const keys = useMagicKeys()
const currentTranslation = ref('') // 当前翻译api
const translateFrom = ref('auto') // 当前翻译From
const translateTo = ref('zh') // 当前翻译to
const codeSelect = ref('camelCase') // 当前翻译to
const settingModalRef = ref() // 设置弹窗的ref
const inputRef = ref() // 输入textarea的dom
// 翻译方式From参数的选项
const translateFromOptions = ref([
  { label: '自动检测', value: 'auto', disabled: false },
  { label: '中文-简体', value: 'zh', disabled: false },
  { label: '英语', value: 'en', disabled: false },
  { label: '日语', value: 'jp', disabled: false },
  { label: '俄语', value: 'ru', disabled: false },
  { label: '韩语', value: 'kor', disabled: false },
  { label: '德语', value: 'de', disabled: false },
  { label: '法语', value: 'fra', disabled: false },
  { label: '中文-繁体', value: 'cht', disabled: false },
  { label: '文言文-百度', value: 'wyw', disabled: false }
])
// 翻译方式To参数的选项(过滤掉“自动检测”)
const translateToOptions = ref(
  cloneDeep(translateFromOptions.value).filter(i => i.value !== 'auto')
)

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
    // 设置成功，刷新上一次翻译
    startTranslation(currentTranslation.value, true)
  })
  inputFocus()
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
function changeMode() {
  Message.success({
    content: `命名翻译模式${codeMode.value ? '关闭' : '开启'}`,
    duration: 1000
  })
  store.setCodeMode(!codeMode.value)
  setTimeout(() => {
    startTranslation()
    inputFocus()
  }, 0)
}

// 修改选中翻译 保存当前选中并翻译
function changeRadioHandler() {
  store.setDefaultStorage(currentTranslation.value)
  startTranslation()
  inputFocus()
}

// 分发翻译请求，并开始翻译，默认根据Radio的值来确定翻译api
async function startTranslation(val = currentTranslation.value, isRefresh) {
  // 如果没输入内容，则不翻译
  if ([undefined, null, ''].includes(userInput.value)) {
    resultObj.data.resultText = ''
    return
  }

  pageLoading.value = true
  const obj = {
    q: userInput.value,
    from: translateFrom.value,
    to: translateTo.value,
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
  setTimeout(() => {
    startTranslation()
  }, 0)
  inputFocus()
}

function firstGuide() {
  const option = {
    id: 'firstUseMain',
    title: '欢迎使用易翻☺️',
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

// 初始化utools
function utoolsInit() {
  window.utools.onPluginEnter(({ code, payload }) => {
    settingModalRef.value.closeSettingModal()
    userInput.value = code === 'anyword' ? payload : ''
  })
  window.utools.subInputBlur()
}

// 复制结果
const copyResult = throttle(async (val = resultObj.data.resultText) => {
  await copy(val)
  Message.success({ content: '复制成功', duration: 2500 })
  setTimeout(() => {
    if (copyBtnBehavior.value === 'close' && window.utools) {
      window.utools.hideMainWindow()
    }
  }, 300)
}, 300)

onMounted(() => {
  window?.utools && utoolsInit()
  inputFocus()
  readSetting()
  !getDbStorageItem('firstUseMain') && firstGuide()
})

// 监听用户输入，防抖翻译
watch(
  userInput,
  debounce(function () {
    !pageLoading.value && startTranslation()
  }, 300)
)

// 监听
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
      showGuide(option, 'firstUseMain')
    }
  }
)

// api不支持的语言value声明
const apiNotSupport = {
  baidu: [],
  tencent: ['wyw'],
  google: ['wyw'],
  ali: ['wyw'],
  youdao: ['wyw'],
  caiyun: ['wyw', 'de', 'fra', 'cht', 'kor']
}

// 根据api动态变更选项的disabled属性
watchEffect(() => {
  // 当前翻译api的名字
  const apiName = currentTranslation.value
  // 当前翻译api不支持的语种value数组
  const currentApiDisabledArr = apiNotSupport[apiName] || []
  // 根据不支持语种数组，动态设置选项中的disabled，禁用掉不支持的选项
  translateFromOptions.value.forEach(i => {
    i.disabled = currentApiDisabledArr.includes(i.value)
  })
  // 彩云的选项单独处理，这里除开彩云
  if (apiName !== 'caiyun') {
    translateToOptions.value.forEach(i => {
      i.disabled = currentApiDisabledArr.includes(i.value)
    })
  }
  // Boolean: From或To是否现在的值，是否是当前翻译api不支持的翻译语种
  const paramsHasNoSupport =
    currentApiDisabledArr.includes(translateFrom.value) ||
    currentApiDisabledArr.includes(translateTo.value)
  // 如果包含不支持的，则重置为自动 —— 中文-简体
  if (paramsHasNoSupport) {
    translateFrom.value = 'auto'
    translateTo.value = 'zh'
  }
})

// 单独处理彩云的选项
watchEffect(() => {
  // 如果不是彩云，直接return
  if (currentTranslation.value !== 'caiyun') return
  const fromIsAuto = translateFrom.value === 'auto' // From是否是自动
  const fromIsZh = translateFrom.value === 'zh' // From是否是中文
  const toIsZh = translateTo.value === 'zh' // To是否是中文
  // 彩云不支持的语种value数组
  const caiyunDisabledArr = apiNotSupport.caiyun
  // 循环To的数组
  translateToOptions.value.forEach(i => {
    // 先禁用彩云不支持的
    i.disabled = caiyunDisabledArr.includes(i.value)
    // 如果From是中文，则禁用To选项的中文
    if (fromIsZh && i.value === 'zh') {
      i.disabled = true
    }
    // 如果From不是中文也不是自动（那就是外语），则禁用To选项中除了中文以外的，并自动设置为中文
    if (!fromIsZh && !fromIsAuto) {
      i.disabled = i.value !== 'zh'
      translateTo.value = 'zh'
    }
  })
  // 如果两边都是中文，则把后面的改成英文
  if (fromIsZh && toIsZh) {
    translateTo.value = 'en'
  }
})

watchEffect(() => {
  if (codeMode.value) {
    translateFrom.value = 'auto'
    translateTo.value = 'en'
  } else {
    translateFrom.value = 'auto'
    translateTo.value = 'zh'
  }
})

// 是否应该显示复制按钮
const shouldShowCopyBtn = computed(() => {
  return resultObj.data.resultText?.trim() && resultObj.data.resultCode === 200
})

// 监听复制快捷键
watchEffect(() => {
  const WindowsCopyKeys = keys['ctrl+shift+x']
  const MacCopyKeys = keys['command+shift+x']
  if ((WindowsCopyKeys.value || MacCopyKeys.value) && shouldShowCopyBtn.value) {
    copyResult()
  }
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
      border-color: #666666;
    }
    ::v-deep(.arco-textarea) {
      background-color: #242425a6;
    }
  }
}

// 下面的文本域样式
.text_readonly {
  position: relative;
  &.code_textarea {
    &::after {
      content: '<code/>';
      position: absolute;
      font-size: 100px;
      font-family: 'JetBrains Mono NL', Menlo, Monaco, Consolas,
        'Liberation Mono', 'Courier New', monospace;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #f5f6f7;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }
  }
  ::v-deep(.arco-textarea-focus) {
    border-color: #e9e9e9;
  }

  @media (prefers-color-scheme: dark) {
    ::v-deep(.arco-textarea-focus) {
      border-color: transparent;
    }

    &.code_textarea::after {
      color: rgba($color: #000000, $alpha: 0.22);
    }
  }
}

.tools_wrapper {
  @media (prefers-color-scheme: dark) {
    ::v-deep(.arco-radio-checked) {
      color: #fff;
      text-shadow: 0 3px 15px #ffffffb8;
      background-color: #222 !important;
    }
  }
}
</style>
