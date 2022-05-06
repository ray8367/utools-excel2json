<template>
  <div class="">
    <a-modal
      :visible="modalVis"
      fullscreen
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <template #title> 设置 </template>
      <div>
        <div class="flex">
          <div>1</div>
          <div>2</div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
const modalVis = ref(false)
const emit = defineEmits(['ok', 'cancel'])
// 点击弹框确定
function handleOk() {
  emit('ok', 'ok要传的')
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
