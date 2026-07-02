<script setup>
import { ref, computed } from "vue"
import { useRouter }     from "vue-router"
import BaseNavbarHome             from "../HomeComponents/NavbarHome.vue"
import BaseFooterHome             from "../HomeComponents/FooterHome.vue"
import BaseButtonBack             from "../Utilities/UtilitiesHome/ButtonBack.vue"

const router = useRouter()

const constructions = [
  { id: 1, code: '', name: '美保(5)格納庫等新設舗装工事', type: '道路', contractor: '小島' },
  { id: 2, code: '', name: '美保(5)格納庫等新設舗装工事', type: '道路', contractor: '池岡、内田' },
  { id: 3, code: '', name: '奥陰田3地区急傾斜地崩壊 対策工事その2', type: '砂防', contractor: '長谷川、岩田ひ' },
  { id: 4, code: '', name: '中山3期営農飲雑用水 (高田工区)工事', type: '管路工', contractor: '岩田こ' },
  { id: 5, code: '', name: '車尾五丁目ほか枝線工事', type: '枝線', contractor: '西中' },
  { id: 6, code: '', name: '県道西伯伯太線(宮ノ前歩道橋) 橋梁塗装工事(2工区)(補助)', type: '道橋', contractor: '今中' },
  { id: 7, code: '', name: '外港中野地区承水路護岸補修工事 (老朽化対策) (3工区)', type: '老朽化対策', contractor: '篠原' },
  { id: 8, code: '', name: '船越地区急傾斜地崩壊対策工事 (2工区)(交付金)(国補正)', type: '崩壊対策', contractor: '坪倉' },
  { id: 9, code: '', name: '県道大山寺岸本線(小林工区) 電線共同溝設置工事(2工区)(補助)', type: '共同溝設置', contractor: '西本' },
  { id: 10, code: '', name: '佐陀川砂防堰堤(K1)工事(9工区) (補助)(国補正)', type: '砂防堰堤', contractor: '菊川' },
  { id: 11, code: '', name: '奥山川砂防堰堤工事(4工区) (交付金)(国補正)', type: '砂防堰堤', contractor: '内田' },
  { id: 12, code: '', name: '鍵掛峠道路新屋地区 第13改良工事', type: '道路', contractor: '池岡' },
]

const typeBadge = {
  Civil: 'bg-green-100 text-green-700',
  Road: 'bg-blue-100 text-blue-700',
  Slope: 'bg-cyan-100 text-cyan-700',
  River: 'bg-amber-100 text-amber-700',
}

const query = ref('')
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return constructions
  return constructions.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.code.includes(q) ||
      c.contractor.includes(q) ||
      c.type.includes(q)
  )
})

function goToDetail(id) {
  router.push(`/home/inspection/${id}`)
}
</script>

<template>
  <BaseNavbarHome/>

  <div class="min-h-screen bg-gray-50">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <BaseButtonBack/>

      <!-- Page header -->
      <div class="mt-6 mb-8 flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">検査一覧</h1>
          <p class="text-sm text-gray-500 mt-0.5">工事を選択して検査記録を確認・追加できます</p>
        </div>
      </div>

      <!-- Search bar -->
      <div class="relative mb-6">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
            v-model="query"
            type="text"
            placeholder="工事名・コード・担当者で検査"
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
        />
      </div>

      <!-- Construction list -->
      <div class="space-y-3">
        <div
            v-for="c in filtered"
            :key="c.id"
            class="inspection-card w-full text-left bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
            @click="goToDetail(c.id)"
        >
          <!-- Code badge -->
          <div class="shrink-0 w-16 h-16 rounded-xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center">
            <span class="text-xs text-blue-400 font-semibold leading-none">番号</span>
            <span class="text-lg font-bold text-blue-700 leading-tight">{{ c.id }}</span>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-mono text-gray-400">{{ c.code }}</span>
              <span :class="['text-xs font-semibold px-2 py-0.5 rounded-full', typeBadge[c.type] || 'bg-gray-100 text-gray-600']">
                {{ c.type }}
              </span>
            </div>
            <p class="text-sm font-semibold text-gray-800 leading-snug truncate">{{ c.name }}</p>
            <p class="text-xs text-gray-500 mt-1">担当者{{ c.contractor }}</p>
          </div>

          <!-- Arrow -->
          <svg class="w-5 h-5 text-gray-300 group-hover:text-blue-500 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>

        <!-- Empty state -->
        <div v-if="filtered.length === 0" class="py-20 text-center text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <p class="text-sm">Empty</p>
        </div>
      </div>

    </div>
  </div>

  <BaseFooterHome/>
</template>




