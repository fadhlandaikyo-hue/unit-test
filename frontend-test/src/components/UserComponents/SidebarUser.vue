<script setup>
import {useLocalStorage} from "@vueuse/core";
import {onBeforeMount, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {userDetailName} from "../../lib/api/UserApi.js";
import {alertError} from "../../lib/alert.js";

const token = useLocalStorage('token', "")
const userName = ref("")
const isMobileMenuOpen = ref(false)
const route = useRoute()
let authCheckIntervalId = null

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function handleEscape(event) {
  if (event.key === "Escape") {
    closeMobileMenu()
  }
}

async function fetchUserName() {
  const response = await userDetailName(token.value);

  if (response.status === 401) {
    return
  }

  const responseBody = await response.json().catch(() => ({}));
  console.log(responseBody);

  if (response.status === 200) {
    userName.value = responseBody.data.username;
  } else {
    await alertError(responseBody.errors)
  }
}

onBeforeMount(async () => {
  await fetchUserName();
})

onMounted(() => {
  window.addEventListener("keydown", handleEscape)
  authCheckIntervalId = window.setInterval(fetchUserName, 10000)
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleEscape)

  if (authCheckIntervalId) {
    window.clearInterval(authCheckIntervalId)
  }

  document.body.style.overflow = ""
})

watch(() => route.fullPath, closeMobileMenu)

watch(isMobileMenuOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? "hidden" : ""
})
</script>

<template>
  <button
      type="button"
      class="lg:hidden fixed top-4 right-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      :aria-expanded="isMobileMenuOpen"
      aria-controls="user-navigation"
      :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
      @click="isMobileMenuOpen = !isMobileMenuOpen">
    <svg v-if="!isMobileMenuOpen" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16M4 12h16M4 17h16"></path>
    </svg>
    <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 18 6M6 6l12 12"></path>
    </svg>
  </button>

  <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
    <button
        v-if="isMobileMenuOpen"
        type="button"
        class="lg:hidden fixed inset-0 z-30 bg-gray-900/50"
        aria-label="Close menu"
        @click="closeMobileMenu">
    </button>
  </Transition>

  <aside
      id="user-navigation"
      class="fixed inset-y-0 right-0 z-40 w-72 max-w-[85vw] bg-white border-l border-gray-200 flex flex-col shadow-lg transition-transform duration-300 ease-out lg:static lg:w-80 lg:max-w-none lg:translate-x-0"
      :class="isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'">

    <div class="h-20 flex items-center justify-center border-b border-gray-100">
      <div class="flex items-center">
        <svg class="h-8 w-8 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
        <span class="font-bold text-xl text-gray-800">土木<span class="text-blue-600">管理</span></span>
      </div>
    </div>

    <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">

      <p class="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">メインメニュー</p>

      <RouterLink to="/dashboard/profile" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group">
        <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H6Zm7.25-2.095c.478-.86.75-1.85.75-2.905a5.973 5.973 0 0 0-.75-2.906 4 4 0 1 1 0 5.811ZM15.466 20c.34-.588.535-1.271.535-2v-1a5.978 5.978 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-4.535Z" clip-rule="evenodd"/>
        </svg>
        プロフィル管理
      </RouterLink>

      <RouterLink to="/dashboard/construction" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group">
        <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z"/>
        </svg>
        工事現場
      </RouterLink>

      <RouterLink to="/dashboard/file" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group">
        <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"/>
        </svg>
        ファイル形式または様式
      </RouterLink>

      <RouterLink to="/dashboard/inspection" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group">
        <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path fill-rule="evenodd" d="M8 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1h2a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2Zm6 1h-4v2H9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2h-1V4Zm-3 8a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-2-1a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H9Zm2 5a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2h-3a1 1 0 0 1-1-1Zm-2-1a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H9Z" clip-rule="evenodd"/>
        </svg>
        検査
      </RouterLink>

      <RouterLink to="/dashboard/inspection-counter" class="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group">
        <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"/>
        </svg>
        検査対策
      </RouterLink>

      <div class="py-4">
        <div class="border-t border-gray-100"></div>
      </div>

    </nav>

    <div class="p-4 border-t border-gray-100">
      <div class="flex items-center">
        <img class="h-10 w-10 rounded-full object-cover" src="/img/profile.png" alt="Avatar">
        <div class="ml-3">
          <input type="text" name="username" id="username"
                 class="block w-full  sm:text-sm"
                 readonly v-model="userName">
          <RouterLink to="/users/logout" class="text-xs text-blue-600 hover:underline">ログアウト</RouterLink>
        </div>
      </div>
    </div>

  </aside>
</template>

<style scoped>

</style>
