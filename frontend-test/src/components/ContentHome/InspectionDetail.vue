<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import BaseNavbarHome from "../HomeComponents/NavbarHome.vue";
import BaseFooterHome from "../HomeComponents/FooterHome.vue";
import BaseButtonBack from "../Utilities/UtilitiesHome/ButtonBack.vue";
import BaseButtonBackInspection from "../Utilities/UtilitiesHome/ButtonBackInspection.vue";

const route = useRoute();
const projectId = Number(route.params.id);
const apiBaseUrl = import.meta.env.VITE_API_PATH || "/api";

const constructions = [
  { id: 1,  code: "", name: "美保(5)格納庫等新設舗装工事",                                           type: "道路",       contractor: "小島" },
  { id: 2,  code: "", name: "美保(5)格納庫等新設舗装工事",                                           type: "道路",       contractor: "池岡、内田" },
  { id: 3,  code: "", name: "奥陰田3地区急傾斜地崩壊 対策工事その2",                                 type: "砂防",       contractor: "長谷川、岩田ひ" },
  { id: 4,  code: "", name: "中山3期営農飲雑用水 (高田工区)工事",                                    type: "管路工",     contractor: "岩田こ" },
  { id: 5,  code: "", name: "車尾五丁目ほか枝線工事",                                                type: "枝線",       contractor: "西中" },
  { id: 6,  code: "", name: "県道西伯伯太線(宮ノ前歩道橋) 橋梁塗装工事(2工区)(補助)",               type: "道橋",       contractor: "今中" },
  { id: 7,  code: "", name: "外港中野地区承水路護岸補修工事 (老朽化対策) (3工区)",                   type: "老朽化対策", contractor: "篠原" },
  { id: 8,  code: "", name: "船越地区急傾斜地崩壊対策工事 (2工区)(交付金)(国補正)",                  type: "崩壊対策",   contractor: "坪倉" },
  { id: 9,  code: "", name: "県道大山寺岸本線(小林工区) 電線共同溝設置工事(2工区)(補助)",            type: "共同溝設置", contractor: "西本" },
  { id: 10, code: "", name: "佐陀川砂防堰堤(K1)工事(9工区) (補助)(国補正)",                          type: "砂防堰堤",   contractor: "菊川" },
  { id: 11, code: "", name: "奥山川砂防堰堤工事(4工区) (交付金)(国補正)",                            type: "砂防堰堤",   contractor: "内田" },
  { id: 12, code: "", name: "鍵掛峠道路新屋地区 第13改良工事",                                       type: "道路",       contractor: "池岡" },
];

const project = constructions.find((c) => c.id === projectId);

const typeBadge = {
  Civil: "bg-green-100 text-green-700",
  Road:  "bg-blue-100 text-blue-700",
  Slope: "bg-cyan-100 text-cyan-700",
  River: "bg-amber-100 text-amber-700",
};

const sectionMeta = {
  chukan: {
    label:              "中間検査",
    buttonClass:        "bg-blue-600 hover:bg-blue-700",
    badgeClass:         "text-blue-700 bg-blue-50 border-blue-200",
    panelClass:         "bg-blue-50 border-blue-200",
    focusClass:         "focus:border-blue-400",
    postBadgeClass:     "bg-blue-50 text-blue-600 border-blue-100",
    commentHoverClass:  "hover:text-blue-600",
  },
  kansei: {
    label:              "完成検査",
    buttonClass:        "bg-emerald-600 hover:bg-emerald-700",
    badgeClass:         "text-emerald-700 bg-emerald-50 border-emerald-200",
    panelClass:         "bg-emerald-50 border-emerald-200",
    focusClass:         "focus:border-emerald-400",
    postBadgeClass:     "bg-emerald-50 text-emerald-600 border-emerald-100",
    commentHoverClass:  "hover:text-emerald-600",
  },
};

const sectionOrder = ["chukan", "kansei"];

const posts          = ref({ kansei: [], chukan: [] });
const isLoadingPosts = ref(false);
const loadPostsError = ref("");

