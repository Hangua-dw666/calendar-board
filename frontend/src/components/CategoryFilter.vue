<template>
  <div class="flex items-center gap-2 flex-wrap">
    <span class="text-terminal-muted text-sm">筛选:</span>
    <button @click="selectCategory(null)"
      :class="['terminal-tag cursor-pointer', activeId === null ? 'border-terminal-green text-terminal-green' : 'border-terminal-border text-terminal-muted']">
      全部
    </button>
    <button v-for="cat in categories" :key="cat.id"
      @click="selectCategory(cat.id)"
      :class="['terminal-tag cursor-pointer', activeId === cat.id ? '' : 'opacity-50']"
      :style="{ borderColor: cat.color, color: cat.color }">
      {{ cat.name }}
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  categories: { type: Array, default: () => [] },
  modelValue: { type: [Number, null], default: null },
})

const emit = defineEmits(['update:modelValue'])
const activeId = ref(props.modelValue)

watch(() => props.modelValue, (val) => { activeId.value = val })

function selectCategory(id) {
  activeId.value = id
  emit('update:modelValue', id)
}
</script>
