<template>
  <div
    class="main_wrapper flex justify-center h-screen px-20px pb-20px relative overflow-hidden dark:(bg-dark-300 text-white)"
  >
    <div
      class="setting_icon absolute right-3px bottom-3px text-20px text-[#999] cursor-pointer hover:text-[#666]"
      @click="openSettingModal"
    >
      <icon-settings />
    </div>
    <div
      class="p-20px flex flex-col h-full w-full shadow-xl rounded-8px dark:(shadow-[#161616] shadow-lg bg-dark-300 )"
    >
      <div class="text_wrapper flex flex-1">
        <a-textarea
          v-model="userInput"
          class="rounded-t-8px"
          placeholder="请输入要翻译的内容"
        />
      </div>
      <section class="flex my-8px">
        <a-radio-group
          v-model="currentTranslation"
          type="button"
          @change="changeRadioHandler"
        >
          <a-radio
            v-for="item in translateApiOptions"
            :key="item.item"
            :value="item.value"
          >
            {{ item.label }}
          </a-radio>
        </a-radio-group>
        <div
          class="border-solid border-[#f2f3f5] border-b-width-1px flex-1 flex justify-end items-center space-x-8px dark:border-[#3d3d3d]"
        >
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
          <icon-swap stroke-linejoin="round" stroke-linecap="square" />
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
        </div>
      </section>

      <div class="flex flex-1 relative">
        <transition name="component-fade">
          <Loading
            v-if="pageLoading"
            class="rounded-b-8px border-solid border-[#e9e9e9] border-width-1px absolute top-0 w-full h-full dark:(border-transparent bg-[#29292c])"
          />
          <div
            v-else
            class="text_wrapper text_readonly flex flex-1 absolute top-0 h-full w-full"
          >
            <a-textarea
              v-model="resultText"
              class="rounded-b-8px"
              placeholder="翻译结果"
              readonly
            />
            <transition name="component-fade" mode="out-in">
              <div
                v-if="resultText?.trim() && resultCode == 200"
                class="absolute bottom-10px left-1/2 transform -translate-x-1/2"
              >
                <ColorfulBtnC @click="copyResult(resultText)">
                  <icon-copy /> 复制结果
                </ColorfulBtnC>
              </div>
            </transition>
          </div>
        </transition>
      </div>
    </div>

    <!-- 设置弹窗 -->
    <SettingModal
      ref="settingModalRef"
      @ok="settingOk"
      @cancel="settingCancel"
    />
  </div>
</template>

<script setup>
import { debounce, cloneDeep } from 'lodash-es'
import { useClipboard } from '@vueuse/core'
import { IconSwap, IconSettings, IconCopy } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import { apiOptions } from '@/assets/translateApiOption.js'
import { translationCommon } from '@/apis/translation/index.js'
import SettingModal from './SettingModal.vue'
import { userSettingStore } from '@/store/userSetting'

const pageLoading = ref(false) // 是否正在翻译
const userInput = ref('') // 输入的内容
const resultText = ref('') // 翻译结果
const resultCode = ref() // 翻译结果状态(code = 200 为成功)
const { copy } = useClipboard({ resultText })
const currentTranslation = ref('') // 当前翻译api
const translateFrom = ref('auto') // 当前翻译From
const translateTo = ref('zh') // 当前翻译to
const settingModalRef = ref() // 设置弹窗的ref

// 首页设置
// const { homeOption } = storeToRefs(userSettingStore())
const homeOption = ref([])

// 设置弹框点击了确定
function settingOk() {
  nextTick(() => {
    // 重新读取设置
    readSetting()
    // 设置成功，刷新上一次翻译
    startTranslation(currentTranslation.value, true)
  })
}

// 设置弹框点击了取消
function settingCancel(data) {
  console.log('data: ', data)
}

// 打开设置模态框
function openSettingModal() {
  settingModalRef.value.openSettingModal()
}

// 复制结果
function copyResult(val) {
  copy(val)
  Message.success('复制成功')
}

