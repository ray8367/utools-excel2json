<template>
  <div
    class="grid-c flex-col bg-white w-full h-full dark:(border-transparent bg-[#272728])"
  >
    <svg class="ap" viewBox="0 0 128 256" width="128px" height="256px">
      <defs>
        <linearGradient id="ap-grad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="hsl(223,90%,55%)" />
          <stop offset="100%" stop-color="hsl(253,90%,55%)" />
        </linearGradient>
        <linearGradient id="ap-grad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="hsl(193,90%,55%)" />
          <stop offset="50%" stop-color="hsl(223,90%,55%)" />
          <stop offset="100%" stop-color="hsl(253,90%,55%)" />
        </linearGradient>
      </defs>
      <circle
        class="ap_ring"
        r="56"
        cx="64"
        cy="192"
        fill="none"
        stroke="#ddd"
        stroke-width="16"
        stroke-linecap="round"
      />
      <circle
        class="ap_worm1"
        r="56"
        cx="64"
        cy="192"
        fill="none"
        stroke="url(#ap-grad1)"
        stroke-width="16"
        stroke-linecap="round"
        stroke-dasharray="87.96 263.89"
      />
      <path
        class="ap_worm2"
        d="M120,192A56,56,0,0,1,8,192C8,161.07,16,8,64,8S120,161.07,120,192Z"
        fill="none"
        stroke="url(#ap-grad2)"
        stroke-width="16"
        stroke-linecap="round"
        stroke-dasharray="87.96 494"
      />
    </svg>
    <p class="mt-20px text-16px text-gray-500">{{ loadingText }}</p>
  </div>
</template>

<script setup>
const { counter: duration } = useInterval(1000, { controls: true })

const loadingText = computed(() => {
  const time = duration.value
  if (time > 13) {
    return '我还在努力，但是你可以检查一下网络连接是否正常'
  } else if (time > 9) {
    return '马上就翻译出来了！'
  } else if (time > 6) {
    return '网络稍微有点慢，请再等一下吧~'
  } else if (time > 3) {
    return '正在努力翻译~'
  } else {
    return '翻译中...'
  }
})
</script>

<style lang="scss" scoped>
.ap {
  width: 50px;
  height: 100px;
}

.ap_ring {
  stroke: #17181c26;
  transition: stroke 0.3s;
}

.ap_worm1,
.ap_worm2 {
  animation-duration: 3s;
  animation-iteration-count: infinite;
}

.ap_worm1 {
  animation-name: worm1;
}

.ap_worm2 {
  visibility: hidden;
  animation-name: worm2;
}

@keyframes worm1 {
  0% {
    stroke-dashoffset: -87.96;
    animation-timing-function: ease-in-out;
  }

  20% {
    stroke-dashoffset: 0;
    animation-timing-function: ease-in;
  }

  60% {
    visibility: visible;
    stroke-dashoffset: -791.68;
  }

  60.1%,
  100% {
    visibility: hidden;
    stroke-dashoffset: -791.68;
  }
}

@keyframes worm2 {
  0%,
  60% {
    visibility: hidden;
    stroke-dashoffset: -87.96;
  }

  60.1% {
    visibility: visible;
    stroke-dashoffset: -87.96;
    animation-timing-function: cubic-bezier(0, 0, 0.5, 0.75);
  }

  77% {
    visibility: visible;
    stroke-dashoffset: -340;
    animation-timing-function: cubic-bezier(0.5, 0.25, 0.5, 0.88);
  }

  100% {
    visibility: visible;
    stroke-dashoffset: -669.92;
  }
}
</style>
