<template>
  <div
    border="~ #f2f3f4 dark:#444"
    class="setting_card rounded-4px overflow-hidden w-full"
  >
    <div
      class="title_wrapper bg-#2f54ea:5 flex items-center py-4px px-22px text-16px select-none dark:(bg-#333)"
    >
      <slot name="title">{{ props.title }}</slot>
    </div>
    <div class="px-18px pt-16px">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
@property --offset {
  syntax: '<length>';
  inherits: false;
  initial-value: 0;
}
.setting_card {
  @apply transition-all;
  box-shadow: 0 4px 8px 1px #064bb30a;
  .title_wrapper {
    text-underline-offset: var(--offset, 1px);
    text-decoration: underline solid #0000;
    transition: --offset 250ms, text-decoration-color 250ms, text-shadow 250ms;
  }

  &:hover {
    box-shadow: 5px 5px 7px #f7f7f7;
    .title_wrapper {
      text-shadow: 4px 4px 7px #fff;
      --offset: 4px;
      text-decoration-color: #a3c8ff99;
    }
  }
}
</style>
