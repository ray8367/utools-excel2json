<template>
  <div class="">
    <a-modal
      :visible="modalVis"
      fullscreen
      title-align="start"
      modal-animation-name="zoom-br"
      @open="modalOpen"
      @cancel="modalCancel"
    >
      <template #title> 设置 </template>
      <div>
        <p class="indent-4px">
          插件的部分功能依赖第三方服务，不幸的是您需要自行申请之后才能使用它们☹️，但是万幸，他们都是免费的😁
        </p>
        <p>
          <a-link
            id="guide-link"
            target="_blank"
            href="https://www.wolai.com/jtSV7oah6M7rErz2RMFzo"
            @click="openWebUrl"
          >
            大力点击这里，了解如何申请~
          </a-link>
        </p>

        <a-form auto-label-width :model="formData">
          <a-row>
            <a-divider orientation="left">基本设置</a-divider>
            <a-col :span="18">
              <a-form-item label="翻译方式">
                <template #label>
                  <div class="space-x-4px">
                    <span>显示按钮</span>
                    <a-popover position="right">
                      <icon-question-circle />
                      <template #content>
                        <p>在首页您可以通过tab键快速切换翻译方式</p>
                      </template>
                    </a-popover>
                  </div>
                </template>
                <a-checkbox-group v-model="formData.homeHasApi">
                  <a-checkbox
                    v-for="item in translateApiOptions"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-checkbox>
                </a-checkbox-group>
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item label="文本框字号">
                <a-input-number
                  v-model="formData.textFont"
                  :min="14"
                  :max="20"
                  placeholder="请输入文本框字号（14 ~ 20）"
                  mode="button"
                >
                  <template #suffix> 像素 </template>
                </a-input-number>
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item label="快捷键行为">
                <template #label>
                  <div class="space-x-4px">
                    <span>快捷键行为</span>
                    <a-popover position="right">
                      <icon-question-circle />
                      <template #content>
                        <p>
                          {{ calcShortcutKey() + ' ' }}
                          可进行快捷键复制，该选项可设置按下快捷键后会发生什么
                        </p>
                      </template>
                    </a-popover>
                  </div>
                </template>
                <a-radio-group v-model="formData.copyBtnBehavior">
                  <a-radio value="open">仅复制</a-radio>
                  <a-radio value="close"> 复制并隐藏插件 </a-radio>
                  <a-radio value="closeInput"> 复制隐藏并输入 </a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item label="显示按钮">
                <template #label>
                  <div class="space-x-4px">
                    <span>显示按钮</span>
                    <a-popover position="right">
                      <icon-question-circle />
                      <template #content>
                        <p>
                          翻译页底部会显示的按钮，请根据您的使用习惯勾选，勾选多个将会在翻译完成后，底部显示多个按钮，以应对不同的情况
                        </p>
                      </template>
                    </a-popover>
                  </div>
                </template>
                <a-checkbox-group v-model="formData.copyBtnShow">
                  <a-checkbox :value="1">仅复制</a-checkbox>
                  <a-checkbox :value="2">复制并隐藏</a-checkbox>
                  <a-checkbox :value="3">复制并输入</a-checkbox>
                </a-checkbox-group>
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item label="语音朗读">
                <template #label>
                  <div class="space-x-4px">
                    <span>语音朗读</span>
                    <a-popover position="right">
                      <icon-question-circle />
                      <template #content>
                        <p>
                          该选项处于实验性，并可能长期处于实验性，在此期间可能出现一些朗读失败等一些奇怪的bug（不影响翻译），如果开启，则表示你可以接受朗读功能的这些bug
                        </p>
                      </template>
                    </a-popover>
                  </div>
                </template>

                <a-switch v-model="formData.readAloud" />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item label="朗读偏好">
                <template #label>
                  <div class="space-x-4px">
                    <span>朗读偏好</span>
                    <a-popover position="right">
                      <icon-question-circle />
                      <template #content>
                        <p>
                          可以指定翻译结果的朗读声音，如果你发现哪一个语种的朗读非常生硬，可以联系我们
                        </p>
                      </template>
                    </a-popover>
                  </div>
                </template>
                <a-radio-group
                  v-model="formData.readingPreference"
                  :disabled="!formData.readAloud"
                >
                  <a-radio value="default">系统默认</a-radio>
                  <a-radio value="male"> 仅男声 </a-radio>
                  <a-radio value="female"> 仅女声 </a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item label="命名翻译模式">
                <template #label>
                  <div class="space-x-4px">
                    <span>命名翻译模式</span>
                    <a-popover position="right">
                      <icon-question-circle />
                      <template #content>
                        <p>
                          命名翻译模式开启后，将支持一键翻译，并转换成常用大小驼峰、中划线、下划线、等格式，也可通过点击主页左下角的
                          <icon-code class="text-16px" />
                          图标进行快速切换。
                        </p>
                        <p class="font-bold text-red-500">
                          如果你看不懂这句话，那么请不要打开这个选项，也请保持首页左下角的
                          <icon-code class="text-16px" />
                          按钮为灰色状态，以免影响使用！
                        </p>
                      </template>
                    </a-popover>
                  </div>
                </template>
                <a-switch v-model="formData.codeMode" />
              </a-form-item>
            </a-col>
            <a-divider orientation="left">百度翻译</a-divider>
            <a-col :span="18">
              <a-form-item label="APP ID">
                <a-input
                  v-model.trim="formData.appid"
                  placeholder="请输入百度翻译的APP ID"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item label="密钥">
                <a-input-password
                  v-model.trim="formData.token"
                  placeholder="请输入百度翻译的密钥"
                  allow-clear
                />
              </a-form-item>
            </a-col>

            <a-divider orientation="left">腾讯翻译</a-divider>
            <a-col :span="18">
              <a-form-item label="Secret Id">
                <a-input
                  v-model.trim="formData.secretId"
                  placeholder="请输入腾讯翻译Secret Id"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item label="Secret Key">
                <a-input-password
                  v-model.trim="formData.secretKey"
                  placeholder="请输入腾讯翻译Secret Key"
                  allow-clear
                />
              </a-form-item>
            </a-col>

            <a-divider orientation="left">阿里翻译</a-divider>
            <a-col :span="18">
              <a-form-item label="Secret Id">
                <a-input
                  v-model.trim="formData.accessKeyId"
                  placeholder="请输入阿里云AccessKeyID"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item label="Secret Key">
                <a-input-password
                  v-model.trim="formData.accessKeySecret"
                  placeholder="请输入阿里云Access Key Secret"
                  allow-clear
                />
              </a-form-item>
            </a-col>

            <a-divider orientation="left">有道翻译</a-divider>
            <a-col :span="18">
              <a-form-item label="应用ID">
                <a-input
                  v-model.trim="formData.youdaoId"
                  placeholder="请输入有道智云应用ID"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item label="应用密钥">
                <a-input-password
                  v-model.trim="formData.youdaoSecret"
                  placeholder="请输入有道智云应用密钥"
                  allow-clear
                />
              </a-form-item>
            </a-col>

            <a-divider orientation="left">彩云小译</a-divider>
            <a-col :span="18">
              <a-form-item label="令牌">
                <a-input-password
                  v-model.trim="formData.caiyunToken"
                  placeholder="请输入彩云小译令牌"
                  allow-clear
                />
              </a-form-item>
            </a-col>

            <a-divider orientation="left">火山翻译</a-divider>
            <a-col :span="18">
              <a-form-item label="AccessKeyID">
                <a-input
                  v-model.trim="formData.huoshanAccessKeyId"
                  placeholder="请输入火山翻译AccessKeyID"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item label="SecretAccessKey">
                <a-input-password
                  v-model.trim="formData.huoshanSecretAccessKey"
                  placeholder="请输入火山翻译SecretAccessKey"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <template #footer>
        <div class="flex justify-between">
          <div>
            <a-popconfirm
              position="tl"
              content-class="popconfirm_wrapper"
              type="warning"
              content="确定要重置本插件的数据吗？重置可以解决大部分问题，但在此之前请备份好相关服务的信息哦~"
              ok-text="取消"
              cancel-text="确定"
              @cancel="resetData"
            >
              <a-button type="outline" status="danger">重置插件数据</a-button>
            </a-popconfirm>
          </div>
          <div class="space-x-12px">
            <a-button @click="modalCancel">取消</a-button>
            <a-button type="primary" @click="modalOk">确定</a-button>
          </div>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { IconQuestionCircle, IconCode } from '@arco-design/web-vue/es/icon'
