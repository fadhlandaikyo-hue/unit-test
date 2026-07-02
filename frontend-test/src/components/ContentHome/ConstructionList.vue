<script setup>
import {ref, computed, shallowRef, onMounted, onActivated} from "vue"
import BaseNavbarHome from "../HomeComponents/NavbarHome.vue"
import BaseFooterHome from "../HomeComponents/FooterHome.vue"
import BaseButtonBack from "../Utilities/UtilitiesHome/ButtonBack.vue"
import { useProgressColor } from "./composables/useProgressColor.js"
import { useLocalStorage } from "./composables/useLocalStorage.js"
import { useRouter } from "vue-router"

const router = useRouter()
const { getOne, getProjectDate } = useLocalStorage()
const { progressColor, statusLabel, badgeColor } = useProgressColor()

const projectsRaw = [
  { id: 1, name: "美保(5)格納庫等新設舗装工事", code: "", defaultProgress: 75, completionDate: "2026年3月31日", type: "道路", img: "/construction_img/example/daikyo-logo.avif", badgeLabel: null, badgeClass: null, completed: false },
  { id: 2, name: "鍵掛峠道路日南地区改良工事", code: "", defaultProgress: 15, completionDate: "2026年3月31日", type: "道路", img: "/construction_img/日南/日南.webp", badgeLabel: null, badgeClass: null, completed: false },
  { id: 3, name: "奥陰田3地区急傾斜地崩壊 対策工事その2", code: "", defaultProgress: 30, completionDate: "2026年3月31日", type: "砂防", img: "/construction_img/奥陰/奥陰.webp", badgeLabel: null, badgeClass: null, completed: false },
  { id: 4, name: "中山3期営農飲雑用水 (高田工区)工事", code: "", defaultProgress: 100, completionDate: "2026年5月23日", type: "管路工", img: "/construction_img/example/daikyo-logo.avif", badgeLabel: null, badgeClass: null, completed: true },
  { id: 5, name: "車尾五丁目ほか枝線工事", code: "", defaultProgress: 100, completionDate: "2026年9月30日", type: "枝線", img: "/construction_img/example/daikyo-logo.avif", badgeLabel: null, badgeClass: null, completed: true },
  { id: 6, name: "県道西伯伯太線(宮ノ前歩道橋) 橋梁塗装工事(2工区)(補助)", code: "", defaultProgress: 100, completionDate: "2026年3月16日", type: "道橋", img: "/construction_img/宮ノ前/宮ノ前.webp", badgeLabel: null, badgeClass: null, completed: true },
  { id: 7, name: "外港中野地区承水路護岸補修工事 (老朽化対策) (3工区)", code: "", defaultProgress: 100, completionDate: "2026年9月18日", type: "老朽化対策", img: "/construction_img/example/daikyo-logo.avif", badgeLabel: null, badgeClass: null, completed: true },
  { id: 8, name: "船越地区急傾斜地崩壊対策工事 (2工区)(交付金)(国補正)", code: "", defaultProgress: 100, completionDate: "2026年10月21日", type: "崩壊対策", img: "/construction_img/example/daikyo-logo.avif", badgeLabel: null, badgeClass: null, completed: true },
  { id: 9, name: "県道大山寺岸本線(小林工区) 電線共同溝設置工事(2工区)(補助)", code: "", defaultProgress: 100, completionDate: "2026年10月30日", type: "共同溝設置", img: "/construction_img/小村/小村.avif", badgeLabel: null, badgeClass: null, completed: true },
  { id: 10, name: "佐陀川砂防堰堤(K1)工事(9工区) (補助)(国補正)", code: "", defaultProgress: 100, completionDate: "2026年12月25日", type: "砂防堰堤", img: "/construction_img/佐陀/佐陀.webp", badgeLabel: null, badgeClass: null, completed: true },
  { id: 11, name: "奥山川砂防堰堤工事(4工区) (交付金)(国補正)", code: "", defaultProgress: 100, completionDate: "2026年11月9日", type: "砂防堰堤", img: "/construction_img/奥山/奥山.webp", badgeLabel: null, badgeClass: null, completed: true },
  { id: 12, name: "鍵掛峠道路新屋地区 第13改良工事", code: "", defaultProgress: 100, completionDate: "2027年2月26日", type: "道路", img: "/construction_img/新屋/新屋.webp", badgeLabel: null, badgeClass: null, completed: true },
]

const drafts = ref(Object.fromEntries(projectsRaw.map(p => [p.id, p.defaultProgress])))
const saved  = shallowRef(Object.fromEntries(projectsRaw.map(p => [p.id, p.defaultProgress])))
const projectDates = ref({})

const projectsDisplay = computed(() =>
    projectsRaw.map(p => {
      const draft = drafts.value[p.id]
      return {
        ...p,
        completionDate: projectDates.value[p.id] ?? p.completionDate,
        draft,
        dirty:  draft !== saved.value[p.id],
        label:  statusLabel(draft),
        color:  progressColor(draft),
        bgColor: p.badgeLabel ? null : badgeColor(draft),
      }
    })
)

