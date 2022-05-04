<template>
  <div class="flex justify-center h-screen pt-18px pb-24px">
    <div class="p-20px flex flex-col h-full w-11/12 shadow-xl rounded-8px">
      <a-textarea
        v-model:value="userInput"
        class="flex-1 resize-none rounded-t-8px"
        placeholder="请输入要翻译的内容"
        @change="changeTextHandler"
      />
      <section class="flex my-16px">
        <a-radio-group v-model:value="radioValue" button-style="solid">
          <a-radio-button value="a">百度翻译</a-radio-button>
          <a-radio-button value="b">腾讯翻译</a-radio-button>
          <a-radio-button value="c">谷歌翻译</a-radio-button>
          <a-radio-button value="d">阿里云</a-radio-button>
        </a-radio-group>
        <div
          class="border-solid border-[#d9d9d9] border-b-width-1px flex-1"
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
import translation from '@/apis/translation'

const loading = ref(false)
const userInput = ref('')
const resultText = ref('')
const radioValue = ref('a')

async function changeTextHandler() {
  loading.value = true
  const result = await translation.baidu({
    q: userInput.value,
    from: 'auto',
    to: 'zh'
  })
  resultText.value = result
  loading.value = false
}
</script>

<style lang="scss" scoped></style>