import { Message } from '@arco-design/web-vue'
import { apiOptions } from '@/assets/translateApiOption.js'
import { userSettingStore } from '@/store/userSetting'
import { 清除引导, 显示引导 } from '@/utils/showGuide.js'
import { getDbStorageItem } from '@/utils/storage.js'

// 从pinia读取设置
const settingStore = userSettingStore()

const modalVis = ref(false) // 弹框的显隐
const emit = defineEmits(['ok', 'cancel', 'reset'])
const formData = reactive({
  homeHasApi: ['baidu', 'tencent', 'youdao', 'ali'], // 首页展示的翻译方式
  textFont: 16, // 文本框字号
  copyBtnBehavior: 'open', // 快捷键的行为
  copyBtnShow: [1, 2, 3], // 首页显示的按钮
  readAloud: true, // 语音朗读
  readingPreference: 'default', // 朗读偏好
  codeMode: false, // 命名翻译模式
  defaultApi: undefined, // 默认翻译方式
  appid: undefined, // 百度
  token: undefined, // 百度
  secretId: undefined, // 腾讯
  secretKey: undefined, // 腾讯
  accessKeyId: undefined, // 阿里
  accessKeySecret: undefined, // 阿里
  youdaoId: undefined, // 有道
  youdaoSecret: undefined, // 有道
  caiyunToken: undefined, // 彩云
  huoshanAccessKeyId: undefined, // 火山
  huoshanSecretAccessKey: undefined // 火山
})
const utools = window?.utools
const translateApiOptions = ref(apiOptions) // 翻译方式选项

