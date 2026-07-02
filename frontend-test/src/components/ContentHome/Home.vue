<script setup>
import BaseNavbarHome from "../HomeComponents/NavbarHome.vue";
import BaseFooterHome from "../HomeComponents/FooterHome.vue";
import BaseSlideImage from "./SlideImage.vue";
import {shallowRef} from "vue";
import {useQRCode} from "@vueuse/integrations/useQRCode";

const text = shallowRef('https://github.com/fadhlandaikyo-hue')
const qrcode = useQRCode(text, {
  errorCorrectionLevel: 'H',
  margin: 1,
})
</script>

<template>
  <BaseNavbarHome />
  <div class="relative isolate overflow-hidden py-24 sm:py-32 bg-[url(/img/beko.webp)] bg-cover bg-center bg-no-repeat">
    <div class="pointer-events-none absolute inset-0 bg-black/15" aria-hidden="true"></div>
    <div class="relative mx-auto max-w-7xl px-6 lg:px-8 lg:py-8">
      <div
          class="grid items-center gap-10 rounded-[2rem] border border-white/10 bg-sky-500/95 px-8 py-10 text-black shadow-lg"
      >
        <div class="max-w-2xl">
          <h2 class="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">株式会社大協組</h2>
          <h2 class="mt-4 text-2xl font-semibold sm:text-4xl lg:text-5xl">土木部</h2>
          <p class="mt-6 max-w-xl text-base leading-8 text-black/80 sm:text-lg">
            「今やる、すぐやる、先に延ばさない」をモットーとして、技術力の向上、創意工夫により発注者および地域に信頼される最高の品質の実現を目指します
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
    <div class="mx-auto grid max-w-2xl lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
      <div class="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-7xl">

        <div class="lg:max-w-lg pb-6 pl-8">
          <p class="text-base/7 font-semibold text-indigo-400">内容</p>
          <h1 class="mt-2 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl text-black">土木部</h1>
          <p class="mt-6 text-xl/8 -300 text-black">
            明るい未来を築くために、お客様のビジョンを実現する包括的な計画サービスを提供します
          </p>
          <div class="flex justify-center">
            <img v-if="text" class="mt-6 mb-2 rounded border w-16 h-16" :src="qrcode" alt="QR Code" width="122" height="122">
          </div>
        </div>

      </div>
      <div class="-mt-12 p-12 lg:col-start-2 lg:row-start-1">
        <div class="grid grid-flow-col grid-rows-2 gap-4 lg:grid-cols-3">
          <RouterLink to="/home/construction">
            <div class="p-12 bg-transparent border border-gray-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <div class="p-2 w-12 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                  <path
                      fill-rule="evenodd"
                      d="M8.161 2.58a1.875 1.875 0 0 1 1.678 0l4.993 2.498c.106.052.23.052.336 0l3.869-1.935A1.875 1.875 0 0 1 21.75 4.82v12.485c0 .71-.401 1.36-1.037 1.677l-4.875 2.437a1.875 1.875 0 0 1-1.676 0l-4.994-2.497a.375.375 0 0 0-.336 0l-3.868 1.935A1.875 1.875 0 0 1 2.25 19.18V6.695c0-.71.401-1.36 1.036-1.677l4.875-2.437ZM9 6a.75.75 0 0 1 .75.75V15a.75.75 0 0 1-1.5 0V6.75A.75.75 0 0 1 9 6Zm6.75 3a.75.75 0 0 0-1.5 0v8.25a.75.75 0 0 0 1.5 0V9Z"
                      clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="pt-5">工事番号現場名</div>
            </div>
          </RouterLink>

          <RouterLink to="/home/inspection">
            <div class="p-12 bg-transparent border border-gray-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <div class="p-2 w-12 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                  <path
                      fill-rule="evenodd"
                      d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                      clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="pt-5">検査</div>
            </div>
          </RouterLink>

          <RouterLink to="/home/files">
            <div class="p-12 bg-transparent border border-gray-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <div class="p-2 w-12 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="pt-5">ファイル形式または様式</div>
            </div>
          </RouterLink>

          <RouterLink to="/home/inspection-counter">
            <div class="p-12 bg-transparent border border-gray-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
              <div class="p-2 w-12 h-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2Zm6 1h-4v2H9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2h-1V4Zm-3 8a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-2-1a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H9Zm2 5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-2-1a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H9Z" clip-rule="evenodd"/>
                </svg>

              </div>
              <div class="pt-5">検査対策</div>
            </div>
          </RouterLink>
        </div>

      </div>
    </div>
  </div>

  <BaseSlideImage />

  <BaseFooterHome />
</template>

<style scoped>


</style>



