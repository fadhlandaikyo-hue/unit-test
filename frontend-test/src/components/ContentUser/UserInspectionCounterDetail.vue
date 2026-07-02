<script setup>
import { ref, computed, onMounted } from "vue"
import { useRoute } from "vue-router"
import UserButtonBackInspectionCounter from "../Utilities/UtilitiesUsers/UserButtonBackInspectionCounter.vue";

const route     = useRoute()
const projectId = Number(route.params.id)
const apiUrl    = import.meta.env.VITE_API_PATH || "/api"

const CORRECT_PASSWORD = "191101"

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
const saveSuccess = ref(false)
const savedAt     = ref(null)

const showModal     = ref(false)
const passwordInput = ref('')
const passwordError = ref('')
const showPassword  = ref(false)
const isShaking     = ref(false)
const isSaving      = ref(false)

const showResetModal      = ref(false)
const resetPasswordInput  = ref('')
const resetPasswordError  = ref('')
const showResetPassword   = ref(false)
const isResetShaking      = ref(false)

const localKey = `inspection_counter_${projectId}`
const today    = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })

async function loadFromApi() {
  const res  = await fetch(`${apiUrl}/projects/${projectId}/checklist`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  return json.data
}

async function saveToApi(payload) {
  const res = await fetch(`${apiUrl}/projects/${projectId}/checklist`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
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

function openPasswordModal() {
  passwordInput.value = ''
  passwordError.value = ''
  showPassword.value  = false
  showModal.value     = true
  setTimeout(() => { document.getElementById('ic-pw-input')?.focus() }, 100)
}

function closeModal() {
  showModal.value     = false
  passwordInput.value = ''
  passwordError.value = ''
}

function onModalKeydown(e) {
  if (e.key === 'Enter') confirmSave()
  if (e.key === 'Escape') closeModal()
}

async function confirmSave() {
  if (passwordInput.value !== CORRECT_PASSWORD) {
    passwordError.value = 'パスワードが間違っています'
    isShaking.value     = true
    setTimeout(() => { isShaking.value = false }, 500)
    passwordInput.value = ''
    document.getElementById('ic-pw-input')?.focus()
    return
  }

  isSaving.value = true
  passwordError.value = ''

  const payload = { checked: checked.value, inspector: inspector.value }

  localStorage.setItem(localKey, JSON.stringify({ ...payload, savedAt: new Date().toISOString() }))

  try {
    await saveToApi(payload)
    savedAt.value = new Date().toLocaleString('ja-JP')
    showModal.value     = false
    passwordInput.value = ''
    saveSuccess.value   = true
    setTimeout(() => { saveSuccess.value = false }, 2500)
  } catch {
    passwordError.value = 'データの保存に失敗しました'
  } finally {
    isSaving.value = false
  }
}

function openResetModal() {
  resetPasswordInput.value  = ''
  resetPasswordError.value  = ''
  showResetPassword.value   = false
  showResetModal.value      = true
  setTimeout(() => { document.getElementById('ic-reset-pw-input')?.focus() }, 100)
}

function closeResetModal() {
  showResetModal.value     = false
  resetPasswordInput.value = ''
  resetPasswordError.value = ''
}

function onResetModalKeydown(e) {
  if (e.key === 'Enter') confirmReset()
  if (e.key === 'Escape') closeResetModal()
}

function confirmReset() {
  if (resetPasswordInput.value !== CORRECT_PASSWORD) {
    resetPasswordError.value = 'パスワードが間違っています'
    isResetShaking.value     = true
    setTimeout(() => { isResetShaking.value = false }, 500)
    resetPasswordInput.value = ''
    document.getElementById('ic-reset-pw-input')?.focus()
    return
  }

  checked.value   = {}
  inspector.value = ''
  savedAt.value   = null
  localStorage.removeItem(localKey)
  showResetModal.value = false
}

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
function toggleAll(cat) {
  const allDone = categoryProgress(cat).done === cat.items.length
  cat.items.forEach(i => { checked.value[i.id] = !allDone })
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
  <div class="min-h-screen bg-gray-50 pb-16">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <UserButtonBackInspectionCounter/>

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

        <div class="mt-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <label class="block text-xs font-semibold text-gray-600 mb-1.5">点検者名</label>
          <input
              v-model="inspector"
              type="text"
              placeholder="氏名を入力してください"
              class="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
          />
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
                <button
                    @click="toggleAll(cat)"
                    class="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 bg-white px-2.5 py-1 rounded-lg transition"
                >
                  {{ categoryProgress(cat).done === cat.items.length ? '全解除' : '全選択' }}
                </button>
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
                  class="flex items-start gap-3 bg-white rounded-xl px-4 py-3 border border-white/80 cursor-pointer hover:shadow-sm transition-all"
              >
                <input type="checkbox" v-model="checked[item.id]"
                       class="mt-0.5 w-4 h-4 rounded border-gray-300 shrink-0 cursor-pointer" />
                <span :class="['text-sm leading-snug transition-colors', checked[item.id] ? 'text-gray-400 line-through' : 'text-gray-700']">
                  {{ item.label }}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <button
              @click="openResetModal"
              class="flex-none px-5 py-3 rounded-xl text-sm font-semibold border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition"
          >
            リセット
          </button>
          <button
              @click="openPasswordModal"
              class="flex-1 py-3 rounded-xl text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 transition shadow-sm flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            保存
          </button>
        </div>

        <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-2"
                    leave-active-class="transition duration-200 ease-in" leave-to-class="opacity-0">
          <div v-if="saveSuccess"
               class="mt-4 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-xl flex items-center gap-2">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            保存しました
          </div>
        </Transition>
      </template>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="modal">
      <div
          v-if="showModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @keydown="onModalKeydown"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeModal" />

        <div
            class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            :class="{ shake: isShaking }"
        >
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900">認証が必要です</h3>
              <p class="text-xs text-gray-500">保存するにはパスワードを入力してください</p>
            </div>
          </div>

          <div class="bg-gray-50 rounded-xl px-4 py-3 mb-5 text-sm">
            <p class="text-gray-500 text-xs mb-1">保存内容</p>
            <p class="font-semibold text-gray-800">{{ project?.name }}</p>
            <p class="text-gray-500 text-xs mt-0.5">
              進行中:
              <span class="font-semibold text-gray-700">{{ checkedCount }} / {{ totalItems }} 項目</span>
              ({{ progressPct }}% ・ {{ statusLabel.text }})
            </p>
            <p v-if="inspector" class="text-gray-500 text-xs mt-0.5">
              点検者: <span class="font-semibold text-gray-700">{{ inspector }}</span>
            </p>
          </div>

          <label class="block text-xs font-semibold text-gray-600 mb-1.5">パスワード</label>
          <div class="relative">
            <input
                id="ic-pw-input"
                v-model="passwordInput"
                :type="showPassword ? 'text' : 'password'"
                placeholder="パスワードを入力..."
                class="w-full rounded-xl border px-4 py-2.5 text-sm pr-10 outline-none transition-colors duration-150"
                :class="passwordError
                  ? 'border-red-400 bg-red-50 focus:border-red-500'
                  : 'border-gray-300 bg-white focus:border-blue-500'"
                @keydown.enter="confirmSave"
            />
            <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabindex="-1"
            >
              <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>

          <Transition name="fade">
            <p v-if="passwordError" class="mt-2 text-xs text-red-600 flex items-center gap-1">
              <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd" />
              </svg>
              {{ passwordError }}
            </p>
          </Transition>

          <div class="flex gap-2 mt-5">
            <button
                @click="closeModal"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-150"
            >
              キャンセル
            </button>
            <button
                @click="confirmSave"
                :disabled="isSaving"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-150 disabled:opacity-60"
            >
              {{ isSaving ? '保存中...' : '確認して保存' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <Teleport to="body">
    <Transition name="modal">
      <div
          v-if="showResetModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @keydown="onResetModalKeydown"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeResetModal" />

        <div
            class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            :class="{ shake: isResetShaking }"
        >
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900">リセットの確認</h3>
              <p class="text-xs text-gray-500">パスワードを入力してリセットを実行してください</p>
            </div>
          </div>

          <div class="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">
            <p class="text-xs font-semibold text-red-700 mb-1">⚠ 注意</p>
            <p class="text-xs text-red-600">{{ project?.name }}</p>
            <p class="text-xs text-red-500 mt-1">
              現在のチェック状態（{{ checkedCount }} / {{ totalItems }} 項目）がすべてクリアされます。この操作は元に戻せません。
            </p>
          </div>

          <label class="block text-xs font-semibold text-gray-600 mb-1.5">パスワード</label>
          <div class="relative">
            <input
                id="ic-reset-pw-input"
                v-model="resetPasswordInput"
                :type="showResetPassword ? 'text' : 'password'"
                placeholder="パスワードを入力..."
                class="w-full rounded-xl border px-4 py-2.5 text-sm pr-10 outline-none transition-colors duration-150"
                :class="resetPasswordError
                  ? 'border-red-400 bg-red-50 focus:border-red-500'
                  : 'border-gray-300 bg-white focus:border-red-400'"
                @keydown.enter="confirmReset"
            />
            <button
                type="button"
                @click="showResetPassword = !showResetPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabindex="-1"
            >
              <svg v-if="!showResetPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>

          <Transition name="fade">
            <p v-if="resetPasswordError" class="mt-2 text-xs text-red-600 flex items-center gap-1">
              <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd" />
              </svg>
              {{ resetPasswordError }}
            </p>
          </Transition>
          <div class="flex gap-2 mt-5">
            <button
                @click="closeResetModal"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-150"
            >
              キャンセル
            </button>
            <button
                @click="confirmReset"
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors duration-150"
            >
              リセットする
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-6px); }
  40%       { transform: translateX(6px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(4px); }
}
.shake { animation: shake 0.4s ease; }
</style>
