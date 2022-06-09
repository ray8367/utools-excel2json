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
  transition: 300ms --houdini-colorA, 300ms --houdini-colorB,
    200ms transform linear, 250ms box-shadow;
  .text_inner {
    transition: all 200ms;
    line-height: 0;
  }
  &:hover {
    --houdini-colorA: #eeeeee;
    --houdini-colorB: #fff;
  }
  &:active {
    box-shadow: 2px 2px 7px -2px #888, -5px -5px 12px #fff;
    transform: scale(1.15);
    .text_inner {
      transform: scale(0.869);
    }
  }

  @media (prefers-color-scheme: dark) {
    --houdini-colorA: #333;
    --houdini-colorB: #333;
    box-shadow: 5px 5px 12px #112, -5px -5px 12px #333;
    border: 1px solid #444;
    &:hover {
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
