<template>
  <div class="relative overflow-hidden">
    <transition name="fade-in-standard">
      <template v-if="showAniPage">
        <component
          :is="isDark ? DarkFullPage : LightFullPage"
          class="absolute top-0 z-100"
        />
      </template>
    </transition>
    <MainView />
  </div>
</template>

<script setup>
import { delay } from 'lodash-es'
import MainView from '@/views/MainView.vue'
import LightFullPage from '@/components/lightFullPage.vue'
import DarkFullPage from '@/components/darkFullPage.vue'
import '@/utils/setTheme.js'

const isDark = useDark() // 响应式：是否为暗色
const showAniPage = ref(false) // 显示切换动画

// 延迟关闭动画页面
function delayHiddenAniPage(delayTime = 1200) {
  delay(function () {
    showAniPage.value = false
  }, delayTime)
}

// 主题发生变化则显示动画页面
watch(isDark, () => {
  showAniPage.value = true
})

// 如果显示了动画页面，则延迟关闭
watch(showAniPage, newVal => {
  newVal && delayHiddenAniPage()
})
</script>

<style></style>
