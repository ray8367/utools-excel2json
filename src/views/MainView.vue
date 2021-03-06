<template>
  <div class="main_wrapper">
    <div class="main">
      <div class="text_wrapper flex flex-1 relative">
        <!-- 清除按钮 -->
        <transition name="component-scale">
          <template v-if="!['', undefined, null].includes(用户输入)">
            <MimicryBtn
              key="1"
              class="absolute right-10px bottom-8px"
              @click="清空输入框()"
            >
              <i i-line-md-close />
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
          v-model="当前翻译api"
          type="button"
          @change="切换翻译服务()"
        >
          <a-radio
            v-for="项 in (翻译api数组 || []).slice(0, 4)"
            :key="项.item"
            :value="项.value"
          >
            {{ 项.label }}
          </a-radio>
        </a-radio-group>
        <div
          border="#f2f3f5 b-width-1px dark:#3d3d3d"
          class="flex flex-1 justify-end items-center space-x-8px"
        >
          <!-- 命名翻译模式的select -->
          <template v-if="是命名模式">
            <a-select
              v-model="命名模式类型"
              :style="{ width: '130px' }"
              @change="命名模式切换类型()"
            >
              <a-option
                v-for="(项, 索引) in 切换类型数组"
                :key="索引"
                :value="项.name"
              >
                {{ 项.label }}
              </a-option>
            </a-select>
          </template>

          <template v-else>
            <AutoBtn v-model="自动模式" @click="切换自动模式()" />
            <a-cascader
              v-model:model-value="form和to的数组"
              path-mode
              :options="语种树的数据"
              :style="{ width: '240px' }"
              value-key="id"
              :format-label="格式化级联显示内容"
              @change="切换from和to()"
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
            v-if="是命名模式 && [-1, 200].includes(结果对象.数据.结果码)"
          />
          <transition name="fade-in-standard">
            <Loading
              v-if="翻译加载"
              border="~ #e9e9e9"
              class="rounded-b-8px absolute top-0 z-100"
            />
          </transition>
          <div
            class="text_wrapper text_readonly flex flex-1 absolute top-0 h-full w-full"
            :class="{ 'code_font-family': 是命名模式 }"
          >
            <a-textarea
              v-model="结果对象.数据.结果文字"
              class="rounded-b-8px relative z-1"
              :placeholder="下方placeholder"
              readonly
            />
            <transition v-if="朗读功能 && !是命名模式" name="fade-in-standard">
              <div
                v-show="要显示复制按钮"
                class="absolute left-10px bottom-8px z-1 flex space-x-8px"
              >
                <!-- 播放按钮 -->
                <MimicryBtn :loading="朗读loading" @click="点击朗读()">
                  <i i-akar-icons-sound-on />
                </MimicryBtn>

                <!-- 开始暂停按钮 -->
                <MimicryBtn v-show="音频Url" @click="正在播放 = !正在播放">
                  <i
                    :class="[
                      正在播放 ? 'i-ic-twotone-pause' : 'i-ri-play-fill'
                    ]"
                  ></i>
                </MimicryBtn>
              </div>
            </transition>

            <transition name="fade-in-standard" mode="out-in">
              <div
                v-show="要显示复制按钮"
                class="bottom-8px absolute-x-center z-1 flex space-x-8px"
              >
                <ColorfulBtn
                  v-if="复制按钮显示的数组.includes(1)"
                  @click="复制按钮事件(1)"
                >
                  <template #icon>
                    <i i-line-md-clipboard-arrow class="text-18px" />
                  </template>
                  仅复制
                </ColorfulBtn>
                <ColorfulBtn
                  v-if="复制按钮显示的数组.includes(2)"
                  @click="复制按钮事件(2)"
                >
                  <template #icon>
                    <i i-line-md-minus class="text-18px" />
                  </template>
                  复制并隐藏
                </ColorfulBtn>
                <ColorfulBtn
                  v-if="复制按钮显示的数组.includes(3)"
                  @click="复制按钮事件(3)"
                >
                  <template #icon>
                    <i i-line-md-edit-twotone class="text-18px" />
                  </template>
                  复制并输入
                </ColorfulBtn>
              </div>
            </transition>
          </div>
        </div>
      </a-resize-box>
    </div>
    <!-- 设置按钮 -->
    <i
      id="setting-wrapper"
      class="icon setting_icon i-carbon-settings"
      @click="打开设置Modal()"
    >
    </i>
    <!-- 命名翻译模式按钮 -->
    <div
      class="icon code_icon"
      :class="[是命名模式 ? 'active i-carbon-code' : 'i-carbon-code-hide']"
      @click="切换模式()"
    ></div>
  </div>

  <!-- 设置弹窗 -->
  <SettingModal
    ref="设置弹框Ref"
    @ok="设置确定()"
    @cancel="设置取消()"
    @reset="resetHandler()"
  />
