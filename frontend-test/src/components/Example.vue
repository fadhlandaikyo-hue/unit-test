<script setup>
import {useTemplateRef} from "vue";
import {useDraggable} from "@vueuse/core";

const el =useTemplateRef('el')

const {x, y, style} = useDraggable(el, {
  initialValue: {x: 40, y:40}
})
</script>

<template>
  <div id="app">
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden">

      <!-- Title -->
      <div class="bg-blue-600 px-6 py-4">
        <h1 class="text-white text-xl font-bold tracking-wide">Data Tabel</h1>
        <p class="text-blue-200 text-sm mt-0.5">5 baris &bull; 6 kolom</p>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm">

          <!-- Header -->
          <thead>
          <tr class="bg-blue-50 border-b border-blue-100">
            <th class="px-5 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">No</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Nama</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Divisi</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Lokasi</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Status</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Tanggal</th>
          </tr>
          </thead>

          <!-- Body 窶・semua data ditulis langsung di template -->
          <tbody>
          <tr class="border-b border-gray-100 hover:bg-blue-50 transition-colors">
            <td class="px-5 py-3 text-gray-500 font-mono text-xs">001</td>
          </tr>
          <tr class="border-b border-gray-100 hover:bg-blue-50 transition-colors">
          </tr>
          <tr class="border-b border-gray-100 hover:bg-blue-50 transition-colors">
            <td class="px-5 py-3 text-gray-500 font-mono text-xs">003</td>
          </tr>
          <tr class="border-b border-gray-100 hover:bg-blue-50 transition-colors">
            <td class="px-5 py-3 text-gray-500 font-mono text-xs">004</td>
          </tr>
          <tr class="hover:bg-blue-50 transition-colors">
            <td class="px-5 py-3 text-gray-500 font-mono text-xs">005</td>
          </tr>
          </tbody>

        </table>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>
