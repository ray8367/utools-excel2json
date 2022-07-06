<template>
  <a-tooltip
    content=""
    position="left"
    mini
    :background-color="currentTheme === 'light' ? '#333' : '#555'"
  >
    <!-- TODO: 适配深色 -->
    <template #content>
      <p>智能切换目标语种「{{ props.modelValue ? '开' : '关' }}」</p>
    </template>
    <div
      class="btn_wrapper p-4px w-29px grid-c cursor-pointer rounded-4px transition-all hover:(bg-[#99999933])"
    >
      <icon-star-fill
        class="text-16px"
        :class="[props.modelValue ? 'active' : 'disabled']"
      />
    </div>
  </a-tooltip>
</template>

<script setup>
import { useGlobalStore } from '@/store/globalData.js'
import { IconStarFill } from '@arco-design/web-vue/es/icon'
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
  color: $primary-color;
}
.disabled {
  @apply text-[#ccc];
}
.btn_wrapper {
  aspect-ratio: 1 / 1;
}
</style>