</template>

<script setup>
import { debounce, throttle, replace } from 'lodash-es'
import { nanoid } from 'nanoid'
import { Message as 提示 } from '@arco-design/web-vue'

import { storeToRefs } from 'pinia'
import { 通用翻译 } from '@/apis/translation/index.js'
import { 用户设置存储 } from '@/store/userSetting'
import { 显示引导, 清除引导 } from '@/utils/showGuide.js'
import { getDbStorageItem as 获取存储项 } from '@/utils/storage.js'
import { 语种树, api不支持的大对象 } from '@/assets/translateApiOption.js'
import useUtools from './useUtools'
import use语音朗读模块 from './useVoice'
import use复制模块 from './useCopy'
import use命名模式模块 from './useNamingMode'
import use主题 from './useTheme'
import 关闭窗口 from './useExit'

const 语种树的数据 = ref(语种树())
const form和to的数组 = ref(['auto', 'zh'])
const 存储 = 用户设置存储()
const {
  homeOption: 首页选项,
  getHomeApiOptions: 翻译api数组,
  getHomeFontSize: 文字尺寸,
  copyBtnShow: 复制按钮显示的数组,
  defaultForeignLanguage: 默认目标外语语种
  // theme: 主题
} = storeToRefs(存储)
const 翻译加载 = ref(false) // 是否正在翻译
const 用户输入 = ref('') // 输入的内容
const 结果对象 = reactive({
  数据: {
    结果文字: ``, // 翻译结果
    结果码: -1, // 翻译结果状态(code = 200 为成功,code = -1为等待用户操作,code = 401为未配置翻译API)
    结果编号: nanoid()
  }
})
const 当前翻译api = ref('') // 当前翻译api
const 设置弹框Ref = ref() // 设置弹窗的ref
const 用户输入框Ref = ref() // 输入textarea的dom
const 下方placeholder = ref('翻译结果') // 下方placeholder
const { 朗读功能, 音频Url, 朗读loading, 正在播放, 点击朗读, 重置音频 } =
  use语音朗读模块(form和to的数组, 结果对象)

const { 要显示复制按钮, 复制按钮事件 } = use复制模块(结果对象)
const {
  是命名模式,
  命名模式类型,
  切换类型数组,
  命名模式切换类型,
  返回命名模式对应结果,
  改变命名模式类型
} = use命名模式模块(结果对象)

use主题()

const { utools, utools初始化 } = useUtools(
  设置弹框Ref,
  用户输入,
  改变命名模式类型
)
const 自动模式 = ref(true)

关闭窗口(utools)

function 格式化级联显示内容(options) {
  const 文字 = options.map(option => option.label)
  return h('div', { class: 'flex items-center justify-between relative' }, [
    h('span', {}, 文字[0] + '\u3000'),
    h(
      'i',
      {
        class: 'i-gg-arrow-right text-22px flex-1 absolute-center'
      },
      ''
    ),
    h('span', {}, '\u3000' + 文字[1])
  ])
}

// 清空输入框
function 清空输入框() {
  用户输入.value = ''
  输入框focus()
}

// 输入框获取焦点
function 输入框focus() {
  用户输入框Ref.value.focus()
}

// 设置弹框点击了确定
function 设置确定() {
  nextTick(() => {
    // 重新读取设置
    读取设置()
    // 输入框获取焦点
    输入框focus()
    // 设置成功，刷新上一次翻译
    开始翻译(当前翻译api.value, true)
  })
}

// 设置弹框点击了取消
function 设置取消() {
  输入框focus()
}

// 打开设置模态框
function 打开设置Modal() {
  设置弹框Ref.value.打开弹窗()
}

const 切换自动模式 = throttle(() => {
  自动模式.value = !自动模式.value
}, 500)

watch(自动模式, newVal => {
  提示.success(`智能切换语种已${newVal ? '开启' : '关闭'}`)
})

// 变更模式
const 切换模式 = throttle(() => {
  提示.success({
    content: `命名翻译模式${是命名模式.value ? '关闭' : '开启'}`,
    duration: 1000
  })
  // 如果未输入，则结果码设为-1，即为等待用户操作状态，-1会触发Code动画
  // 否则，将结果码设为0，后面会触发翻译，翻译成功后继而变为200，会在成功后触发Code动画
  // 如果连续翻译，结果码从200 => 200并不会触发Code动画，符合预期
  结果对象.数据.结果码 = !用户输入.value ? -1 : 0

  存储.setCodeMode(!是命名模式.value)
  输入框focus()
  setTimeout(() => {
    开始翻译()
  }, 0)
}, 1000)

