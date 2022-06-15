<template>
  <!-- <component :is="comName" /> -->
  <MainView />
</template>

<script setup>
import MainView from '@/views/MainView.vue'
import LightFullPage from '@/components/lightFullPage.vue'
import DarkFullPage from '@/components/darkFullPage.vue'
// import MainView from '@/components/Test.vue'
import '@/utils/setTheme.js'
const comName = ref(MainView)
const isDark = useDark() // 响应式：是否为暗色
// watch(isDark, val => {
//   if (val) {
//     comName.value = DarkFullPage
//   } else {
//     comName.value = LightFullPage
//   }
// })
</script>

<style></style>
