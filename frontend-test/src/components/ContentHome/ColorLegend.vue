<script setup>
const legend = [
  { color: '#3b82f6', label: '騾ｲ陦御ｸｭ (51窶・00%)' },
  { color: '#facc15', label: '蠎冗乢 (26窶・0%)'    },
  { color: '#fb923c', label: '譌ｩ譛・(11窶・5%)'    },
  { color: '#f87171', label: '髢句ｧ・(0窶・0%)'     },
]
</script>

<template>
  <div class="flex flex-wrap gap-5 mt-8 text-xs text-gray-500">
    <div
        v-for="item in legend"
        :key="item.label"
        class="flex items-center gap-1.5"
    >
      <span
          class="w-3 h-3 rounded-full inline-block flex-shrink-0"
          :style="{ backgroundColor: item.color }"
      />
      {{ item.label }}
    </div>
  </div>
</template>

<style scoped>

</style>
