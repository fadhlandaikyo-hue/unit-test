<script setup>
import {useTemplateRef} from "vue";
import {useDraggable} from "@vueuse/core";

const el =useTemplateRef('el')

const {x, y, style} = useDraggable(el, {
  initialValue: {x: 1582, y:120}
})
</script>

<template>
  <aside class="w-80 bg-white border-l border-gray-200 flex flex-col shadow-lg z-20">
    <button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition position: fixed" ref="el" :style="style">
      Submit {{ x }}, {{ y }}
    </button>
  </aside>
</template>

<style scoped>

</style>