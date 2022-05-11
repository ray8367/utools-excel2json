<template>
  <div class="">
    <a-modal
      :visible="modalVis"
      fullscreen
      title-align="start"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template #title> 设置 </template>
      <div>
        <p>
          插件的功能依赖第三方服务，不幸的是您需要自行申请之后才能使用它们☹️，但是万幸，他们都是免费的😁
        </p>
        <p>
          <a-link
            target="_blank"
            href="https://www.wolai.com/jtSV7oah6M7rErz2RMFzo"
          >
            猛戳这里了解如何申请~
          </a-link>
        </p>

        <a-form auto-label-width :model="formData">
          <a-row>
            <a-divider orientation="left">基本设置</a-divider>
            <a-col :span="18">
              <a-form-item label="首页翻译方式">
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
              <a-form-item label="默认翻译方式">
                <a-select
                  v-model="formData.defaultApi"
                  placeholder="想要一打开插件就用什么翻译呢？"
                >
                  <a-option
                    v-for="item in translateApiOptions"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-divider orientation="left">百度翻译</a-divider>
            <a-col :span="18">
              <a-form-item label="APP ID">
                <a-input
                  v-model.trim="formData.appid"
                  placeholder="请输入百度翻译的APP ID"
                />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item label="密钥">
                <a-input
                  v-model.trim="formData.token"
                  placeholder="请输入百度翻译的密钥"
                />
              </a-form-item>
            </a-col>

            <a-divider orientation="left">腾讯云机器翻译</a-divider>
            <a-col :span="18">
              <a-form-item label="Secret Id">
                <a-input
                  v-model.trim="formData.secretId"
                  placeholder="请输入腾讯翻译Secret Id"
                />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item label="Secret Key">
                <a-input
                  v-model.trim="formData.secretKey"
                  placeholder="请输入腾讯翻译Secret Key"
                />
              </a-form-item>
            </a-col>

            <a-divider orientation="left">阿里云机器翻译</a-divider>
            <a-col :span="18">
              <a-form-item label="Secret Id">
                <a-input
                  v-model.trim="formData.accessKeyId"
                  placeholder="请输入阿里云Access Key ID"
                />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item label="Secret Key">
                <a-input
                  v-model.trim="formData.accessKeySecret"
                  placeholder="请输入阿里云Access Key Secret"
                />
              </a-form-item>
            </a-col>
            <a-divider orientation="left">有道翻译</a-divider>
            <a-col :span="18">
              <a-form-item label="应用ID">
                <a-input
                  v-model.trim="formData.youdaoId"
                  placeholder="请输入有道智云应用ID"
                />
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item label="应用密钥">
                <a-input
                  v-model.trim="formData.youdaoSecret"
                  placeholder="请输入有道智云应用密钥"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { Message } from '@arco-design/web-vue'
import { apiOptions } from '@/assets/translateApiOption.js'
import { userSettingStore } from '@/store/userSetting'
// 从pinia读取设置
const settingStore = userSettingStore()
const { keyConfig } = settingStore

const modalVis = ref(false) // 弹框的显隐
const emit = defineEmits(['ok', 'cancel'])
const formData = reactive({
  homeHasApi: settingStore.homeOption, // 首页展示的翻译方式
  defaultApi: settingStore.defaultApi, // 默认翻译方式
  appid: keyConfig.baidu.appid, // 百度
  token: keyConfig.baidu?.token, // 百度
  secretId: keyConfig.tencent?.secretId, // 腾讯
  secretKey: keyConfig.tencent?.secretKey, // 腾讯
  accessKeyId: keyConfig.ali?.accessKeyId, // 阿里
  accessKeySecret: keyConfig.ali?.accessKeySecret, // 阿里
  youdaoId: keyConfig.youdao?.appid, // 有道
  youdaoSecret: keyConfig.youdao?.appkey // 有道
})

const translateApiOptions = ref(apiOptions) // 翻译方式选项
const currentHomeHas = ref([])

// 监听首页翻译方式的长度
watchEffect(() => {
  if (formData.homeHasApi?.length > 4) {
    formData.homeHasApi = currentHomeHas.value
    Message.warning('最多只能选择4个翻译方式')
    return
  }
  if (formData.homeHasApi?.length < 1) {
    formData.homeHasApi = currentHomeHas.value
    Message.warning('最少保留1个翻译方式')
    return
  }
  currentHomeHas.value = formData.homeHasApi
})

// 点击弹框确定
function handleOk() {
  emit('ok', 'ok要传的 ')
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
    }
  }
  settingStore.setHomeOption(formData.homeHasApi)
  settingStore.setDefaultStorage(formData.defaultApi)
  settingStore.setKeyConfig(keyDatas)
  closeSettingModal()
}

// 点击弹框取消
function handleCancel() {
  emit('cancel', 'cancel要传的')
  closeSettingModal()
}

// 打开弹窗
function openSettingModal() {
  modalVis.value = true
}

// 关闭弹窗
function closeSettingModal() {
  modalVis.value = false
}

// 暴露打开弹窗的函数，供父组件调用
defineExpose({
  openSettingModal
})
</script>

<style lang="scss" scoped></style>
