<template>
  <!-- 鼠标悬浮在问号图标上，显示提示文字的组件 -->
  <a-popover position="right">
    <icon-question-circle />
    <template #content>
      <slot></slot>
    </template>
  </a-popover>
</template>

<script setup>
import { IconQuestionCircle } from '@arco-design/web-vue/es/icon'
</script>

<style lang="scss" scoped></style>
