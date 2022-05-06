<template>
  <div class="">
    <a-modal fullscreen @ok="handleOk" @cancel="handleCancel">
      <template #title> Title </template>
      <div>
        You can cusstomize modal body text by the current situation. This modal
        will be closed immediately once you press the OK button.
      </div>
    </a-modal>
  </div>
</template>

<script setup>
function handleOk() {}
function handleCancel() {}
const attrs = useAttrs()
console.log('attrs: ', attrs)
</script>

<style lang="scss" scoped></style>
