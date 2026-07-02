<template>
  <select :value="modelValue" @change="onChange" class="terminal-input w-full">
    <option :value="null">-- 选择分类 --</option>
    <option v-for="cat in filteredCategories" :key="cat.id" :value="cat.id">
      {{ cat.name }}
    </option>
  </select>
</template>

<script setup>
import { computed } from 'vue'
import { useCategoryStore } from '../stores/category.js'

const props = defineProps({
  modelValue: { type: [Number, null], default: null },
  type: { type: String, default: 'daily' },
})

const emit = defineEmits(['update:modelValue'])
const categoryStore = useCategoryStore()

const filteredCategories = computed(() => {
  return categoryStore.categories.filter(c => c.type === props.type)
})

function onChange(e) {
  const val = e.target.value ? Number(e.target.value) : null
  emit('update:modelValue', val)
}
</script>
