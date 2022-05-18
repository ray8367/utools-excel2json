<template>
  <button
    ref="btnRef"
    ripple="ripple"
    class="btn_main transition-all flex-c w-120px h-36px relative overflow-hidden rounded-4px shadow-lg hover:shadow-md active:shadow-sm dark:(bg-dark-400 text-shadow-xl shadow-dark-800)"
    @mousedown="showRipple($event)"
    @mouseup="clearRipple"
  >
    <span class="relative z-20">
      <slot name="icon"></slot>
      <slot></slot>
    </span>
    <div class="ripple_wrapper absolute top-0 right-0 bottom-0 left-0">
      <span
        v-for="item in waveDomsArr"
        :key="item.key"
        dynamic="true"
        :style="{
          top: `${item.top}px`,
          left: `${item.left}px`,
          width: `${item.width}px`,
          height: `${item.height}px`
        }"
      ></span>
    </div>
  </button>
</template>

<script setup>
import { delay } from 'lodash-es'
const btnRef = ref() // 按钮的DOM

const waveDomsArr = ref([]) // 波纹DOM数组

// 生成波纹DOM
function showRipple(e) {
  const btnMain = btnRef.value
  const size = btnMain.offsetWidth
  const pos = btnMain.getBoundingClientRect()
  const obj = {
    left: e.pageX - pos.left - size / 2,
    top: e.pageY - pos.top - size / 2,
    width: size,
    height: size,
    key: `${new Date().getTime() - Math.random().toFixed(4)}`
  }
  waveDomsArr.value.push(obj)
}

const delayTime = ref(2000) // 延迟时间

// 鼠标抬起时，清除波纹
function clearRipple() {
  delay(() => cleanFirst(), delayTime.value)
}

// 清除第一个波纹
function cleanFirst() {
  waveDomsArr.value?.length && waveDomsArr.value.shift()
}
</script>

<style lang="scss" scoped>
.btn_main {
  border: 1px solid #eeeeee;
}

.ripple_wrapper {

  span[dynamic='true'] {
    @apply transform scale-0 rounded-full absolute;

    background: linear-gradient(
      45deg,
      #ff000080,
      #ffff0080,
      #00ffff80,
      #0000ff80
    );
    animation: ripple 1200ms ease;
  }
}
@media (prefers-color-scheme: dark) {

  .ripple_wrapper {

    span[dynamic='true'] {
      background: linear-gradient(
        45deg,
        #1900ff77,
        #0066ff77,
        #5e4dff77,
        #a200ff77
      );
    }
  }

  .btn_main {
    border: 1px solid #444444;

    &:hover {
      text-shadow: 0 2px 12px #ffffff6e;
    }
  }
}
@keyframes ripple {

  from {
    opacity: 0.5;
    transform: scale(0);
  }

  to {
    opacity: 0;
    transform: scale(2.5);
  }
}
</style>
