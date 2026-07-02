<script setup>
import {ref, computed, onMounted} from "vue"
import { useRoute } from "vue-router"
import BaseNavbarHome from "../HomeComponents/NavbarHome.vue"
import BaseFooterHome from "../HomeComponents/FooterHome.vue"
import BaseButtonBack from "../Utilities/UtilitiesHome/ButtonBack.vue"
import BaseButtonBackConstruction from "../Utilities/UtilitiesHome/ButtonBackConstruction.vue"
import { useProgressColor } from "./composables/useProgressColor.js"
import { useLocalStorage } from "./composables/useLocalStorage.js"
import "./constructiondetail.css"
import ProgressBarDetail from "../HomeComponents/ProgressBarDetail.vue";

const route = useRoute()
const { getOne, getProjectDate } = useLocalStorage()
const { progressColor, statusLabel, badgeColor } = useProgressColor()

const projectsRaw = [
  {
    id: 1,
    name: "美保(5)格納庫等新設舗装工事",
    code: "20250009",
    completionDate: "2023-11-08 - 2026-03-01",
    type: "道路",
    images: [{ src: "", takenAt: "2026-03-01" }],
    badgeLabel: null,
    badgeClass: null,
    completed: false,
    description: `-`,
    location: "鳥取県境港市中野町",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d10545.623166593052!2d133.24345820832121!3d35.52724178600848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzXCsDMxJzQ4LjAiTiAxMzPCsDE0JzM4LjAiRQ!5e1!3m2!1sid!2sjp!4v1777267970740!5m2!1sid!2sjp",
    contractor: "小島",
  },
  {
    id: 2,
    name: "鍵掛峠道路日南地区改良工事",
    code: "20260002",
    completionDate: "2024-05-01 - 2026-03-01",
    type: "道路",
    images: [
      { src: "/construction_img/日南/2024-08-28.webp", takenAt: "2024-08-28" },
      { src: "/construction_img/日南/2024-09-26.webp", takenAt: "2024-09-26" },
      { src: "/construction_img/日南/2024-10-23.webp", takenAt: "2024-10-23" },
      { src: "/construction_img/日南/2024-11-20.webp", takenAt: "2024-11-20" },
      { src: "/construction_img/日南/2024-12-17.webp", takenAt: "2024-12-17" },
      { src: "/construction_img/日南/2025-03-26.webp", takenAt: "2025-03-26" },
      { src: "/construction_img/日南/2025-04-25.webp", takenAt: "2025-04-25" },
      { src: "/construction_img/日南/2025-05-23.webp", takenAt: "2025-05-23" },
      { src: "/construction_img/日南/2025-06-30.webp", takenAt: "2025-06-30" },
      { src: "/construction_img/日南/2025-07-17.webp", takenAt: "2025-07-17" },
      { src: "/construction_img/日南/2025-08-19.webp", takenAt: "2025-08-19" },
      { src: "/construction_img/日南/2025-09-19.webp", takenAt: "2025-09-19" },
      { src: "/construction_img/日南/2025-10-17.webp", takenAt: "2025-10-17" },
      { src: "/construction_img/日南/2025-11-20.webp", takenAt: "2025-11-20" },
      { src: "/construction_img/日南/2025-12-23.webp", takenAt: "2025-12-23" },
      { src: "/construction_img/日南/2026-03-23.webp", takenAt: "2026-03-23" },
    ],
    badgeLabel: null,
    badgeClass: null,
    completed: false,
    description: `-`,
    location: "-",
    contractor: "池岡、内田",
  },
  {
    id: 3,
    name: "奥陰田3地区急傾斜地崩壊 対策工事その2",
    code: "20250008",
    completionDate: "2025-07-15 - 2026-03-01",
    type: "砂防",
    images: [
      { src: "/construction_img/奥陰/2025-09-09.webp", takenAt: "2025-09-09" },
      { src: "/construction_img/奥陰/2025-09-22.webp", takenAt: "2025-09-22" },
      { src: "/construction_img/奥陰/2025-10-22.webp", takenAt: "2025-10-22" },
      { src: "/construction_img/奥陰/2025-11-20.webp", takenAt: "2025-11-20" },
      { src: "/construction_img/奥陰/2025-12-18.webp", takenAt: "2025-12-18" },
      { src: "/construction_img/奥陰/2026-01-19.webp", takenAt: "2026-01-19" },
      { src: "/construction_img/奥陰/2026-02-26.webp", takenAt: "2026-02-26" },
      { src: "/construction_img/奥陰/2026-03-26.webp", takenAt: "2026-03-26" },
    ],
    badgeLabel: null,
    badgeClass: null,
    completed: false,
    description: `施工延長L=43.7m
    砂防土工一式
    法面工一式
    仮設工一式`,
    location: "-",
    contractor: "長谷川、岩田ひ",
  },
  {
    id: 4,
    name: "中山3期営農飲雑用水 (高田工区)工事",
    code: "20250006",
    completionDate: "2025-09-09 - 2026-05-09",
    type: "管路工",
    images: [{ src: "", takenAt: "2026-05-09" }],
    badgeLabel: null,
    badgeClass: null,
    completed: true,
    description: `管路工
    本線L=975.4m→962.7m
    A路線L=579.0m→578.7m
    B路線L=118.1m`,
    location: "-",
    contractor: "岩田こ",
  },
  {
    id: 5,
    name: "車尾五丁目ほか枝線工事",
    code: "20260006",
    completionDate: "2025-09-09 - 2026-09-30",
    type: "枝線",
    images: [{ src: "", takenAt: "2026-09-30" }],
    badgeLabel: null,
    badgeClass: null,
    completed: true,
    description: `-`,
    location: "-",
    contractor: "西中",
  },
  {
    id: 6,
    name: "県道西伯伯太線(宮ノ前歩道橋) 橋梁塗装工事(2工区)(補助)",
    code: "20240009",
    completionDate: "2025-10-09 - 2026-03-06",
    type: "道橋",
    images: [
      { src: "/construction_img/宮ノ前/2025-11-21.webp", takenAt: "2026-11-26" },
      { src: "/construction_img/宮ノ前/2025-12-15.webp", takenAt: "2026-12-26" },
      { src: "/construction_img/宮ノ前/2026-03-11(1).webp", takenAt: "2026-03-11" },
      { src: "/construction_img/宮ノ前/2026-03-11(2).webp", takenAt: "2026-03-11" },
    ],
    badgeLabel: null,
    badgeClass: null,
    completed: true,
    description: `宮ノ前歩道橋(2工区)
    橋長L=48.5m幅員W=2.9m
    施工延長L=16.2m
    橋梁塗替塗装工A=136m2
    孔食補修工一式
    仮設工一式`,
    location: "-",
    contractor: "今中",
  },
  {
    id: 7,
    name: "外港中野地区承水路護岸補修工事 (老朽化対策) (3工区)",
    code: "20240006",
    completionDate: "2026-02-20 - 2026-09-28",
    type: "老朽化対策",
    images: [{ src: "", takenAt: "2026-02-20" }],
    badgeLabel: null,
    badgeClass: null,
    completed: true,
    description: `河川土工
    掘削工V=60m3
    法覆護岸工
    マットレス工L=157m
    大型ブロック積A=264m2
    張りコンクリートA=468m2
    排水構造物工
    プレキャストL型水路L=103m
    構造物撤去工
    コンクリート構造物取壊しV=108m3
    殼運搬V=108m3`,
    location: "-",
    contractor: "篠原",
  },
  {
    id: 8,
    name: "船越地区急傾斜地崩壊対策工事 (2工区)(交付金)(国補正)",
    code: "20250005",
    completionDate: "2026-02-27 - 2026-10-01",
    type: "崩壊対策",
    images: [{ src: "", takenAt: "2026-03-01" }],
    badgeLabel: null,
    badgeClass: null,
    completed: true,
    description: `法面工
    簡易吹付法枠工(M-1500) A=508m2
    吹付法枠工(300×300) A = 4 471m2
    ノンフレーム工法 A = 3 318m2
    擁壁補強工
    鉄筋挿入工 ( L = 5 5.0m) N = 34本
    鉄筋挿入工 L = 4 ) N = 27本
    仮設工
    撤去 N = 1 式`,
    location: "-",
    contractor: "坪倉",
  },
  {
    id: 9,
    name: "県道大山寺岸本線(小林工区) 電線共同溝設置工事(2工区)(補助)",
    code: "20250005",
    completionDate: "2026-03-10 - 2026-10-10",
    type: "共同溝設置",
    images: [{ src: "", takenAt: "2026-03-10" }],
    badgeLabel: null,
    badgeClass: null,
    completed: true,
    description: `施工延長L=181.3m
    仮設工
    仮設舗装A=364m2
    舗装版撤去工一式
    開削土工一式
    電線共同溝
    管路L=176.8m
    S型マンホールN=1基
    通信接続桝N=1基`,
    location: "-",
    contractor: "西本",
  },
  {
    id: 10,
    name: "佐陀川砂防堰堤(K1)工事(9工区) (補助)(国補正) (2工区)(交付金)(国補正)",
    code: "20250005",
    completionDate: "2026-03-01 - 2026-12-15",
    type: "砂防堰堤",
    images: [
      { src: "/construction_img/佐陀/2026-03-11.webp", takenAt: "2026-03-11" },
    ],
    badgeLabel: null,
    badgeClass: null,
    completed: true,
    description: `銅製砂防堰堤(K1)N=1基(H=12.0m、L=142m)
    砂防土工一式
    鋼製スリットW=55.2t
    垂直壁工V=113m3
    水叩工V=353m3
    護床工N=72個
    仮設工N=一式`,
    location: "-",
    contractor: "菊川",
  },
  {
    id: 11,
    name: "奥山川砂防堰堤工事(4工区) (交付金)(国補正)",
    code: "20250005",
    completionDate: "2026-03-16 - 2026-11-08",
    type: "砂防堰堤",
    images: [
      { src: "/construction_img/奥山/2026-03-16.webp", takenAt: "2026-03-16" },
    ],
    badgeLabel: null,
    badgeClass: null,
    completed: true,
    description: `砂防土工
    埋戻し工V=1,790m3
    コンクリート堰堤工V=989m3`,
    location: "-",
    contractor: "内田",
  },
  {
    id: 12,
    name: "鍵掛峠道路新屋地区 第13改良工事",
    code: "20250005",
    completionDate: "2026-02-06 - 2027-05-08",
    type: "道路",
    images: [
      { src: "/construction_img/新屋/2026-04-08(1).webp", takenAt: "2026-04-08" },
      { src: "/construction_img/新屋/2026-04-08(2).webp", takenAt: "2026-04-08" },
    ],
    badgeLabel: null,
    badgeClass: null,
    completed: true,
    description: `工事延長 L = 1,240m
    道路土工1式(掘削V=15,410m3、盛土 V = 15,190m3)
    法面工1式(植生工 A = 1 1,620m2、法枠工 A = 1,673m2)
    擁壁工1式重力式擁壁1式
    補強盛土工ジオテキスタイル補強土壁1式
    コンクリートブロック積工A=92m2
    排水構造物工1式
    舗装工1式下層路盤(C-40 t = 1 ) A = 3 3,800m2
    仮設工1式`,
    location: "-",
    contractor: "池岡",
  },
]

