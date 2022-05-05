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
      <section class="flex my-16px">
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
          class="border-solid border-[#f2f3f5] border-b-width-1px flex-1 flex justify-end"
        >
          <a-dropdown trigger="hover" @select="handleSelect">
            <a-button> {{ 当前翻译方式 }} <icon-down /> </a-button>
            <template #content>
              <a-doption
                v-for="item in 翻译方式数组"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </a-doption>
            </template>
          </a-dropdown>
        </div>
      </section>

      <div class="flex flex-1">
        <Loading
          v-if="loading"
          class="w-full rounded-b-8px border-solid border-[#ddd] border-width-1px"
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
import { debounce } from 'lodash-es'
import { IconDown } from '@arco-design/web-vue/es/icon'
import translation from '@/apis/translation'

const loading = ref(false)
const userInput = ref('')
const resultText = ref('')
const radioValue = ref('baidu')
const 当前翻译方式 = ref('自动检测')

const 翻译方式数组 = [
  { label: '自动检测', value: 'auto' },
  { label: '中 → 英', value: 'aaaa' },
  { label: '英 → 中', value: 'bbbb' }
]
// 监听用户输入
watch(
  userInput,
  debounce(function () {
    startTranslation()
  }, 200)
)

// 分发翻译请求，并开始翻译
function startTranslation() {
  loading.value = true
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
function handleSelect(e) {
  console.log(e)
  // 动态给下拉菜单赋值文字
  当前翻译方式.value = 翻译方式数组.find(i => i.value === e).label
  startTranslation()
}

// 百度翻译
async function baiduTranslate() {
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

<style lang="scss" scoped>
.text_wrapper {
  ::v-deep(.arco-textarea) {
    resize: none;
    height: 100%;
  }
  ::v-deep(.arco-textarea-wrapper) {
    background-color: #fff;
    border-color: #ddd;
  }
  ::v-deep(.arco-textarea-focus) {
    border-color: #165dff;
  }
}
.text_readonly {
  ::v-deep(.arco-textarea-focus) {
    border-color: #ddd;
  }
}
.arco-icon {
  transition: all 0.3s ease;
}
.arco-dropdown-open {
  .arco-icon-down {
    transform: rotate(-180deg);
  }
}
</style>