// 修改翻译服务，同时保存当前选中的服务作为默认，并翻译
function 切换翻译服务() {
  存储.setDefaultStorage(当前翻译api.value)
  setTimeout(() => {
    开始翻译()
  }, 0)
}

// 分发翻译请求，并开始翻译，默认根据Radio的值来确定翻译api
async function 开始翻译(val = 当前翻译api.value, isRefresh) {
  重置音频()
  输入框focus()
  // 如果没输入内容，则不翻译
  if ([undefined, null, ''].includes(用户输入.value.trim())) {
    结果对象.数据.结果文字 = ''
    return
  }
  if (自动模式.value && !是命名模式.value) {
    changeFromTo()
  }

  翻译加载.value = true
  const obj = {
    q: 用户输入.value,
    from: form和to的数组.value[0],
    to: form和to的数组.value[1],
    isRefresh
  }
  const { text: 返回的文字, code: 状态码 } = await 通用翻译(val, obj)
  const 处理后的文字 = 是命名模式.value
    ? 返回命名模式对应结果(返回的文字, 命名模式类型.value)
    : 返回的文字
  结果对象.数据 = {
    结果文字: 处理后的文字,
    结果码: 状态码,
    结果编号: nanoid()
  }
  翻译加载.value = false
}

// 切换翻译的From和To
function 切换from和to() {
  自动模式.value = false
  输入框focus()
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
  if (!首页选项.value.includes(当前翻译api.value)) {
    当前翻译api.value = 存储.defaultApi || 首页选项.value?.[0]
  }
}

// 重置后首页设置
function resetHandler() {
  清空输入框()
  读取设置()
}

function 重置from和to(arr = ['auto', 'zh']) {
  form和to的数组.value = arr
}

const 特殊符号reg = /[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E\s]/g
const 去除英文符号的用户输入 = computed(() => {
  return replace(用户输入.value, 特殊符号reg, '')
})

function 获取用户输入前几个字(字数 = 0) {
  return 去除英文符号的用户输入.value.substring(0, 字数)
}

// 汉字+汉字符号的正则
const ChineseReg =
  /[\u4e00-\u9fa5|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5|[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]]/g

const 用户输入字数 = computed(() => {
  return 去除英文符号的用户输入.value.match(/./gu)?.length || 0
})

function changeFromTo() {
  if (是命名模式.value) return
  let arr
  const 目标外语 = 默认目标外语语种.value
  if (用户输入字数.value < 20) {
    const 第一个字是为汉字 = !!获取用户输入前几个字(1).match(ChineseReg)
    arr = ['auto', 第一个字是为汉字 ? 目标外语 : 'zh']
  } else {
    const 抽样数量 = 20
    const 比例 = 0.35
    const 一部分字 = 获取用户输入前几个字(抽样数量)
    const 一部分字包含汉字数 =
      replace(一部分字, ChineseReg, '◎').split('◎').length - 1
    const 汉字占一部分字的比例 = parseFloat(
      一部分字包含汉字数 / 抽样数量
    ).toFixed(2)
    const 前一部分字大多汉字 = 汉字占一部分字的比例 >= 比例
    arr = ['auto', 前一部分字大多汉字 ? 目标外语 : 'zh']
  }
  重置from和to(arr)
}

const pageTitle = useTitle() // 网页下页面标题
const 页面可见性 = useDocumentVisibility()
onMounted(() => {
  utools && utools初始化()
  输入框focus()
  读取设置()
  !获取存储项('firstUseMain') && 首次引导()
})

const 恢复标题 = useTimeoutFn(() => {
  pageTitle.value = '易翻翻译'
  下方placeholder.value = '翻译结果'
}, 1000)

// 页面可见性逻辑
watch(页面可见性, (current, previous) => {
  if (current === 'visible' && previous === 'hidden') {
    const 欢迎词 = '欢迎回来~🎉'
    pageTitle.value = `${欢迎词} - 易翻翻译`
    下方placeholder.value = 欢迎词
    输入框focus()
    恢复标题.start()
  } else if (current === 'hidden' && previous === 'visible') {
    正在播放.value = false
  }
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
  const 当前api规则 = api不支持的大对象?.[当前翻译api.value]
  if (!当前api规则) return
  const 非互翻_自定义不支持 = 当前api规则?.自定义不支持 // 不支持互翻的才会有这个obj
  const 互翻_to不支持的数组 = 当前api规则?.to不支持 // 支持互翻的会有这个数组

  语种树的数据.value.forEach(源语言项 => {
    // 一层循环禁用掉api本身就不支持的语种
    源语言项.disabled = 当前api规则?.from不支持.includes(源语言项.value)

    // 如果存在「自定义不支持」这个对象，则为不支持任意互翻api，根据数据禁用对应的不支持互翻的语种
    if (非互翻_自定义不支持) {
      源语言项.children.forEach(目标语言项 => {
        const 不支持的数组 = 非互翻_自定义不支持[源语言项.value]
        目标语言项.disabled = 不支持的数组
          ? 不支持的数组.includes(目标语言项.value)
          : true
      })
    } else if (互翻_to不支持的数组) {
      // 如果存在目标语言不支持，则代表该api支持任意互翻，禁用掉本就不支持的语种即可
      源语言项.children.forEach(目标语言项 => {
        目标语言项.disabled = 互翻_to不支持的数组.includes(目标语言项.value)
      })
    }
  })
})