// 默认翻译方式的下拉选项
const defaultOptions = computed(() => {
  return translateApiOptions.value.filter(i =>
    currentHomeHas.value.includes(i.value)
  )
})

const currentHomeHas = ref([]) // 当前首页展示的翻译方式

// 监听首页翻译方式的checkbox勾选数量
watchEffect(() => {
  if (formData.homeHasApi?.length > 4) {
    formData.homeHasApi = currentHomeHas.value
    Message.warning({ content: '最多只能选择4个翻译方式哦~', duration: 2500 })
    return
  }
  if (formData.homeHasApi?.length < 1) {
    formData.homeHasApi = currentHomeHas.value
    Message.warning({
      content: '还是至少留下1个翻译方式吧！',
      duration: 2500
    })
    return
  }
  currentHomeHas.value = formData.homeHasApi
})

// 监听默认翻译方式的下拉选项
// 如果选择了"默认翻译方式"为"首页翻译方式"不准在的，则把可用的翻译方式第一个赋值给默认
watchEffect(() => {
  if (!currentHomeHas.value.includes(formData.defaultApi)) {
    formData.defaultApi = defaultOptions.value[0].value
  }
})

// 点击弹框确定
function modalOk() {
  // 密钥格式转换
  const keyDatas = {
    baidu: {
      appid: formData.appid,
      token: formData.token
    },

    tencent: {
      secretId: formData.secretId,
      secretKey: formData.secretKey
    },

    youdao: {
      appid: formData.youdaoId,
      appkey: formData.youdaoSecret
    },

    ali: {
      accessKeyId: formData.accessKeyId,
      accessKeySecret: formData.accessKeySecret
    },

    caiyun: {
      token: formData.caiyunToken
    },

    huoshan: {
      accessKeyId: formData.huoshanAccessKeyId,
      secretAccessKey: formData.huoshanSecretAccessKey
    }
  }
  settingStore.setHomeOption(formData.homeHasApi)
  settingStore.setDefaultStorage(formData.defaultApi)
  settingStore.setKeyConfig(keyDatas)
  settingStore.setFontSize(formData.textFont)
  settingStore.setCopyBtnBehavior(formData.copyBtnBehavior)
  settingStore.setCodeMode(formData.codeMode)
  settingStore.setCopyBtnShow(formData.copyBtnShow)
  settingStore.setCopyBtnShow(formData.copyBtnShow)
  settingStore.setReadAloud(formData.readAloud)
  settingStore.setReadingPreference(formData.readingPreference)
  Message.success({ content: '设置成功', duration: 1000 })
  emit('ok')
  closeSettingModal()
}

// 动态快捷键文案
function calcShortcutKey() {
  if (!utools) {
    return 'Ctrl+Shift+C / Command+Shift+C'
  } else if (utools.isMacOs()) {
    return 'Command+Shift+C'
  } else {
    return 'Ctrl+Shift+C'
  }
}

// 点击弹框取消
function modalCancel() {
  清除引导()
  emit('cancel')
  closeSettingModal()
}

// 打开设置弹框回调
function modalOpen() {
  // abcd:这里改成从utools取值
  !getDbStorageItem('firstUseSetting') && firstGuide()
}

// 首次提示链接位置
function firstGuide() {
  const option = {
    id: 'firstUseSetting',
    title: '这里有一些提示',
    text: '这可是我起早贪黑写的，你可以在点击”关闭“按钮后点击链接查看，它可以帮助你申请到这些免费的服务，如果你已经是个老手了，那就关闭这个对话框开始使用吧~',
    attachTo: {
      element: '#guide-link',
      on: 'right'
    },
    classes: 'guide_wrapper'
  }
  显示引导(option, 'firstUseSetting')
}

// 关闭设置弹框回调
// function modalClose() {
//
//   清除引导()
// }

// 获取设置
function getSetting() {
  const tempFormData = settingStore.getSetingFormData
  Object.keys(formData).forEach(key => {
    formData[key] = tempFormData[key]
  })
}

// 打开弹窗
function openSettingModal() {
  modalVis.value = true
  getSetting()
}

// 关闭弹窗
function closeSettingModal() {
  modalVis.value = false
}

// 打开url
function openWebUrl(e) {
  if (!utools) return
  utools.shellOpenExternal(e.target.getAttribute('href'))
}

// 重置数据
function resetData() {
  // 重置设置
  settingStore.reset()
  Message.success({ content: '已重置', duration: 300 })
  // 关闭弹窗并通知重置
  setTimeout(() => {
    closeSettingModal()
    emit('reset')
  }, 300)
}

// 暴露打开弹窗的函数，供父组件调用
defineExpose({
  openSettingModal,
  closeSettingModal,
  modalVis
})
</script>

<style lang="scss" scoped></style>
