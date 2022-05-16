<template>
  <button
    ref="btnRef"
    class="w-100px h-35px btn relative overflow-hidden z-1"
    @click="clickFn($event)"
  >
    <span ref="rippleRef" class="ripple"></span>
    <span class="relative z-10"><slot></slot></span>
  </button>
</template>

<script setup>
let timeOut = null
const btnRef = ref()
const rippleRef = ref()

function clickFn(event) {
  // 如过已经包含animated类
  if (Array.from(rippleRef.value.classList).includes('animated')) {
    resetBtn()
    setTimeout(() => clickFn(event), 0)
    return
  }
  rippleRef.value.classList.add('animated')
  //计算点击的波纹的最大值，并设置为宽高
  const size = Math.max(btnRef.value.offsetWidth, btnRef.value.offsetHeight)
  rippleRef.value.style.width = size + 'px'
  rippleRef.value.style.height = size + 'px'
  //设置鼠标点击的位置为中心点，在这个中心点向四周散开的效果
  rippleRef.value.style.top = `-${btnRef.value.offsetHeight - event.offsetY}px`
  rippleRef.value.style.left =
    -(btnRef.value.offsetWidth / 2 - event.offsetX) + 'px'

  timeOut = setTimeout(() => {
    rippleRef.value.classList.remove('animated')
  }, 800)
}

function resetBtn() {
  clearTimeout(timeOut)
  rippleRef.value.classList.remove('animated')
}
</script>

<style lang="scss" scoped>
.btn {
  border: 1px solid #eee;
}

.ripple {
  position: absolute;
  border-radius: 100%;
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 0.5),
    rgba(255, 255, 0, 0.5),
    rgba(0, 255, 255, 0.5),
    rgba(0, 0, 255, 0.5)
  );
  transform: scale(0);
  pointer-events: none;
}
.animated {
  animation: ripple 0.6s linear;
}

@keyframes ripple {
  100% {
    opacity: 0;
    transform: scale(2.5);
  }
}
</style>
