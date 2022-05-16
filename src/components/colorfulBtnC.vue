<template>
  <button
    ref="btnRef"
    ripple="ripple"
    class="btn_main"
    @mousedown="showRipple($event)"
    @mouseup="fn"
  >
    复制结果
    <div ref="btnInner" class="ripple--container"></div>
  </button>
</template>

<script setup>
import { debounce } from 'lodash-es'
const btnRef = ref()
const btnInner = ref()

function showRipple(e) {
  const ripple = btnRef.value
  const rippler = document.createElement('span')
  const size = ripple.offsetWidth
  const pos = ripple.getBoundingClientRect()

  const x = e.pageX - pos.left - size / 2
  const y = e.pageY - pos.top - size / 2
  const style = `top: ${y}px; left: ${x}px; height: ${size}px; width: ${size}px;`
  rippler.setAttribute('style', style)
  btnInner.value.appendChild(rippler)
}

function fn() {
  debounce(cleanUp(), 2000)
}
function cleanUp() {
  console.log(1)
  while (btnInner.value.firstChild) {
    btnInner.value.removeChild(btnInner.value.firstChild)
  }
}
</script>

<style lang="scss" scoped>
.btn_main {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: 0;
  height: 48px;
  width: 300px;
  font-size: 20px;
  position: relative;
  overflow: hidden;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(100deg, #e65327, #ee7a3b, #e65327);
  background-size: 200%;
  border-radius: 8px;
  user-select: none;
  background-size: 200%;
  transition: all 0.5s ease;
  &:hover {
    background-position: 100% 0;
    text-shadow: 0px 0px 13px #fff;
  }
}

.ripple--container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.ripple--container {
  span {
    display: block;
    transform: scale(0);
    border-radius: 100%;
    position: absolute;
    opacity: 0.75;
    background-color: rgba(255, 255, 255, 0.42);
    animation: ripple 1000ms;
  }
}

@keyframes ripple {
  to {
    opacity: 0;
    transform: scale(1.5);
  }
}
</style>
