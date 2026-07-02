<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import UserButtonBack from "../Utilities/UtilitiesUsers/UserButtonBack.vue";
import UserButtonBackInspection from "../Utilities/UtilitiesUsers/UserButtonBackInspection.vue";

const route = useRoute();
const projectId = Number(route.params.id);
const apiBaseUrl = import.meta.env.VITE_API_PATH || "/api";

const CORRECT_PASSWORD = "191101";

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
const newPostText    = ref({ kansei: "", chukan: "" });
const newPostAuthor  = ref({ kansei: "", chukan: "" });
const showPostForm   = ref({ kansei: false, chukan: false });
const commentText    = ref({});
const commentAuthor  = ref({});
const showCommentBox = ref({});

const showSaveModal        = ref(false);
const saveModalType        = ref("");       // 'post' | 'comment'
const saveModalSection     = ref("");
const saveModalPostId      = ref(null);
const saveModalPassword    = ref("");
const saveModalPwError     = ref("");
const showSaveModalPw      = ref(false);
const isSaveModalShaking   = ref(false);
const isSaveModalSaving    = ref(false);

const showDeleteModal      = ref(false);
const deleteModalType      = ref("");      // 'post' | 'comment'
const deleteModalSection   = ref("");
const deleteModalPostId    = ref(null);
const deleteModalCommentId = ref(null);
const deleteModalPassword  = ref("");
const deleteModalPwError   = ref("");
const showDeleteModalPw    = ref(false);
const isDeleteModalShaking = ref(false);
const isDeleteModalDeleting = ref(false);

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

function togglePostForm(section) {
  showPostForm.value[section] = !showPostForm.value[section];
  if (!showPostForm.value[section]) {
    newPostText.value[section]   = "";
    newPostAuthor.value[section] = "";
  }
}

function commentKey(section, postId) { return `${section}-${postId}`; }

function toggleComment(section, postId) {
  const key = commentKey(section, postId);
  showCommentBox.value[key] = !showCommentBox.value[key];
  if (!showCommentBox.value[key]) {
    commentText.value[key]   = "";
    commentAuthor.value[key] = "";
  }
}

function openSaveModal(type, section, postId = null) {
  saveModalType.value     = type;
  saveModalSection.value  = section;
  saveModalPostId.value   = postId;
  saveModalPassword.value = "";
  saveModalPwError.value  = "";
  showSaveModalPw.value   = false;
  showSaveModal.value     = true;
  setTimeout(() => document.getElementById("id-save-pw")?.focus(), 100);
}

function closeSaveModal() {
  showSaveModal.value     = false;
  saveModalPassword.value = "";
  saveModalPwError.value  = "";
}

async function confirmSave() {
  if (isSaveModalSaving.value) return;
  if (saveModalPassword.value !== CORRECT_PASSWORD) {
    saveModalPwError.value  = "パスワードが間違っています";
    isSaveModalShaking.value = true;
    setTimeout(() => { isSaveModalShaking.value = false; }, 500);
    saveModalPassword.value  = "";
    document.getElementById("id-save-pw")?.focus();
    return;
  }

  isSaveModalSaving.value = true;
  saveModalPwError.value  = "";

  try {
    if (saveModalType.value === "post") {
      await doSubmitPost(saveModalSection.value);
    } else {
      await doSubmitComment(saveModalSection.value, saveModalPostId.value);
    }
    showSaveModal.value = false;
  } catch (error) {
    saveModalPwError.value = error.message || "保存に失敗しました";
  } finally {
    isSaveModalSaving.value = false;
  }
}

async function doSubmitPost(section) {
  const text   = newPostText.value[section].trim();
  const author = newPostAuthor.value[section].trim() || "Anonymous";
  if (!text) return;

  const result = await requestApi("/inspection-posts", {
    method: "POST",
    body: { project_id: projectId, section, author, text },
  });

  if (result?.data?.id) {
    posts.value[section].unshift(mapPost(result.data));
  } else {
    await loadPosts();
  }

  newPostText.value[section]          = "";
  newPostAuthor.value[section]        = "";
  showPostForm.value[section]         = false;
}

