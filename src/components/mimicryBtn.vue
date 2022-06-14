<template>
  <div class="mimicry_btn">
    <span class="text_inner">
      <slot>
        <icon-more />
      </slot>
    </span>
  </div>
</template>

<script setup>
import { IconMore } from '@arco-design/web-vue/es/icon'

// 按钮点击放大的倍率
const magnification = ref(1.2)

// 按钮放大，文字同步缩小为14的倍率
const minification = computed(() => {
  const after = (magnification.value * 14).toFixed(3)
  return (14 / after).toFixed(3)
})
</script>

<style lang="scss" scoped>
@property --houdini-colorA {
  syntax: '<color>';
  inherits: false;
  initial-value: #fff;
}

@property --houdini-colorB {
  syntax: '<color>';
  inherits: false;
  initial-value: #fff;
}

.mimicry_btn {
  border: 1px solid #f2f3f4;
  background-image: linear-gradient(
    145deg,
    var(--houdini-colorA) 0%,
    var(--houdini-colorB) 100%
  );
  box-shadow: 5px 5px 12px #d9d9d9, -5px -5px 12px #fff;
  transition: 0.3s --houdini-colorA, 0.3s --houdini-colorB,
    0.1s transform linear, 0.2s box-shadow;
  .text_inner {
    transition: all 0.1s linear;
    @apply leading-0;
  }
  &:hover,
  &:active {
    --houdini-colorA: #eee;
    --houdini-colorB: #fff;
  }
  &:active {
    box-shadow: 2px 2px 7px -2px #888, -5px -5px 12px #fff;
    transform: scale(v-bind(magnification));
    .text_inner {
      transform: scale(v-bind(minification));
    }
  }

  @media (prefers-color-scheme: dark) {
    --houdini-colorA: #333;
    --houdini-colorB: #333;
    box-shadow: 5px 5px 12px #112, -5px -5px 12px #333;
    border: 1px solid #444;
    &:hover,
    &:active {
      --houdini-colorA: #222;
      --houdini-colorB: #222;
    }
    &:active {
      box-shadow: 1px 1px 6px #112, -3px -3px 6px #333;
    }
  }
  @apply p-4px z-10 flex-c rounded-8px cursor-pointer text-slate-400 select-none;
}
</style>
