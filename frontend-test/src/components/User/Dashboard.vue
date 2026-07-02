<script setup>
import { ref, onMounted, onUnmounted } from "vue"
import BaseSidebar from "../UserComponents/SidebarUser.vue";
import UserSlideImage from "../ContentUser/UserSlideImage.vue";

const dateTime = ref("")

let timer = null

const updateTime = () => {
  const now = new Date()

  const date = now.toLocaleDateString("ja-JP", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  })

  const time = now.toLocaleTimeString("en-US")

  dateTime.value = `${date} - ${time}`
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="flex h-full">

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">土木ホームページへようこそ</h1>
          <p class="text-gray-500 mt-1">日々の現場作業、点検、工事の進捗を一か所で管理できます。</p>
        </div>
        <div class="hidden sm:block px-4 py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-gray-600 border border-gray-200">
          {{dateTime}}
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>

        <div class="flex justify-between items-start mb-6">
          <h2 class="text-xl font-bold text-gray-800 flex items-center">
            <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            現場メモと技術更新
          </h2>
          <span class="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-100">最新ブリーフィング</span>
        </div>

        <div class="space-y-4">
          <div class="flex items-start p-3 hover:bg-gray-50 rounded-lg transition">
            <span class="flex-shrink-0 w-2 h-2 mt-2 bg-red-500 rounded-full mr-4"></span>
            <div>
              <p class="text-sm font-semibold text-gray-900">安全調整会議</p>
              <p class="text-sm text-gray-600 mt-1">全現場チームを対象に、毎日14時からツールボックスミーティングを実施します。
                重点項目は、重機の移動、歩行者動線、および天候に伴うリスク管理です。</p>
            </div>
          </div>
          <div class="flex items-start p-3 hover:bg-gray-50 rounded-lg transition">
            <span class="flex-shrink-0 w-2 h-2 mt-2 bg-yellow-500 rounded-full mr-4"></span>
            <div>
              <p class="text-sm font-semibold text-gray-900">橋梁床版コンクリート打設</p>
              <p class="text-sm text-gray-600 mt-1">ゾーンBのコンクリート打設は計画数量に到達し、スランプ試験に合格しました。ゾーンAの鉄筋配置の修正作業は、次回のコンクリート打設前に実施予定です。</p>
            </div>
          </div>
          <div class="flex items-start p-3 hover:bg-gray-50 rounded-lg transition">
            <span class="flex-shrink-0 w-2 h-2 mt-2 bg-green-500 rounded-full mr-4"></span>
            <div>
              <p class="text-sm font-semibold text-gray-900">
                設備メンテナンスが完了しました。
              </p>
              <p class="text-sm text-gray-600 mt-1">
                クレーン02の定期メンテナンスが完了し、運転確認も承認されました。当該機は通常の揚重作業に使用可能な状態となっています。
              </p>
            </div>
          </div>
        </div>
      </div>

      <UserSlideImage/>
    </main>
    <BaseSidebar/>
  </div>
</template>

<style scoped>

</style>

