<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import UserButtonBack from "../Utilities/UtilitiesUsers/UserButtonBack.vue";

const router = useRouter()

const projects = [
  { id: 1, code: 'K-001', name: '美保(5)格納庫等新設舗装工事',              type: '道路',       contractor: '小島' },
  { id: 2, code: 'K-002', name: '美保(5)格納庫等新設舗装工事',              type: '道路',       contractor: '池岡、内田' },
  { id: 3, code: 'K-003', name: '奥陰田3地区急傾斜地崩壊対策工事その2',     type: '砂防',       contractor: '長谷川、岩田ひ' },
  { id: 4, code: 'K-004', name: '中山3期営農飲雑用水(高田工区)工事',        type: '管路工',     contractor: '岩田こ' },
  { id: 5, code: 'K-005', name: '車尾五丁目ほか枝線工事',                   type: '枝線',       contractor: '西中' },
  { id: 6, code: 'K-006', name: '県道西伯伯太線(宮ノ前歩道橋)橋梁塗装工事', type: '道橋',       contractor: '今中' },
  { id: 7, code: 'K-007', name: '外港中野地区承水路護岸補修工事',            type: '老朽化対策', contractor: '篠原' },
  { id: 8, code: 'K-008', name: '船越地区急傾斜地崩壊対策工事',             type: '崩壊対策',   contractor: '坪倉' },
  { id: 9, code: 'K-009', name: '県道大山寺岸本線電線共同溝設置工事',        type: '共同溝設置', contractor: '西本' },
  { id: 10, code: 'K-010', name: '佐陀川砂防堰堤(K1)工事',                 type: '砂防堰堤',   contractor: '菊川' },
  { id: 11, code: 'K-011', name: '奥山川砂防堰堤工事',                      type: '砂防堰堤',   contractor: '内田' },
  { id: 12, code: 'K-012', name: '鍵掛峠道路新屋地区第13改良工事',           type: '道路',       contractor: '池岡' },
]

const query = ref('')
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return projects
  return projects.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.contractor.includes(q) ||
      p.type.includes(q)
  )
})

function goToCounter(id) {
  router.push(`/dashboard/inspection-counter/${id}`)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <UserButtonBack/>

      <div class="mt-6 mb-8 flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-md">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">検査対策一覧</h1>
          <p class="text-sm text-gray-500 mt-0.5">工事を選択して安全検査チェックリストを記入できます</p>
        </div>
      </div>

      <div class="relative mb-6">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
            v-model="query"
            type="text"
            placeholder="工事名・コード・担当者で検索"
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
        />
      </div>

      <div class="space-y-3">
        <div
            v-for="p in filtered"
            :key="p.id"
            class="w-full text-left bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-5 hover:border-blue-300 hover:shadow-md transition-all duration-200 group cursor-pointer"
            @click="goToCounter(p.id)"
        >
          <div class="shrink-0 w-16 h-16 rounded-xl bg-blue-50 flex flex-col items-center justify-center">
            <span class="text-xs text-blue-400 font-semibold leading-none">番号</span>
            <span class="text-lg font-bold text-blue-600 leading-tight">{{ p.id }}</span>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-mono text-gray-400">{{ p.code }}</span>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100">{{ p.type }}</span>
            </div>
            <p class="text-sm font-semibold text-gray-800 leading-snug truncate">{{ p.name }}</p>
            <p class="text-xs text-gray-500 mt-1">担当者: {{ p.contractor }}</p>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <svg class="w-5 h-5 text-orange-300 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <svg class="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <div v-if="filtered.length === 0" class="py-20 text-center text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p class="text-sm">該当する工事が見つかりません</p>
        </div>
      </div>
    </div>
  </div>
</template>
