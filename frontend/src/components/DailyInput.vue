<template>
  <div class="terminal-card p-4">
    <h3 class="text-terminal-green mb-3 flex items-center gap-2">
      <span>$</span> 记录日常
    </h3>
    <div class="space-y-3">
      <input v-model="form.title" type="text" placeholder="标题..." class="terminal-input w-full" />
      <textarea v-model="form.content" placeholder="今天发生了什么..." class="terminal-input w-full h-24 resize-none"></textarea>
      <div class="flex items-center gap-2">
        <span class="text-terminal-muted text-sm whitespace-nowrap">分类:</span>
        <CategorySelect v-model="form.category_id" type="daily" class="flex-1" />
      </div>
      <ImageUploader v-model="form.images" />
      <button @click="handleSave" :disabled="saving" class="terminal-btn w-full disabled:opacity-50">
        {{ saving ? '保存中...' : '保存记录' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useDailyRecordStore } from '../stores/dailyRecord.js'
import CategorySelect from './CategorySelect.vue'
import ImageUploader from './ImageUploader.vue'
import { getToday } from '../utils/date.js'

const dailyRecordStore = useDailyRecordStore()
const saving = ref(false)

const form = reactive({
  title: '', content: '',
  record_date: getToday().dateStr,
  category_id: null, images: [],
})

const emit = defineEmits(['refresh'])

async function handleSave() {
  if (!form.title.trim()) { alert('请输入标题'); return }
  saving.value = true
  try {
    await dailyRecordStore.addRecord({
      title: form.title, content: form.content,
      record_date: form.record_date, category_id: form.category_id,
      images: form.images,
    })
    form.title = ''; form.content = ''; form.category_id = null; form.images = []
    emit('refresh')
  } catch (err) {
    alert('保存失败: ' + (err.message || '未知错误'))
  } finally {
    saving.value = false
  }
}
</script>
