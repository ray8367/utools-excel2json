<template>
  <div class="code_bg">
    <svg>
      <text x="0" y="70%">&lt;code/&gt;</text>
    </svg>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.code_bg {
  @apply absolute text-100px flex-c left-0 right-0 top-0 bottom-0;
  svg {
    width: 415px;
    text {
      animation: stroke_light 2s ease;
      @apply text-100px animate-fill-both;
      font-family: 'JetBrains Mono NL', Menlo, Monaco, Consolas,
        'Liberation Mono', 'Courier New', monospace;
    }
  }
}

@media (prefers-color-scheme: dark) {
  .code_bg {
    svg {
      text {
        animation: stroke_dark 2s ease;
        animation-fill-mode: both;
      }
    }
  }
}

// 浅色模式下的动画
@keyframes stroke_light {
  0% {
    fill: #0000;
    stroke: #f4f5f6;
    stroke-dashoffset: 25%;
    stroke-dasharray: 0 50%;
    stroke-width: 0.8;
  }
  50% {
    fill: #0000;
    stroke: #f4f5f6;
    stroke-width: 1.2;
  }
  70% {
    fill: #0000;
    stroke: #f4f5f6;
    stroke-width: 1.5;
  }
  90%,
  100% {
    fill: #f7f8f9;
    stroke: #0000;
    stroke-dashoffset: -25%;
    stroke-dasharray: 50% 0;
    stroke-width: 0;
  }
}

// 暗色模式下的动画
@keyframes stroke_dark {
  0% {
    fill: #0000;
    stroke: #494949;
    stroke-dashoffset: 25%;
    stroke-dasharray: 0 50%;
    stroke-width: 0.8;
  }
  50% {
    fill: #0000;
    stroke: #494949;
    stroke-width: 1.2;
  }
  70% {
    fill: #0000;
    stroke: #494949;
    stroke-width: 1.5;
  }
  90%,
  100% {
    fill: #393939;
    stroke: #0000;
    stroke-dashoffset: -25%;
    stroke-dasharray: 50% 0;
    stroke-width: 0;
  }
}
</style>
