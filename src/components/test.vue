<template>
  <div class="flex justify-center h-screen pt-18px pb-24px">
    <div class="p-20px flex flex-col h-full w-11/12 shadow-xl rounded-8px">
      <a-textarea
        v-model:value="userInput"
        class="flex-1 resize-none rounded-t-8px"
        placeholder="请输入要翻译的内容"
      />
      <section class="flex my-16px" @change="userIsInput">
        <a-radio-group v-model:value="radioValue" button-style="solid">
          <a-radio-button value="baidu">百度翻译</a-radio-button>
          <a-radio-button value="tencent">腾讯翻译</a-radio-button>
          <a-radio-button value="google">谷歌翻译</a-radio-button>
          <a-radio-button value="ali">阿里云</a-radio-button>
        </a-radio-group>
        <div
          class="border-solid border-[#d9d9d9] border-b-width-1px flex-1 flex justify-end"
        ></div>
      </section>

      <div class="flex-1">
        <Loading
          v-if="loading"
          class="h-full rounded-b-8px border-solid border-[#d9d9d9] border-width-1px"
        />
        <a-textarea
          v-else
          v-model:value="resultText"
          class="!h-full rounded-b-8px resize-none"
          placeholder="翻译结果"
          readonly
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { debounce } from 'lodash-es'
import translation from '@/apis/translation'

const loading = ref(false)
const userInput = ref('')
const resultText = ref('')
const radioValue = ref('tencent')

// 监听用户输入
watch(
  userInput,
  debounce(function () {
    userIsInput()
  }, 200)
)

// 分发翻译请求
function userIsInput() {
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

// 百度翻译
async function baiduTranslate() {
  loading.value = true
  const obj = {
    q: userInput.value,
    from: 'auto',
    to: 'zh'
  }
  resultText.value = await translation.baidu(obj)
  loading.value = false
}

// 腾讯翻译
async function tencentTranslate() {
  loading.value = true
  const obj = {
    q: userInput.value,
    from: 'auto',
    to: 'zh'
  }
  resultText.value = await translation.tencent(obj)
  loading.value = false
}

// 谷歌翻译
async function googleTranslate() {}

// 阿里云翻译
async function aliTranslate() {}
</script>

<style lang="scss" scoped></style>
