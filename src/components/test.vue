<template>
  <div class="p-10px flex flex-col h-screen">
    <a-textarea
      v-model:value="userInput"
      class="flex-1 resize-none"
      placeholder="请输入要翻译的内容"
    />
    <section class="flex my-16px">
      <a-radio-group
        v-model:value="radioValue"
        button-style="solid"
        size="large"
      >
        <a-radio-button value="a">百度翻译</a-radio-button>
        <a-radio-button value="b">腾讯翻译</a-radio-button>
        <a-radio-button value="c">谷歌翻译</a-radio-button>
        <a-radio-button value="d">阿里云</a-radio-button>
      </a-radio-group>
      <div
        class="border-solid border-[#d9d9d9] border-b-width-1px flex-1"
      ></div>
    </section>
    <a-textarea
      v-model:value="resultText"
      class="flex-1 resize-none"
      placeholder="翻译结果"
      readonly
    />
  </div>
</template>

<script setup>
const userInput = ref('')
const resultText = ref('')
const radioValue = ref('a')
</script>

<style lang="scss" scoped></style>
