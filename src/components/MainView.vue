<template>
  <div class="flex justify-center h-screen pt-18px pb-24px">
    <div class="p-20px flex flex-col h-full w-11/12 shadow-xl rounded-8px">
      <div class="text_wrapper flex flex-1">
        <a-textarea
          v-model="userInput"
          class="rounded-t-8px"
          placeholder="请输入要翻译的内容"
        />
      </div>
      <section class="flex my-8px">
        <a-radio-group
          v-model="radioValue"
          type="button"
          @change="startTranslation"
        >
          <a-radio value="baidu">百度翻译</a-radio>
          <a-radio value="tencent">腾讯翻译</a-radio>
          <a-radio value="google">谷歌翻译</a-radio>
          <a-radio value="ali">阿里云</a-radio>
        </a-radio-group>
        <div
          class="border-solid border-[#f2f3f5] border-b-width-1px flex-1 flex justify-end items-center space-x-8px"
        >
          <!-- 翻译From的select -->
          <a-select
            v-model="translateFrom"
            :style="{ width: '120px' }"
            @change="changeTranslateType"
          >
            <a-option
              v-for="item in translateFromOptions"
              :key="item.value"
              :value="item.value"
              :disabled="item.value === translateTo"
            >
              {{ item.label }}
            </a-option>
          </a-select>
          <icon-swap />
          <!-- 翻译To的select -->
          <a-select
            v-model="translateTo"
            :style="{ width: '120px' }"
            @change="changeTranslateType"
          >
            <a-option
              v-for="item in translateToOptions"
              :key="item.value"
              :value="item.value"
              :disabled="item.value === translateFrom"
            >
              {{ item.label }}
            </a-option>
          </a-select>
        </div>
      </section>

      <div class="flex flex-1">
        <Loading
          v-if="pageLoading"
          class="w-full rounded-b-8px border-solid border-[#e9e9e9] border-width-1px"
        />
        <div v-else class="text_wrapper text_readonly flex flex-1">
          <a-textarea
            v-model="resultText"
            class="rounded-b-8px"
            placeholder="翻译结果"
            readonly
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { debounce, dropWhile } from 'lodash-es'
import { IconSwap } from '@arco-design/web-vue/es/icon'
import translation from '@/apis/translation'

const pageLoading = ref(false) // 是否正在翻译
const userInput = ref('') // 输入的内容
const resultText = ref('') // 翻译结果
const radioValue = ref('baidu') // 翻译api
const translateFrom = ref('auto') // 当前翻译From
const translateTo = ref('zh') // 当前翻译to

// 翻译方式选项From
const translateFromOptions = [
  { label: '自动检测', value: 'auto' },
  { label: '中文', value: 'zh' },
  { label: '英语', value: 'en' }
]

// 翻译方式选项To
const translateToOptions = dropWhile(translateFromOptions, function (i) {
  return i.value === 'auto'
})
// 监听用户输入，防抖1200ms
watch(
  userInput,
  debounce(function () {
    startTranslation()
  }, 200)
)

// 分发翻译请求，并开始翻译
function startTranslation() {
  pageLoading.value = true
  switch (radioValue.value) {
    case 'baidu':
      baiduTranslate()
      break
    case 'tencent':
      tencentTranslate()
      break
    case 'google':
      googleTranslate()
      break
    case 'ali':
      aliTranslate()
      break
    default:
      break
  }
}

// 切换翻译方式
function changeTranslateType() {
  startTranslation()
}

// 百度翻译
async function baiduTranslate() {
  const obj = {
    q: userInput.value,
    from: translateFrom.value,
    to: translateTo.value
  }
  resultText.value = await translation.baidu(obj)
  pageLoading.value = false
}

// 腾讯翻译
async function tencentTranslate() {
  const obj = {
    q: userInput.value,
    from: translateFrom.value,
    to: translateTo.value
  }
  resultText.value = await translation.tencent(obj)
  pageLoading.value = false
}

// 谷歌翻译
async function googleTranslate() {}

// 阿里云翻译
async function aliTranslate() {}
</script>

<style lang="scss" scoped>
.text_wrapper {
  ::v-deep(.arco-textarea) {
    resize: none;
    height: 100%;
  }
  ::v-deep(.arco-textarea-wrapper) {
    background-color: #fff;
    border-color: #e9e9e9;
  }
  ::v-deep(.arco-textarea-focus) {
    border-color: #165dff;
  }
}
.text_readonly {
  ::v-deep(.arco-textarea-focus) {
    border-color: #e9e9e9;
  }
}
</style>
