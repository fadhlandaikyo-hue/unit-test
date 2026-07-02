<script setup>
import { computed, ref } from "vue";
import BaseNavbarHome from "../HomeComponents/NavbarHome.vue";
import BaseFooterHome from "../HomeComponents/FooterHome.vue";
import BaseButtonBack from "../Utilities/UtilitiesHome/ButtonBack.vue";
import { useRoute, useRouter } from "vue-router";

const DOWNLOAD_PASSWORD = "123456";
const router = useRouter();
const route = useRoute();

const fileFilters = [
  { label: "全ファイル", value: "all" },
  { label: "PDF", value: "pdf" },
  { label: "DOCX", value: "word" },
  { label: "XLSX", value: "excel" },
];

const fileThemes = {
  pdf: {
    badge: "border-red-100 bg-red-50 text-red-600",
    icon: "bg-red-100 text-red-700",
    active: "border-red-200 bg-red-100 text-red-700",
    hover: "hover:bg-red-50 focus:ring-red-500",
  },
  word: {
    badge: "border-blue-100 bg-blue-50 text-blue-600",
    icon: "bg-blue-100 text-blue-700",
    active: "border-blue-200 bg-blue-100 text-blue-700",
    hover: "hover:bg-blue-50 focus:ring-blue-500",
  },
  excel: {
    badge: "border-green-100 bg-green-50 text-green-600",
    icon: "bg-green-100 text-green-700",
    active: "border-green-200 bg-green-100 text-green-700",
    hover: "hover:bg-green-50 focus:ring-green-500",
  },
  all: {
    active: "border-sky-200 bg-sky-100 text-sky-700",
  },
  default: {
    badge: "border-slate-100 bg-slate-50 text-slate-600",
    icon: "bg-slate-100 text-slate-700",
    active: "border-slate-200 bg-slate-100 text-slate-700",
    hover: "hover:bg-slate-50 focus:ring-slate-500",
  },
};

const equipmentFiles = [
  {
    title: "機器名と管理番号",
    description: "機器名と管理番号の一覧ファイル",
    filename: "国道９号線側道清掃の案内.pdf",
    path: "/files/国道９号線側道清掃の案内.pdf",
    fileType: "pdf",
    type: "PDF",
    size: "42 KB",
    updatedAt: "2026-04-27",
  },
  {
    title: "稟議書",
    description: "機器名と管理番号の一覧ファイル",
    filename: "稟議書.xlsx",
    path: "/files/稟議書.xlsx",
    fileType: "excel",
    type: "EXCEL",
    size: "18 KB",
    updatedAt: "2026-04-27",
  },
  {
    title: "社内報取材",
    description: "社内報取材",
    filename: "社内報取材.word",
    path: "/files/社内報取材.word",
    fileType: "word",
    type: "WORD",
    size: "18 KB",
    updatedAt: "2026-04-27",
  },
];

const activeFileType = computed(() => {
  const fileType = route.params.fileType;
  return fileFilters.some((filter) => filter.value === fileType) ? fileType : "all";
});

const filteredEquipmentFiles = computed(() => {
  if (activeFileType.value === "all") return equipmentFiles;
  return equipmentFiles.filter((file) => file.fileType === activeFileType.value);
});

function themeFor(fileType) {
  return fileThemes[fileType] ?? fileThemes.default;
}

function filterClass(filter) {
  if (activeFileType.value === filter.value) {
    return themeFor(filter.value).active;
  }

  return "border-gray-200 bg-white text-gray-600 hover:bg-gray-50";
}

const selectedFile = ref(null);
const showModal = ref(false);
const passwordInput = ref("");
const passwordError = ref("");
const showPassword = ref(false);
const isShaking = ref(false);