async function doSubmitComment(section, postId) {
  const key    = commentKey(section, postId);
  const text   = (commentText.value[key] || "").trim();
  const author = (commentAuthor.value[key] || "").trim() || "Anonymous";
  if (!text) return;

  const post = posts.value[section].find((p) => p.id === postId);
  if (!post) return;

  const result = await requestApi(`/inspection-posts/${postId}/comments`, {
    method: "POST",
    body: { section, author, text },
  });

  if (result?.data?.id) {
    post.comments.push(mapComment(result.data));
  } else {
    await loadPosts();
  }

  commentText.value[key]            = "";
  commentAuthor.value[key]          = "";
  showCommentBox.value[key]         = false;
}

function openDeleteModal(type, section, postId, commentId = null) {
  deleteModalType.value      = type;
  deleteModalSection.value   = section;
  deleteModalPostId.value    = postId;
  deleteModalCommentId.value = commentId;
  deleteModalPassword.value  = "";
  deleteModalPwError.value   = "";
  showDeleteModalPw.value    = false;
  showDeleteModal.value      = true;
  setTimeout(() => document.getElementById("id-delete-pw")?.focus(), 100);
}

function closeDeleteModal() {
  showDeleteModal.value     = false;
  deleteModalPassword.value = "";
  deleteModalPwError.value  = "";
}

async function confirmDelete() {
  if (isDeleteModalDeleting.value) return;
  if (deleteModalPassword.value !== CORRECT_PASSWORD) {
    deleteModalPwError.value   = "パスワードが間違っています";
    isDeleteModalShaking.value = true;
    setTimeout(() => { isDeleteModalShaking.value = false; }, 500);
    deleteModalPassword.value  = "";
    document.getElementById("id-delete-pw")?.focus();
    return;
  }

  isDeleteModalDeleting.value = true;
  deleteModalPwError.value    = "";

  try {
    if (deleteModalType.value === "post") {
      await doDeletePost(deleteModalSection.value, deleteModalPostId.value);
    } else {
      await doDeleteComment(deleteModalSection.value, deleteModalPostId.value, deleteModalCommentId.value);
    }
    showDeleteModal.value = false;
  } catch (error) {
    deleteModalPwError.value = error.message || "削除に失敗しました";
  } finally {
    isDeleteModalDeleting.value = false;
  }
}

async function doDeletePost(section, postId) {
  await requestApi(`/inspection-posts/${postId}?section=${encodeURIComponent(section)}`, { method: "DELETE" });
  posts.value[section] = posts.value[section].filter((p) => p.id !== postId);
}

async function doDeleteComment(section, postId, commentId) {
  const post = posts.value[section].find((p) => p.id === postId);
  if (!post) return;
  await requestApi(`/inspection-posts/${postId}/comments/${commentId}?section=${encodeURIComponent(section)}`, { method: "DELETE" });
  post.comments = post.comments.filter((c) => c.id !== commentId);
}

function initials(name) { return (name || "A").slice(0, 1).toUpperCase(); }
const avatarColors = ["bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-teal-500", "bg-rose-500", "bg-amber-500"];
function avatarColor(name) {
  let hash = 0;
  for (const char of name || "A") hash = (hash * 31 + char.charCodeAt(0)) % avatarColors.length;
  return avatarColors[hash];
}

function deleteTargetPost() {
  if (deleteModalType.value !== "post") return null;
  return posts.value[deleteModalSection.value]?.find((p) => p.id === deleteModalPostId.value) || null;
}
function deleteTargetComment() {
  if (deleteModalType.value !== "comment") return null;
  const post = posts.value[deleteModalSection.value]?.find((p) => p.id === deleteModalPostId.value);
  return post?.comments.find((c) => c.id === deleteModalCommentId.value) || null;
}

onMounted(loadPosts);
</script>