// 翻译方式From参数的选项
const translateFromOptions = ref([
  { label: '自动检测', value: 'auto', disabled: false },
  { label: '中文-简体', value: 'zh', disabled: false },
  { label: '中文-繁体', value: 'cht', disabled: false },
  { label: '文言文-百度', value: 'wyw', disabled: false },
  { label: '英语', value: 'en', disabled: false },
  { label: '日语', value: 'jp', disabled: false },
  { label: '韩语', value: 'kor', disabled: false },
  { label: '俄语', value: 'ru', disabled: false },
  { label: '德语', value: 'de', disabled: false },
  { label: '法语', value: 'fra', disabled: false }
])

// 翻译方式To参数的选项(过滤掉“自动检测”)
const translateToOptions = ref(
  cloneDeep(translateFromOptions.value).filter(i => i.value !== 'auto')
)

// 翻译Api的Radio选项
const translateApiOptions = computed(() => {
  return cloneDeep(apiOptions).filter(
    i => homeOption.value.indexOf(i.value) != -1
  )
})

// 监听用户输入，防抖1200ms
watch(
  userInput,
  debounce(function () {
    startTranslation()
  }, 200)
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

/**修改选中翻译 保存当前选中并翻译 */
function changeRadioHandler() {
  const store = userSettingStore()
  store.setDefaultStorage(currentTranslation.value)
  startTranslation()
}

// 分发翻译请求，并开始翻译，默认根据Radio的值来确定翻译api
async function startTranslation(val = currentTranslation.value, isRefresh) {
  // 如果没输入内容，则不翻译
  if ([undefined, null, ''].includes(userInput.value)) {
    resultText.value = ''
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
  resultText.value = text
  resultCode.value = code
  pageLoading.value = false
}

// 切换翻译的From和To
function changeTranslateType() {
  startTranslation()
}

/**读取配置 */
function readSetting() {
  // 首页设置
  const store = userSettingStore()
  homeOption.value = store.homeOption
  // 当前选中翻译
  if (homeOption.value.indexOf(currentTranslation.value) === -1) {
    currentTranslation.value = store.defaultApi
  }
}

onMounted(() => {
  //  首次加载设置当前选中为设置的默认翻译
  // currentTranslation.value = userSettingStore().defaultApi
  readSetting()
  // 初始化init
  if (!window?.utools) return
  utoolsInit()
})

const utoolsInit = () => {
  window.utools.onPluginEnter(action => {
    settingModalRef.value.closeSettingModal()
    if (action.code == 'anyword') {
      userInput.value = action.payload
    } else {
      userInput.value = ''
    }
  })
  window.utools.subInputBlur()
}
</script>

<style lang="scss" scoped>
.setting_icon {
  transition: transform 250ms ease;
  &:hover {
    transform: rotate(60deg);
  }
  &:active {
    transform: scale(0.8) rotate(60deg);
    color: $primary-color;
  }
}
.text_wrapper {
  ::v-deep(.arco-textarea) {
    resize: none;
    height: 100%;
    font-size: 16px;
  }

  ::v-deep(.arco-textarea-wrapper) {
    background-color: #fff;
    border-color: #e9e9e9;
  }

  ::v-deep(.arco-textarea-focus) {
    border-color: $primary-color;
  }
  // 深色模式
  @media (prefers-color-scheme: dark) {
    ::v-deep(.arco-textarea-wrapper) {
      background-color: #29292c;
      border-color: #00000000;
    }
    ::v-deep(.arco-textarea-focus) {
      border-color: #666;
    }
  }
}
.text_readonly {
  ::v-deep(.arco-textarea) {
    padding-bottom: 40px;
  }
  ::v-deep(.arco-textarea-focus) {
    border-color: #e9e9e9;
  }
  @media (prefers-color-scheme: dark) {
    ::v-deep(.arco-textarea-focus) {
      border-color: transparent;
    }
  }
}
</style>
