<script setup>

</script>

<template>
  <!-- Navigation Bar-->
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <nav class="max-w-7xl mx-auto flex items-center px-4 z-50 justify-between p-6 lg:px-8">
      <div class="flex sm:flex-1">
        <RouterLink to="/home">
          <span class="sr-only">Your Company</span>
          <img class="h-14 w-auto" src="/img/dk_logo.png" alt=""/>
        </RouterLink>
      </div>
      <div class="flex flex-1 justify-end">
        <RouterLink
            to="/login"
            class="group inline-flex items-center gap-2 rounded-full border  bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-200/80 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
        >
          <span>ログイン</span>
          <span
              class="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition duration-200 group-hover:translate-x-0.5 group-hover:bg-white/30"
              aria-hidden="true">&rarr;</span>
        </RouterLink>
      </div>
    </nav>
  </header>
</template>

<style scoped>

</style>