const ALL_FILTER = "全計画"
const filters = [ALL_FILTER, "計画", "進行中", "完成"]

function normalizeFilter(value) {
  if (value === "All" || value === ALL_FILTER) return ALL_FILTER
  if (filters.includes(value)) return value
  return ALL_FILTER
}

const activeFilter = ref(normalizeFilter(localStorage.getItem("construction_filter")))

const filteredProjects = computed(() => {
  if (activeFilter.value === ALL_FILTER) return projectsDisplay.value
  return projectsDisplay.value.filter(p => p.label === activeFilter.value)
})

function applyFilter(label) {
  const nextFilter = normalizeFilter(label)
  activeFilter.value = nextFilter
  localStorage.setItem("construction_filter", nextFilter)
}


function formatProgress(value) {
  const progress = Number(value)
  if (Number.isNaN(progress)) return "0.0"
  return progress.toFixed(1)
}

function goToDetail(id) {
  router.push(`/home/construction/${id}`)
}

async function loadProjectState() {
  const progressEntries = await Promise.all(
      projectsRaw.map(async (p) => [p.id, await getOne(p.id, p.defaultProgress)])
  )
  const dateEntries = await Promise.all(
      projectsRaw.map(async (p) => {
        const persistedDate = await getProjectDate(p.id)
        return [
          p.id,
          persistedDate?.startDate && persistedDate?.endDate
              ? `${persistedDate.startDate} - ${persistedDate.endDate}`
              : null,
        ]
      })
  )

  const hydrated = Object.fromEntries(progressEntries)
  drafts.value = hydrated
  saved.value = hydrated
  projectDates.value = Object.fromEntries(dateEntries.filter(([, value]) => value))
}

onMounted(loadProjectState)
onActivated(loadProjectState)
</script>

<template>
  <BaseNavbarHome/>

  <div class="bg-white border-gray-200 py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <BaseButtonBack/>
      <div class="text-center max-w-2xl mx-auto mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">建設と計画</h1>
        <p class="mt-3 text-lg text-gray-500">インフラ整備の進捗管理と将来計画の可視化</p>
      </div>
      <div class="flex justify-center flex-wrap gap-2">
        <span
            v-for="f in filters" :key="f"
            @click="applyFilter(f)"
            class="px-4 py-2 rounded-full text-sm font-semibold cursor-pointer border transition-colors duration-150"
            :class="activeFilter === f
            ? 'bg-blue-100 text-blue-800 border-blue-200'
            : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'"
        >{{ f }}</span>
      </div>
    </div>
  </div>

  <div class="flex-grow px-4 sm:px-6 lg:px-8 pb-12">
    <div class="max-w-7xl mx-auto">

      <div v-if="filteredProjects.length === 0" class="text-center py-20 text-gray-400">
        <p class="text-lg"></p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        <article
            v-for="p in filteredProjects"
            :key="p.id"
            v-memo="[p.draft, p.dirty, p.label]"
            class="card-item flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
            :class="{ 'opacity-90': p.completed }"
        >

          <div class="img-wrap relative h-56 w-full cursor-pointer overflow-hidden" @click="goToDetail(p.id)">
            <img
                class="img-el h-full w-full object-cover"
                :src="p.img"
                :alt="p.name"
                width="1280"
                height="720"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                @error="e => e.target.style.display='none'"
            />

            <div class="img-overlay absolute inset-0 bg-black flex items-center justify-center">

            </div>
          </div>

          <!-- Card body -->
          <div class="p-6 flex-1 flex flex-col">
            <div class="flex items-start mb-2 cursor-pointer hover:text-blue-600 transition-colors duration-150" @click="goToDetail(p.id)">
              <svg class="w-4 h-7 mr-1 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <h3 class="text-xl font-bold text-gray-900 leading-tight">{{ p.name }}</h3>
            </div>
            <p class="text-sm text-gray-500 mb-4">{{ p.code }}</p>
            <div class="mt-auto">
              <div class="flex justify-between text-sm font-medium text-gray-600 mb-1">
                <span>{{ p.label }}</span>
                <span :style="{ color: p.color }">{{ formatProgress(p.draft) }}%</span>
              </div>
              <button @click="goToDetail(p.id)" class="mt-4 w-full py-2 rounded-lg text-sm font-semibold  border border-blue-200 hover:bg-blue-50 transition-colors duration-150">詳細</button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>

  <BaseFooterHome/>
</template>

<style scoped>

.card-item {
  will-change: transform;
  transform: translateZ(0);
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.card-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px -8px rgba(0, 0, 0, 0.15);
}


.img-wrap {
  overflow: hidden;
}
.img-el {
  will-change: transform;
  transform: scale(1) translateZ(0);
  transition: transform 400ms ease;
}
.card-item:hover .img-el {
  transform: scale(1.04) translateZ(0);
}

.img-overlay {
  will-change: opacity;
  background-color: rgba(0, 0, 0, 0.55);
  opacity: 1;
  transition: opacity 350ms ease;
}
.card-item:hover .img-overlay {
  opacity: 0;
}

</style>



