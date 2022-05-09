<template>
  <div
    class="main_wrapper flex justify-center h-screen pt-18px pb-24px relative dark:(bg-dark-300 text-white)"
  >
    <div
      class="setting_icon absolute right-8px bottom-8px text-22px text-[#666] cursor-pointer"
      @click="openSettingModal"
    >
      <icon-settings />
    </div>
    <div
      class="p-20px flex flex-col h-full w-11/12 shadow-xl rounded-8px dark:(shadow-[#161616] shadow-lg bg-dark-300 )"
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
          @change="startTranslation"
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
                v-if="resultText?.trim()"
                class="absolute bottom-10px left-1/2 transform -translate-x-1/2 transition-all shadow-md hover:shadow-lg"
              >
                <a-button type="primary" @click="copyResult(resultText)">
                  <template #icon> <icon-copy /> </template>
                  <span>复制结果</span>
                </a-button>
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
import SettingModal from './SettingModal.vue'
import { translationCommon } from '@/apis/translation'

const pageLoading = ref(false) // 是否正在翻译
const userInput = ref('') // 输入的内容
const resultText = ref('') // 翻译结果
const { copy } = useClipboard({ resultText })
const currentTranslation = ref('ali') // 翻译api
const translateFrom = ref('auto') // 当前翻译From
const translateTo = ref('zh') // 当前翻译to
const settingModalRef = ref() // 设置弹窗的ref

// 设置弹框点击了确定(不一定用到)
function settingOk(data) {
  console.log('data: ', data)
}

// 设置弹框点击了取消(不一定用到)
function settingCancel(data) {
  console.log('data: ', data)
}

// 打开设置模态框
function openSettingModal() {
  settingModalRef.value.openSettingModal()
}
function copyResult(val) {
  copy(val)
  Message.success('复制成功')
}

// 翻译方式From参数的选项
const translateFromOptions = ref([
  { label: '自动检测', value: 'auto', disabled: false },
  { label: '中文', value: 'zh', disabled: false },
  { label: '文言文-百度', value: 'wyw', disabled: false },
  { label: '英语', value: 'en', disabled: false },
  { label: '日语', value: 'jp', disabled: false },
  { label: '俄语', value: 'ru', disabled: false },
  { label: '德语', value: 'de', disabled: false },
  { label: '法语', value: 'fra', disabled: false }
])

// 翻译方式To参数的选项(过滤掉“自动检测”)
const translateToOptions = computed(() => {
  return translateFromOptions.value.filter(i => i.value !== 'auto')
})

// 翻译Api的Radio选项
const translateApiOptions = computed(() => {
  return cloneDeep(apiOptions).filter(i => i.homeShow)
})

// 监听用户输入，防抖1200ms
watch(
  userInput,
  debounce(function () {
    startTranslation()
  }, 200)
)

// 监听文言文选项相关
watchEffect(() => {
  // Boolean:当前翻译api不是百度
  const currentNotBaidu = currentTranslation.value !== 'baidu'

  // 文言文选项的disabled属性跟着上面的变量随之变化
  translateFromOptions.value.forEach(i => {
    if (i.value === 'wyw') {
      i.disabled = currentNotBaidu
    }
  })

  // Boolean:当前翻译参数是否带有文言文
  const paramsHasWyw =
    translateFrom.value === 'wyw' || translateTo.value === 'wyw'

  // 如果api不是百度，并且翻译参数中带有文言文，则重置翻译参数
  if (currentNotBaidu && paramsHasWyw) {
    translateFrom.value = 'auto'
    translateTo.value = 'zh'
  }
})

// 分发翻译请求，并开始翻译，默认根据Radio的值来确定翻译api
async function startTranslation(val = currentTranslation.value) {
  // 如果没输入内容，则不翻译
  if ([undefined, null, ''].includes(userInput.value)) {
    resultText.value = ''
    return
  }

  pageLoading.value = true
  const obj = {
    q: userInput.value,
    from: translateFrom.value,
    to: translateTo.value
  }
  const { text } = await translationCommon(val, obj)
  resultText.value = text
  pageLoading.value = false
}

// 切换翻译的From和To
function changeTranslateType() {
  startTranslation()
}
</script>

<style lang="scss" scoped>
.setting_icon {
  transition: all 250ms ease;
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