const projectId = Number(route.params.id)
const raw = projectsRaw.find((p) => p.id === projectId)
const defaultProgress = raw?.defaultProgress ?? 0
const project = ref(raw ? { ...raw, draft: defaultProgress, saved: defaultProgress } : null)

const mapEmbedUrl = computed(() => {
  if (project.value?.mapEmbedUrl) {
    return project.value.mapEmbedUrl
  }

  if (project.value?.location && project.value.location !== "-") {
    return `https://www.google.com/maps?q=${encodeURIComponent(project.value.location)}&output=embed`
  }

  return ""
})

const mapLocationLabel = computed(() => {
  if (project.value?.location && project.value.location !== "-") {
    return project.value.location
  }

  return "施工場所未登録"
})

const projectImages = computed(() => {
  if (!project.value) return []
  if (project.value.images?.length) {
    return project.value.images.map((img) =>
        typeof img === "string" ? { src: img, takenAt: null } : img,
    )
  }
  if (project.value.img) {
    return [{ src: project.value.img, takenAt: null }]
  }
  return [{ src: "/building.svg", takenAt: null }]
})

function parseISODate(str) {
  if (!str) return ""
  const candidate = str.trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(candidate) ? candidate : ""
}

function formatDisplayDate(value) {
  if (!value) return "-"
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

function splitCompletionDate(value) {
  const normalized = (value || "").replace(/[–—]/g, "-")
  const parts = normalized.split(/\s+-\s+/)
  return {
    start: parts[0]?.trim() ?? "",
    end: parts[1]?.trim() ?? "",
  }
}

function displayDateRange(value) {
  const { start, end } = splitCompletionDate(value)
  if (!start && !end) return "-"
  return `${formatDisplayDate(start)} - ${formatDisplayDate(end)}`
}

const showDateModal = ref(false)
const draftStartDate = ref("")
const draftEndDate = ref("")

function openDateModal() {
  const { start, end } = splitCompletionDate(project.value.completionDate)
  draftStartDate.value = parseISODate(start)
  draftEndDate.value = parseISODate(end)
  showDateModal.value = true
}

function formatProgress(value) {
  const progress = Number(value)
  if (Number.isNaN(progress)) return "0.0"
  return progress.toFixed(1)
}

onMounted(async () => {
  if (!project.value) {
    return
  }

  const persisted = await getOne(project.value.id, defaultProgress)
  project.value.draft = persisted
  project.value.saved = persisted

  const persistedDate = await getProjectDate(project.value.id)
  if (persistedDate?.startDate && persistedDate?.endDate) {
    project.value.completionDate = `${persistedDate.startDate} - ${persistedDate.endDate}`
  }
})
</script>

<template>
  <BaseNavbarHome />

  <div v-if="!project" class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <p class="text-2xl font-bold text-gray-700 mb-4">Project not found</p>
      <BaseButtonBack />
    </div>
  </div>

  <div v-else class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BaseButtonBackConstruction />

      <div class="flex snap-x snap-mandatory overflow-x-auto gap-4 px-8 mt-4 pb-2">
        <div
            v-for="(img, idx) in projectImages"
            :key="idx"
            class="snap-center shrink-0 w-72 sm:w-80 relative"
        >
          <img
              :src="img.src"
              :alt="`${project.name} - ${idx + 1}`"
              class="w-full h-48 object-cover rounded-xl"
              @error="(e) => (e.target.style.display = 'none')"
              loading="lazy"
          />
          <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
            <span class="text-xs font-bold text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
              {{ idx + 1 }} / {{ projectImages.length }}
            </span>
            <span
                v-if="img.takenAt"
                class="flex items-center gap-1 text-xs font-semibold text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full"
            >
              <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {{ formatDisplayDate(img.takenAt) }}
            </span>
          </div>
        </div>
      </div>

      <div class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-bold text-gray-800 mb-3">工事概要</h2>
            <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ project.description }}</p>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 class="text-lg font-bold text-gray-800 mb-4">基本情報</h2>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <p class="text-xs text-gray-400 uppercase font-semibold mb-1">工事種別</p>
                <p class="text-sm font-medium text-gray-800">{{ project.type }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase font-semibold mb-1">
                  {{ project.completed ? "完成日" : "完成予定日" }}
                </p>
                <button
                    class="text-sm font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors text-left"
                    @click="openDateModal"
                >
                  {{ displayDateRange(project.completionDate) }}
                </button>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase font-semibold mb-1">施工場所</p>
                <p class="text-sm font-medium text-gray-800">{{ mapLocationLabel }}</p>
                <div v-if="mapEmbedUrl" class="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                  <iframe
                      :src="mapEmbedUrl"
                      title="施工場所 Google Maps"
                      class="h-40 w-full"
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase font-semibold mb-1">担当者</p>
                <p class="text-sm font-medium text-gray-800">{{ project.contractor }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div
              class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-colors duration-300"
              :style="{ borderTopColor: badgeColor(project.draft), borderTopWidth: '4px' }"
          >
            <h2 class="text-lg font-bold text-gray-800 mb-4">進捗状況</h2>

            <div class="flex justify-between text-sm font-medium text-gray-600 mb-1">
              <span class="flex items-center gap-1.5">
                {{ statusLabel(project.draft) }}
              </span>
              <span :style="{ color: progressColor(project.draft) }">{{ formatProgress(project.draft) }}%</span>
            </div>

            <ProgressBarDetail v-model="project.draft" class="mb-4" />
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <h3 class="text-sm font-bold text-gray-700 mb-3">状況</h3>
            <div class="space-y-2 text-xs">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
                <span class="text-gray-600">計画 (0-24%)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
                <span class="text-gray-600">進行中 (25-99%)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                <span class="text-gray-600">完成 (100%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <BaseFooterHome />
</template>
