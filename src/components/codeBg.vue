<template>
  <div class="code_bg">
    <svg>
      <text x="0" y="75%">&lt;code/&gt;</text>
    </svg>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.code_bg {
  position: absolute;
  font-size: 100px;

  display: flex;
  align-items: center;
  justify-content: center;
  color: #f5f6f7;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  svg {
    width: 415px;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    text {
      animation: stroke 2s ease;
      font-size: 100px;
      animation-fill-mode: both;
      font-family: 'JetBrains Mono NL', Menlo, Monaco, Consolas,
        'Liberation Mono', 'Courier New', monospace;
    }
  }
}
@media (prefers-color-scheme: dark) {
  .code_bg {
    color: rgba($color: #000, $alpha: 0.22);
  }
}
// TODO:兼容深色模式
@keyframes stroke {
  0% {
    fill: rgba(0, 0, 0, 0);
    stroke: rgba($color: $primary-color, $alpha: 0.22);
    stroke-dashoffset: 25%;
    stroke-dasharray: 0 50%;
    stroke-width: 0.8;
  }
  50% {
    fill: rgba(0, 0, 0, 0);
    stroke: rgba($color: $primary-color, $alpha: 0.22);
    stroke-width: 1.2;
  }
  70% {
    fill: rgba(0, 0, 0, 0);
    stroke: rgba($color: $primary-color, $alpha: 0.22);
    stroke-width: 1.5;
  }
  90%,
  100% {
    fill: #f5f6f7;
    stroke: rgba(0, 0, 0, 0);
    stroke-dashoffset: -25%;
    stroke-dasharray: 50% 0;
    stroke-width: 0;
  }
}
</style>