<template>
  <div v-if="!project" class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <p class="text-xl font-bold text-gray-600 mb-4">工事が見つかりません</p>
      <UserButtonBack/>
    </div>
  </div>

  <div v-else class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <UserButtonBackInspection/>

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

          <!-- Section header -->
          <div class="flex items-center gap-3 mb-4">
            <h2 class="text-base font-bold text-gray-800">{{ sectionMeta[section].label }}</h2>
            <span :class="['ml-auto text-xs font-semibold border px-2.5 py-0.5 rounded-full', sectionMeta[section].badgeClass]">
              {{ posts[section].length }} 件
            </span>
            <button
                @click="togglePostForm(section)"
                :class="['flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-colors', sectionMeta[section].buttonClass]"
            >
              追加
            </button>
          </div>

          <Transition name="slide-down">
            <div v-if="showPostForm[section]" :class="['mb-4 border rounded-xl p-4 space-y-3', sectionMeta[section].panelClass]">
              <input
                  v-model="newPostAuthor[section]"
                  type="text"
                  placeholder="投稿者名"
                  :class="['w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors', sectionMeta[section].focusClass]"
              />
              <textarea
                  v-model="newPostText[section]"
                  rows="3"
                  placeholder="投稿内容を入力..."
                  :class="['w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors resize-none', sectionMeta[section].focusClass]"
              />
              <div class="flex gap-2 justify-end">
                <button
                    @click="togglePostForm(section)"
                    class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                    @click="openSaveModal('post', section)"
                    :disabled="!newPostText[section].trim()"
                    :class="['px-3 py-1.5 text-xs font-semibold rounded-lg text-white transition-colors disabled:opacity-50', sectionMeta[section].buttonClass]"
                >
                  投稿
                </button>
              </div>
            </div>
          </Transition>

          <!-- Post list -->
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
                    <button
                        @click="openDeleteModal('post', section, post.id)"
                        class="text-xs font-semibold px-2 py-0.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      削除
                    </button>
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
                      <button
                          @click="openDeleteModal('comment', section, post.id, comment.id)"
                          class="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        削除
                      </button>
                    </div>
                    <p class="text-xs text-gray-600 leading-relaxed whitespace-pre-line">{{ comment.text }}</p>
                  </div>
                </div>
              </div>

              <!-- Comment toggle -->
              <div class="border-t border-gray-100 px-4 py-2.5">
                <button
                    @click="toggleComment(section, post.id)"
                    :class="['flex items-center gap-1.5 text-xs font-semibold text-gray-500 transition-colors', sectionMeta[section].commentHoverClass]"
                >
                  {{ post.comments.length > 0 ? `コメント (${post.comments.length})` : "コメント追加" }}
                </button>
              </div>

              <!-- Comment form -->
              <Transition name="slide-down">
                <div v-if="showCommentBox[commentKey(section, post.id)]"
                     class="border-t border-gray-100 bg-gray-50 px-4 py-3 space-y-2">
                  <input
                      v-model="commentAuthor[commentKey(section, post.id)]"
                      type="text"
                      placeholder="名前"
                      class="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-blue-400 transition-colors"
                  />
                  <textarea
                      v-model="commentText[commentKey(section, post.id)]"
                      rows="2"
                      placeholder="コメントを入力..."
                      class="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-blue-400 transition-colors resize-none"
                  />
                  <div class="flex gap-2 justify-end">
                    <button
                        @click="toggleComment(section, post.id)"
                        class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      キャンセル
                    </button>
                    <button
                        @click="openSaveModal('comment', section, post.id)"
                        :disabled="!commentText[commentKey(section, post.id)]?.trim()"
                        :class="['px-2.5 py-1 text-xs font-semibold rounded-lg text-white transition-colors disabled:opacity-50', sectionMeta[section].buttonClass]"
                    >
                      送信
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showSaveModal" class="fixed inset-0 z-50 flex items-center justify-center p-4"
           @keydown.escape="closeSaveModal">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeSaveModal" />

        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
             :class="{ shake: isSaveModalShaking }">

          <!-- Header -->
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

          <!-- Preview -->
          <div class="bg-gray-50 rounded-xl px-4 py-3 mb-5 text-sm">
            <p class="text-gray-500 text-xs mb-1">保存内容</p>
            <p class="font-semibold text-gray-800">
              {{ saveModalType === 'post' ? sectionMeta[saveModalSection]?.label + ' への投稿' : 'コメントの追加' }}
            </p>
            <p class="text-gray-500 text-xs mt-0.5 line-clamp-2">
              <template v-if="saveModalType === 'post'">
                {{ newPostText[saveModalSection] }}
              </template>
              <template v-else>
                {{ commentText[commentKey(saveModalSection, saveModalPostId)] }}
              </template>
            </p>
          </div>

          <!-- Password -->
          <label class="block text-xs font-semibold text-gray-600 mb-1.5">パスワード</label>
          <div class="relative">
            <input
                id="id-save-pw"
                v-model="saveModalPassword"
                :type="showSaveModalPw ? 'text' : 'password'"
                placeholder="パスワードを入力..."
                class="w-full rounded-xl border px-4 py-2.5 text-sm pr-10 outline-none transition-colors"
                :class="saveModalPwError
                ? 'border-red-400 bg-red-50 focus:border-red-500'
                : 'border-gray-300 bg-white focus:border-blue-500'"
                @keydown.enter="confirmSave"
            />
            <button type="button" @click="showSaveModalPw = !showSaveModalPw" tabindex="-1"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg v-if="!showSaveModalPw" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <p v-if="saveModalPwError" class="mt-2 text-xs text-red-600 flex items-center gap-1">
              <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd" />
              </svg>
              {{ saveModalPwError }}
            </p>
          </Transition>

          <!-- Buttons -->
          <div class="flex gap-2 mt-5">
            <button @click="closeSaveModal"
                    class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              キャンセル
            </button>
            <button @click="confirmSave" :disabled="isSaveModalSaving"
                    :class="['flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-60',
                saveModalSection === 'chukan' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700']">
              {{ isSaveModalSaving ? '保存中...' : '確認して保存' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4"
           @keydown.escape="closeDeleteModal">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeDeleteModal" />

        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
             :class="{ shake: isDeleteModalShaking }">

          <!-- Header -->
          <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900">削除の確認</h3>
              <p class="text-xs text-gray-500">パスワードを入力して削除を実行してください</p>
            </div>
          </div>

          <!-- Warning -->
          <div class="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">
            <p class="text-xs font-semibold text-red-700 mb-1">⚠ 注意</p>
            <p class="text-xs text-red-600 line-clamp-2">
              <template v-if="deleteModalType === 'post'">
                「{{ deleteTargetPost()?.author }}」の投稿を削除します。関連コメントもすべて削除されます。
              </template>
              <template v-else>
                「{{ deleteTargetComment()?.author }}」のコメントを削除します。
              </template>
            </p>
            <p class="text-xs text-red-500 mt-1">この操作は元に戻せません。</p>
          </div>

          <!-- Password -->
          <label class="block text-xs font-semibold text-gray-600 mb-1.5">パスワード</label>
          <div class="relative">
            <input
                id="id-delete-pw"
                v-model="deleteModalPassword"
                :type="showDeleteModalPw ? 'text' : 'password'"
                placeholder="パスワードを入力..."
                class="w-full rounded-xl border px-4 py-2.5 text-sm pr-10 outline-none transition-colors"
                :class="deleteModalPwError
                ? 'border-red-400 bg-red-50 focus:border-red-500'
                : 'border-gray-300 bg-white focus:border-red-400'"
                @keydown.enter="confirmDelete"
            />
            <button type="button" @click="showDeleteModalPw = !showDeleteModalPw" tabindex="-1"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg v-if="!showDeleteModalPw" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <p v-if="deleteModalPwError" class="mt-2 text-xs text-red-600 flex items-center gap-1">
              <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd" />
              </svg>
              {{ deleteModalPwError }}
            </p>
          </Transition>

          <!-- Buttons -->
          <div class="flex gap-2 mt-5">
            <button @click="closeDeleteModal"
                    class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              キャンセル
            </button>
            <button @click="confirmDelete" :disabled="isDeleteModalDeleting"
                    class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-60">
              {{ isDeleteModalDeleting ? '削除中...' : '削除する' }}
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