function 检查from和to是否兼容(arr = []) {
  const 当前api规则 = api不支持的大对象?.[当前翻译api.value]
  if (!当前api规则) return
  const 非互翻_自定义不支持 = 当前api规则?.自定义不支持 // 不支持互翻的才会有这个obj
  const 互翻_to不支持的数组 = 当前api规则?.to不支持 // 支持互翻的会有这个数组
  const 源语言 = arr?.[0]
  const 目标语言 = arr?.[1]

  // 判断from是否不支持
  // 如果当前的翻译from，在当前api的源语言不支持中不存在，就恢复默认
  if (当前api规则?.from不支持.includes(源语言)) {
    return 'from不兼容'
  }

  // 判断to是否不支持
  // 如果是不支持互翻的api，且当前from的对应to为不支持的，就恢复默认
  if (非互翻_自定义不支持 && 非互翻_自定义不支持[源语言].includes(目标语言)) {
    return 'to不兼容'
  }

  // 如果是支持互翻的，则取目标语言不支持数组中进行判断
  if (互翻_to不支持的数组 && 互翻_to不支持的数组.includes(目标语言)) {
    return 'to不兼容'
  }
  return '兼容'
}

// 监听当前的to和form是否是当前api不支持的，如果存在不支持的，则重置
watchEffect(() => {
  const result = 检查from和to是否兼容(form和to的数组.value)
  if (['from不兼容', 'to不兼容'].includes(result)) {
    重置from和to()
  }
})

// 监听代码模式
watchEffect(() => {
  if (是命名模式.value) {
    form和to的数组.value = ['auto', 'en']
  } else {
    重置from和to()
  }
})

// 设置弹窗的状态
const 设置弹框正在活动 = computed(() => {
  return 设置弹框Ref.value.modal可见
})

// Tab键切换翻译方式
onKeyStroke('Tab', e => {
  if (设置弹框正在活动.value) return
  e.preventDefault()
  let 当前api的index = 翻译api数组.value.findIndex(
    i => i.value === 当前翻译api.value
  )
  当前api的index += 1
  if (当前api的index > 翻译api数组.value.length - 1) {
    当前api的index = 0
  }
  const 下一个api = 翻译api数组.value[当前api的index]?.value
  当前翻译api.value = 下一个api
  setTimeout(() => {
    防抖翻译()
  }, 0)
})
</script>

<style lang="scss" scoped>
.main_wrapper {
  @apply grid-c h-screen overflow-hidden px-24px pb-24px relative dark:(bg-[#303133] text-white);
  .main {
    @apply p-16px flex flex-col h-full w-full shadow-xl rounded-8px overflow-hidden dark:(shadow-[#161616] bg-dark-300 shadow-lg );
  }
}
.icon {
  @apply text-22px text-[#999] cursor-pointer transition-all duration-250 hover:text-[#666];
}

.code_icon {
  @apply absolute left-4px bottom-4px;
  &:hover {
    // @apply rotate-180deg;
    // @apply rotate-179.99999deg;
    transform: rotateZ(180deg);
  }
  &:active {
    transform: scale(0.8) rotate(180deg);
  }
  &.active {
    @apply text-primary;
  }
}
.setting_icon {
  @apply absolute right-4px bottom-4px;

  &:hover {
    @apply rotate-60deg;
  }
  &:active {
    @apply text-primary;
    transform: scale(0.8) rotate(60deg);
  }
}

// 文本域公用样式
.text_wrapper {
  ::v-deep(.arco-textarea) {
    font-size: v-bind(文字尺寸);
    @apply h-full pr-26px pb-50px resize-none;
  }

  ::v-deep(.arco-textarea-wrapper) {
    @apply border-#e9e9e9 bg-transparent;
  }

  ::v-deep(.arco-textarea-focus) {
    @apply border-primary;
  }
}

// 下面的文本域样式
.text_readonly {
  @apply relative;
  ::v-deep(.arco-textarea-focus) {
    @apply border-#e9e9e9;
  }
}

.tools_wrapper {
  ::v-deep(.arco-select-view-single) {
    @apply px-22px;
  }
  ::v-deep(.arco-select-view-value) {
    @apply grid;
  }
}
</style>