function downloadPublicFile(path, filename) {
  const link = document.createElement("a");
  link.href = path;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function requestPasswordAndDownload(file) {
  selectedFile.value = file;
  passwordInput.value = "";
  passwordError.value = "";
  showPassword.value = false;
  showModal.value = true;

  setTimeout(() => {
    document.getElementById("files-pw-input")?.focus();
  }, 100);
}

function goToFile(file) {
  router.push(`/home/files/${file.fileType}`);
  requestPasswordAndDownload(file);
}

function applyFilter(filter) {
  if (filter.value === "all") {
    router.push("/home/files");
    return;
  }

  router.push(`/home/files/${filter.value}`);
}

function closeModal() {
  showModal.value = false;
  selectedFile.value = null;
  passwordInput.value = "";
  passwordError.value = "";
}

function confirmDownload() {
  if (passwordInput.value !== DOWNLOAD_PASSWORD) {
    passwordError.value = "パスワードが間違っています";
    isShaking.value = true;

    setTimeout(() => {
      isShaking.value = false;
    }, 500);

    passwordInput.value = "";
    document.getElementById("files-pw-input")?.focus();
    return;
  }

  if (selectedFile.value) {
    downloadPublicFile(selectedFile.value.path, selectedFile.value.filename);
  }

  closeModal();
}

function onModalKeydown(event) {
  if (event.key === "Enter") confirmDownload();
  if (event.key === "Escape") closeModal();
}
</script>

<template>
  <BaseNavbarHome />

  <div class="min-h-screen bg-slate-50">
    <section class="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <BaseButtonBack />

      <div class="mt-8 border-b border-gray-200 pb-8">
        <p class="text-sm font-semibold uppercase tracking-wide text-sky-700">ファイル一覧</p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">ファイル形式または様式</h1>
        <p class="mt-3 max-w-2xl text-base leading-7 text-gray-600">
          必要なファイルをクリックしてダウンロードしてください
        </p>

        <div class="mt-8 flex flex-wrap justify-center gap-2">
          <button
              v-for="filter in fileFilters"
              :key="filter.value"
              type="button"
              class="rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-150"
              :class="filterClass(filter)"
              @click="applyFilter(filter)"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <main class="py-8">
        <div class="overflow-hidden border border-gray-200 bg-white shadow-sm">
          <div class="grid grid-cols-12 border-b border-gray-200 bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <div class="col-span-7 sm:col-span-8">ファイル</div>
            <div class="col-span-3 hidden sm:block">最終更新</div>
            <div class="col-span-5 text-right sm:col-span-1">サイズ</div>
          </div>

          <button
              v-for="file in filteredEquipmentFiles"
              :key="file.path"
              type="button"
              class="grid w-full grid-cols-12 items-center gap-3 border-b border-gray-100 px-5 py-4 text-left transition last:border-b-0 focus:outline-none focus:ring-2 focus:ring-inset"
              :class="themeFor(file.fileType).hover"
              @click="goToFile(file)"
          >
            <span class="col-span-7 flex min-w-0 items-center gap-4 sm:col-span-8">
              <span
                  class="flex h-11 w-11 shrink-0 items-center justify-center border text-xs font-bold"
                  :class="themeFor(file.fileType).badge"
              >
                {{ file.type }}
              </span>
              <span class="min-w-0">
                <span class="block truncate text-sm font-semibold text-gray-950 sm:text-base">{{ file.title }}</span>
                <span class="mt-1 block truncate text-xs text-gray-500 sm:text-sm">{{ file.description }}</span>
              </span>
            </span>

            <span class="col-span-3 hidden text-sm text-gray-500 sm:block">
              {{ file.updatedAt }}
            </span>

            <span class="col-span-5 flex items-center justify-end gap-3 sm:col-span-1">
              <span class="text-sm font-medium text-gray-600">{{ file.size }}</span>
              <span
                  class="flex h-8 w-8 items-center justify-center rounded-full"
                  :class="themeFor(file.fileType).icon"
                  aria-hidden="true"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                  <path fill-rule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v10.19l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-8.25 14.5a.75.75 0 0 1 .75.75v1.25A1.25 1.25 0 0 0 5.75 20h12.5a1.25 1.25 0 0 0 1.25-1.25V17.5a.75.75 0 0 1 1.5 0v1.25a2.75 2.75 0 0 1-2.75 2.75H5.75A2.75 2.75 0 0 1 3 18.75V17.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
                </svg>
              </span>
            </span>
          </button>

          <div
              v-if="filteredEquipmentFiles.length === 0"
              class="px-5 py-12 text-center text-sm text-gray-500"
          >
            選択したファイル形式のファイルはありません。
          </div>
        </div>
      </main>
    </section>
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
            class="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            :class="{ shake: isShaking }"
        >
          <div class="mb-5 flex items-center gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
              <svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Zm10-10V7a4 4 0 0 0-8 0v4h8Z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-900">パスワード必須</h3>
              <p class="text-xs text-gray-500">このファイルをダウンロードするには、パスワードを入力してください</p>
            </div>
          </div>

          <div class="mb-5 rounded-xl bg-gray-50 px-4 py-3 text-sm">
            <p class="mb-1 text-xs text-gray-500">ファイルをダウンロード</p>
            <p class="font-semibold text-gray-800">{{ selectedFile?.title }}</p>
            <p class="mt-0.5 text-xs text-gray-500">{{ selectedFile?.filename }}</p>
          </div>

          <label class="mb-1.5 block text-xs font-semibold text-gray-600">パスワード</label>
          <div class="relative">
            <input
                id="equipment-pw-input"
                v-model="passwordInput"
                :type="showPassword ? 'text' : 'password'"
                placeholder="パスワードを入力してください..."
                class="w-full rounded-xl border px-4 py-2.5 pr-10 text-sm outline-none transition-colors duration-150"
                :class="
                passwordError
                  ? 'border-red-400 bg-red-50 focus:border-red-500'
                  : 'border-gray-300 bg-white focus:border-blue-500'
              "
                @keydown.enter="confirmDownload"
            />
            <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                tabindex="-1"
                @click="showPassword = !showPassword"
            >
              <svg v-if="!showPassword" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z"
                />
              </svg>
              <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0 1 12 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 0 1 1.563-3.029m5.858.908a3 3 0 1 1 4.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532 3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0 1 12 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 0 1-4.132 5.411m0 0L21 21"
                />
              </svg>
            </button>
          </div>

          <Transition name="fade">
            <p v-if="passwordError" class="mt-2 flex items-center gap-1 text-xs text-red-600">
              <svg class="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1-9a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1Z"
                    clip-rule="evenodd"
                />
              </svg>
              {{ passwordError }}
            </p>
          </Transition>

          <div class="mt-5 flex gap-2">
            <button
                type="button"
                class="flex-1 rounded-xl bg-gray-100 py-2.5 text-sm font-semibold text-gray-600 transition-colors duration-150 hover:bg-gray-200"
                @click="closeModal"
            >
              キャンセル
            </button>
            <button
                type="button"
                class="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-700"
                @click="confirmDownload"
            >
              ダウンロード
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <BaseFooterHome />
</template>

<style scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-6px);
  }

  75% {
    transform: translateX(6px);
  }
}

.shake {
  animation: shake 0.35s ease-in-out;
}
</style>
