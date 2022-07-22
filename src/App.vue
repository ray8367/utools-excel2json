<template>
  <MainView />
</template>

<script setup>
import '@/utils/setTheme.js'
import MainView from '@/views/MainView.vue'
import { darkPrimaryColor } from '@/config/colorConfig.js'
import { hex转rgb } from '@/utils/colorConvert.js'
import { useGlobalStore } from '@/store/globalData.js'
const globalStore = useGlobalStore()
const { currentTheme } = storeToRefs(globalStore)

const cssStr = ref('')

const darkStyleStr = `body[arco-theme='dark'] {--arcoblue-6: ${hex转rgb(
  darkPrimaryColor
)};}`
const { css } = useStyleTag(cssStr)

// 此处不用load和unload处理，而是直接动态改变<style>中的内容
// 因为css内容不多
watchEffect(() => {
  css.value = currentTheme.value === 'light' ? '' : darkStyleStr
})
</script>
