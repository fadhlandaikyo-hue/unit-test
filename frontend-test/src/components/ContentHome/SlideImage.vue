<script setup>
import {ref, onMounted, onUnmounted} from 'vue'

const activeIndex = ref(0)
const totalImages = 7
let intervalId = null

const next = () => {
  if (activeIndex.value === totalImages - 1) {
    activeIndex.value = 0
  } else {
    activeIndex.value++
  }
}

const prev = () => {
  if (activeIndex.value === 0) {
    activeIndex.value = totalImages - 1
  } else {
    activeIndex.value--
  }
}


const startAutoSlide = () => {
  stopAutoSlide()
  intervalId = setInterval(() => {
    next()
  }, 5000)
}

const stopAutoSlide = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  stopAutoSlide()
})
</script>

<template>
  <div class="text-center mb-8 md:mb-10" style="opacity: 1; transform: none;">
    <h2 class="text-[32px] uppercase font-semibold mb-4 pb-10 md:pb-0 "/>
    <p class="text-gray-600 max-w-2xl mx-auto"></p>
  </div>
  <div class="flex items-center justify-center min-h-105 bg-gray-100 p-4 md:min-h-130">

    <div class="relative w-full max-w-4xl group overflow-hidden rounded-2xl shadow-2xl" @mouseenter="stopAutoSlide"
         @mouseleave="startAutoSlide">
      <div class="flex transition-transform duration-700 ease-in-out h-64 md:h-96"
           :style="{ transform: `translateX(-${activeIndex * 100}%)` }">
        <div class="w-full shrink-0 relative">
          <a href="https://www.daikyou-g.co.jp/index.php">
            <img src="/img/unnamed.webp" class="w-full h-full object-cover" alt="Slide 1">
          </a>

        </div>

        <div class="w-full shrink-0 relative">
          <img src="/construction_img/奥山/奥山.webp" class="w-full h-full object-cover" alt="Slide 2">
        </div>

        <div class="w-full shrink-0 relative">
          <img src="/construction_img/佐陀/佐陀.webp" class="w-full h-full object-cover" alt="Slide 2">
        </div>

        <div class="w-full shrink-0 relative">
          <img src="/construction_img/奥陰/奥陰.webp" class="w-full h-full object-cover" alt="Slide 2">
        </div>

        <div class="w-full shrink-0 relative">
          <img src="/construction_img/宮ノ前/宮ノ前.webp" class="w-full h-full object-cover" alt="Slide 2">
        </div>

        <div class="w-full shrink-0 relative">
          <img src="/construction_img/新屋/新屋.webp" class="w-full h-full object-cover" alt="Slide 2">
        </div>

        <div class="w-full shrink-0 relative">
          <img src="/construction_img/日南/日南.webp" class="w-full h-full object-cover" alt="Slide 2">
        </div>

      </div>

      <button @click="prev"
              class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
             class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
        </svg>
      </button>

      <button @click="next"
              class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
             class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
        </svg>
      </button>

      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        <button v-for="idx in totalImages" :key="idx" @click="activeIndex = idx - 1"
                class="h-2 rounded-full transition-all duration-300"
                :class="activeIndex === idx - 1 ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'"></button>
      </div>

      <div class="absolute bottom-0 left-0 h-1 bg-white/30 w-full">
        <div :key="activeIndex" class="h-full bg-white animate-load"></div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>