async function requestApi(path, { method = "GET", body } = {}) {
  const token   = localStorage.getItem("token") || "";
  const headers = { Accept: "application/json" };

  const isPublicPostApi = path.startsWith("/inspection-posts");
  if (token && !isPublicPostApi) headers.Authorization = token;
  if (body) headers["Content-Type"] = "application/json";

  const res = await fetch(`${apiBaseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson      = contentType.includes("application/json");
  const raw         = await res.text();

  let json = null;
  if (raw && isJson) {
    try { json = JSON.parse(raw); }
    catch { throw new Error(`Response API bukan JSON valid: ${apiBaseUrl}${path}`); }
  }

  if (!res.ok) throw new Error(json?.errors || `Request gagal (${res.status})`);

  if (!isJson || !json || typeof json !== "object")
    throw new Error(`Format response API tidak valid: ${apiBaseUrl}${path}`);

  return json;
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric", month: "long", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  }).format(date);
}

function mapComment(c) {
  return { id: c.id, author: c.author, date: formatDate(c.created_at), text: c.text };
}

function mapPost(p) {
  return {
    id: p.id, author: p.author, date: formatDate(p.created_at), text: p.text,
    comments: (p.comments || []).map(mapComment),
  };
}

function applyPostsFromApi(postList) {
  const grouped = { kansei: [], chukan: [] };
  for (const p of postList || []) {
    if (grouped[p.section]) grouped[p.section].push(mapPost(p));
  }
  posts.value = grouped;
}

async function loadPosts() {
  if (!projectId || Number.isNaN(projectId)) {
    posts.value = { kansei: [], chukan: [] };
    return;
  }
  isLoadingPosts.value = true;
  loadPostsError.value = "";
  try {
    const result = await requestApi(`/inspection-posts?project_id=${projectId}`);
    if (!Array.isArray(result.data)) throw new Error("Format data post tidak valid dari API");
    applyPostsFromApi(result.data);
  } catch (error) {
    posts.value          = { kansei: [], chukan: [] };
    loadPostsError.value = error.message || "投稿データの取得に失敗しました";
  } finally {
    isLoadingPosts.value = false;
  }
}

function initials(name) { return (name || "A").slice(0, 1).toUpperCase(); }
const avatarColors = ["bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-teal-500", "bg-rose-500", "bg-amber-500"];
function avatarColor(name) {
  let hash = 0;
  for (const char of name || "A") hash = (hash * 31 + char.charCodeAt(0)) % avatarColors.length;
  return avatarColors[hash];
}

onMounted(loadPosts);
</script>

<template>
  <BaseNavbarHome />

  <div v-if="!project" class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <p class="text-xl font-bold text-gray-600 mb-4">工事が見つかりません</p>
      <BaseButtonBack />
    </div>
  </div>

  <div v-else class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <BaseButtonBackInspection />

      <div class="mt-6 mb-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-5">
        <div class="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="text-xs font-mono text-gray-400">{{ project.code }}</span>
            <span :class="['text-xs font-semibold px-2 py-0.5 rounded-full', typeBadge[project.type] || 'bg-gray-100 text-gray-600']">
              {{ project.type }}
            </span>
          </div>
          <h1 class="text-lg font-bold text-gray-900 leading-snug">{{ project.name }}</h1>
          <p class="text-sm text-gray-500 mt-0.5">担当者: {{ project.contractor }}</p>
        </div>
      </div>

      <div v-if="isLoadingPosts" class="mb-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        投稿を読み込み中...
      </div>
      <div v-if="loadPostsError" class="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {{ loadPostsError }}
      </div>

      <div class="space-y-8">
        <section v-for="section in sectionOrder" :key="section"
                 class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

          <div class="space-y-4">
            <div v-if="posts[section].length === 0"
                 class="py-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p class="text-sm">投稿がありません</p>
            </div>

            <div v-for="post in posts[section]" :key="post.id"
                 class="rounded-xl border border-gray-200 overflow-hidden">
              <div class="p-4">
                <div class="flex items-center gap-3 mb-3">
                  <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0', avatarColor(post.author)]">
                    {{ initials(post.author) }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-800">{{ post.author }}</p>
                    <p class="text-xs text-gray-400">{{ post.date }}</p>
                  </div>
                  <div class="ml-auto flex items-center gap-2">
                    <span :class="['text-xs font-semibold px-2 py-0.5 rounded-full border', sectionMeta[section].postBadgeClass]">
                      {{ sectionMeta[section].label }}
                    </span>
                  </div>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{{ post.text }}</p>
              </div>

              <div v-if="post.comments.length" class="border-t border-gray-100 bg-gray-50 px-4 py-3 space-y-3">
                <div v-for="comment in post.comments" :key="comment.id" class="flex gap-3">
                  <div :class="['w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5', avatarColor(comment.author)]">
                    {{ initials(comment.author) }}
                  </div>
                  <div class="flex-1 bg-white rounded-xl border border-gray-200 px-3 py-2">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xs font-semibold text-gray-700">{{ comment.author }}</span>
                      <span class="text-xs text-gray-400">{{ comment.date }}</span>
                    </div>
                    <p class="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{{ comment.text }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
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
