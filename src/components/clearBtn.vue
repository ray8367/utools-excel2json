<template>
  <div class="clear_btn">
    <icon-close class="text-slate-400" />
  </div>
</template>

<script setup>
import { IconClose } from '@arco-design/web-vue/es/icon'
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

.clear_btn {
  border: 1px solid #f2f3f4;
  background-image: linear-gradient(
    145deg,
    var(--houdini-colorA) 0%,
    var(--houdini-colorB) 100%
  );
  box-shadow: 5px 5px 12px #d9d9d9, -5px -5px 12px #fff;
  transition: 300ms --houdini-colorA, 300ms --houdini-colorB, 200ms transform,
    200ms box-shadow;
  &:hover {
    --houdini-colorA: #eeeeee;
    --houdini-colorB: #fff;
  }
  &:active {
    box-shadow: 2px 2px 7px -2px #888, -5px -5px 12px #fff;
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
  @apply absolute right-10px bottom-10px w-24px h-24px z-10 flex-c rounded-8px cursor-pointer;
}
</style>
