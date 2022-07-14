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
        class="iconfont !text-22px"
        :class="[props.modelValue ? 'active' : 'disabled']"
        >&#xe605;
      </i>
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
const disabledColor = computed(() => {
  return currentTheme.value === 'light' ? '#ccc' : '#555'
})
const enabledColor = computed(() => {
  return currentTheme.value === 'light' ? '#165dff' : '#ffcc33'
})
</script>

<style lang="scss" scoped>
.active {
  color: v-bind(enabledColor);
}
.disabled {
  color: v-bind(disabledColor);
}
.btn_wrapper {
  aspect-ratio: 1 / 1;
  --at-apply: select-none w-32px grid-c cursor-pointer rounded-t-4px transition-all overflow-hidden hover:(bg-[#f2f3f5] dark:bg-[#3d3d3d]);
}
</style>
