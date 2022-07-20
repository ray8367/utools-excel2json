<template>
  <a-tooltip
    content=""
    position="top"
    mini
    :background-color="currentTheme === 'light' ? '#333' : '#555'"
  >
    <template #content>
      <p>智能切换语种「{{ props.modelValue ? '开' : '关' }}」</p>
    </template>
    <div class="btn_wrapper">
      <i
        class="text-20px rounded-2px overflow-hidden"
        :class="[
          props.modelValue
            ? 'active i-simple-icons-adobeillustrator'
            : 'disabled i-icon-park-outline-adobe-illustrate text-24px',
          currentTheme === 'dark' && 'dark'
        ]"
      />
    </div>
  </a-tooltip>
</template>

<script setup>
import { useGlobalStore } from '@/store/globalData.js'
const globalStore = useGlobalStore()
const { currentTheme } = storeToRefs(globalStore)
const props = defineProps({
  modelValue: {
    type: Boolean
  }
})
</script>

<style lang="scss" scoped>
.active {
  color: theme('colors.primary');
  &.dark {
    color: #ffcc33;
  }
}
.disabled {
  color: #ccc;
  &.dark {
    color: #555;
  }
}
.btn_wrapper {
  aspect-ratio: 1 / 1;
  --at-apply: select-none w-32px grid-c cursor-pointer rounded-t-4px transition-all overflow-hidden hover:(bg-[#f2f3f5] dark:bg-[#3d3d3d]);
}
</style>
