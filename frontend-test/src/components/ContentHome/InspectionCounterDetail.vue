<script setup>
import { ref, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import BaseNavbarHome from "../HomeComponents/NavbarHome.vue"
import BaseFooterHome from "../HomeComponents/FooterHome.vue"
import ButtonBackInspectionCounter from "../Utilities/UtilitiesHome/ButtonBackInspectionCounter.vue"

const route     = useRoute()
const projectId = Number(route.params.id)
const apiUrl    = import.meta.env.VITE_API_PATH || "/api"

const projects = [
  { id: 1,  code: 'K-001', name: '美保(5)格納庫等新設舗装工事',              type: '道路',       contractor: '小島' },
  { id: 2,  code: 'K-002', name: '美保(5)格納庫等新設舗装工事',              type: '道路',       contractor: '池岡、内田' },
  { id: 3,  code: 'K-003', name: '奥陰田3地区急傾斜地崩壊対策工事その2',     type: '砂防',       contractor: '長谷川、岩田ひ' },
  { id: 4,  code: 'K-004', name: '中山3期営農飲雑用水(高田工区)工事',        type: '管路工',     contractor: '岩田こ' },
  { id: 5,  code: 'K-005', name: '車尾五丁目ほか枝線工事',                   type: '枝線',       contractor: '西中' },
  { id: 6,  code: 'K-006', name: '県道西伯伯太線(宮ノ前歩道橋)橋梁塗装工事', type: '道橋',       contractor: '今中' },
  { id: 7,  code: 'K-007', name: '外港中野地区承水路護岸補修工事',            type: '老朽化対策', contractor: '篠原' },
  { id: 8,  code: 'K-008', name: '船越地区急傾斜地崩壊対策工事',             type: '崩壊対策',   contractor: '坪倉' },
  { id: 9,  code: 'K-009', name: '県道大山寺岸本線電線共同溝設置工事',        type: '共同溝設置', contractor: '西本' },
  { id: 10, code: 'K-010', name: '佐陀川砂防堰堤(K1)工事',                   type: '砂防堰堤',   contractor: '菊川' },
  { id: 11, code: 'K-011', name: '奥山川砂防堰堤工事',                        type: '砂防堰堤',   contractor: '内田' },
  { id: 12, code: 'K-012', name: '鍵掛峠道路新屋地区第13改良工事',            type: '道路',       contractor: '池岡' },
]
const project = projects.find(p => p.id === projectId) || null

// ── checklist categories ──────────────────────────────────────
const categories = [
  {
    id: 'general', label: '一般安全', icon: 'shield', color: 'blue',
    items: [
      { id: 'g1', label: '作業員全員の安全教育が完了している' },
      { id: 'g2', label: '保護具（ヘルメット・安全帯）の着用を確認した' },
      { id: 'g3', label: '作業区域への立入禁止措置が施されている' },
      { id: 'g4', label: '緊急連絡先・救急体制が整備されている' },
      { id: 'g5', label: '作業前のKYT（危険予知訓練）を実施した' },
    ]
  },
  {
    id: 'equipment', label: '機械・設備', icon: 'cog', color: 'orange',
    items: [
      { id: 'e1', label: '重機・車両の始業点検が完了している' },
      { id: 'e2', label: '誘導員が配置されている' },
      { id: 'e3', label: '電気設備のアース・漏電遮断器を確認した' },
      { id: 'e4', label: '足場・仮設設備の安全点検を実施した' },
      { id: 'e5', label: '工具・機材に異常がないことを確認した' },
    ]
  },
  {
    id: 'environment', label: '作業環境', icon: 'map', color: 'green',
    items: [
      { id: 'v1', label: '作業現場の整理整頓が行われている' },
      { id: 'v2', label: '雨天・強風等の気象条件を確認した' },
      { id: 'v3', label: '地盤・法面の安定性を確認した' },
      { id: 'v4', label: '近隣への騒音・振動対策が実施されている' },
      { id: 'v5', label: '排水・泥水処理の対策が整っている' },
    ]
  },
  {
    id: 'fire', label: '火災・防災', icon: 'fire', color: 'red',
    items: [
      { id: 'f1', label: '消火器が設置・点検されている' },
      { id: 'f2', label: '可燃物の管理・保管場所が適切である' },
      { id: 'f3', label: '溶接・切断作業時の火花養生が完了している' },
      { id: 'f4', label: '危険物取扱資格者が配置されている' },
    ]
  },
]


const checked     = ref({})
const inspector   = ref('')
const isLoading   = ref(true)
const savedAt     = ref(null)


const localKey = `inspection_counter_${projectId}`
const today    = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })

async function loadFromApi() {
  const res  = await fetch(`${apiUrl}/projects/${projectId}/checklist`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  return json.data
}

onMounted(async () => {
  try {
    const data      = await loadFromApi()
    checked.value   = data.checked   || {}
    inspector.value = data.inspector || ''
    savedAt.value   = data.saved_at  ? new Date(data.saved_at).toLocaleString('ja-JP') : null
  } catch {
    try {
      const raw = localStorage.getItem(localKey)
      if (raw) {
        const data      = JSON.parse(raw)
        checked.value   = data.checked   || {}
        inspector.value = data.inspector || ''
        savedAt.value   = data.savedAt   ? new Date(data.savedAt).toLocaleString('ja-JP') : null
      }
    } catch { /* ignore */ }
  } finally {
    isLoading.value = false
  }
})

const totalItems   = computed(() => categories.reduce((s, c) => s + c.items.length, 0))
const checkedCount = computed(() => Object.values(checked.value).filter(Boolean).length)
const progressPct  = computed(() => Math.round((checkedCount.value / totalItems.value) * 100))

const progressBarColor = computed(() => {
  if (progressPct.value === 100) return 'bg-green-500'
  if (progressPct.value >= 75)  return 'bg-blue-500'
  if (progressPct.value >= 50)  return 'bg-yellow-400'
  return 'bg-red-400'
})
const statusLabel = computed(() => {
  if (progressPct.value === 100) return { text: '全項目完了', cls: 'bg-green-100 text-green-700' }
  if (progressPct.value >= 75)   return { text: '確認中',     cls: 'bg-blue-100 text-blue-700' }
  if (progressPct.value >= 50)   return { text: '進行中',     cls: 'bg-yellow-100 text-yellow-700' }
  return                                { text: '未対応',     cls: 'bg-red-100 text-red-700' }
})

function categoryProgress(cat) {
  const done = cat.items.filter(i => checked.value[i.id]).length
  return { done, total: cat.items.length, pct: Math.round((done / cat.items.length) * 100) }
}


const iconPath = {
  shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  cog:    'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  map:    'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7',
  fire:   'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z',
}
const catColorMap = {
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-100',   icon: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700',    bar: 'bg-blue-500' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-100', icon: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700', bar: 'bg-orange-500' },
  green:  { bg: 'bg-green-50',  border: 'border-green-100',  icon: 'bg-green-500',  badge: 'bg-green-100 text-green-700',   bar: 'bg-green-500' },
  red:    { bg: 'bg-red-50',    border: 'border-red-100',    icon: 'bg-red-500',    badge: 'bg-red-100 text-red-700',       bar: 'bg-red-500' },
}
</script>

<template>
  <BaseNavbarHome />

  <div class="min-h-screen bg-gray-50 pb-16">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ButtonBackInspectionCounter />

      <div v-if="project" class="mt-6 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-mono text-gray-400">{{ project.code }}</span>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100">{{ project.type }}</span>
            </div>
            <h1 class="text-base font-bold text-gray-900 leading-snug">{{ project.name }}</h1>
            <p class="text-xs text-gray-500 mt-1">担当者: {{ project.contractor }} ・ {{ today }}</p>
            <p v-if="savedAt" class="text-xs text-green-600 mt-1">最終保存: {{ savedAt }}</p>
          </div>
        </div>
      </div>
      <div v-if="isLoading" class="mt-5 space-y-4 animate-pulse">
        <div class="bg-white rounded-2xl border border-gray-200 p-5 h-24"></div>
        <div class="bg-white rounded-2xl border border-gray-200 p-5 h-40"></div>
      </div>

      <template v-else>
        <div class="mt-5 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="text-sm font-semibold text-gray-700">全体進捗</p>
              <p class="text-xs text-gray-400">{{ checkedCount }} / {{ totalItems }} 項目完了</p>
            </div>
            <div class="flex items-center gap-2">
              <span :class="['text-xs font-semibold px-3 py-1 rounded-full', statusLabel.cls]">{{ statusLabel.text }}</span>
              <span class="text-2xl font-bold text-gray-800">{{ progressPct }}%</span>
            </div>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div :class="['h-3 rounded-full transition-all duration-500', progressBarColor]" :style="{ width: progressPct + '%' }"></div>
          </div>
        </div>

        <div v-for="cat in categories" :key="cat.id" class="mt-5">
          <div :class="['rounded-2xl border p-5 shadow-sm', catColorMap[cat.color].bg, catColorMap[cat.color].border]">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div :class="['w-9 h-9 rounded-xl flex items-center justify-center', catColorMap[cat.color].icon]">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath[cat.icon]" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-800">{{ cat.label }}</p>
                  <p class="text-xs text-gray-400">{{ categoryProgress(cat).done }} / {{ cat.items.length }} 完了</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span :class="['text-xs font-semibold px-2 py-0.5 rounded-full', catColorMap[cat.color].badge]">
                  {{ categoryProgress(cat).pct }}%
                </span>
              </div>
            </div>

            <div class="w-full bg-white/60 rounded-full h-1.5 mb-4 overflow-hidden">
              <div :class="['h-1.5 rounded-full transition-all duration-300', catColorMap[cat.color].bar]"
                   :style="{ width: categoryProgress(cat).pct + '%' }"></div>
            </div>

            <div class="space-y-2.5">
              <label
                  v-for="item in cat.items"
                  :key="item.id"
                  class="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-white/80 cursor-default transition-all"
              >
                <input type="checkbox" :checked="checked[item.id]" disabled
                       class="mt-0.5 w-4 h-4 rounded border-gray-300 shrink-0 cursor-pointer" />
                <span :class="['text-sm leading-snug transition-colors', checked[item.id] ? 'text-gray-400 line-through' : 'text-gray-700']">
                  {{ item.label }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
  <BaseFooterHome />
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-6px); }
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}
</style>
