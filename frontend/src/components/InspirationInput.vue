<template>
  <div class="terminal-card p-4">
    <h3 class="text-terminal-yellow mb-3 flex items-center gap-2">
      <span>$</span> 灵感碎片
    </h3>
    <div class="space-y-3">
      <input v-model="form.title" type="text" maxlength="200" placeholder="灵感标题（最多 200 字）..." class="terminal-input w-full" />
      <textarea v-model="form.content" placeholder="突然想到的好点子..." class="terminal-input w-full h-24 resize-none"></textarea>
      <div class="flex items-center gap-2">
        <span class="text-terminal-muted text-sm whitespace-nowrap">分类:</span>
        <CategorySelect v-model="form.category_id" type="inspiration" class="flex-1" />
      </div>
      <ImageUploader ref="uploaderRef" v-model="form.images" />
      <button @click="handleSave" :disabled="saving" class="terminal-btn w-full disabled:opacity-50" style="background-color: #d4a017; color: #fffaf0;">
        {{ saving ? '保存中...' : '保存灵感' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useInspirationStore } from '../stores/inspiration.js'
import CategorySelect from './CategorySelect.vue'
import ImageUploader from './ImageUploader.vue'
import { getToday } from '../utils/date.js'

const inspirationStore = useInspirationStore()
const saving = ref(false)
const uploaderRef = ref(null)

const form = reactive({
  title: '', content: '',
  record_date: getToday().dateStr,
  category_id: null, images: [],
})

const emit = defineEmits(['refresh'])

async function handleSave() {
  const title = form.title.trim()
  if (!title) { alert('请输入标题'); return }
  if (title.length > 200) { alert('标题不能超过 200 字'); return }
  saving.value = true
  try {
    await inspirationStore.addRecord({
      title, content: form.content,
      record_date: form.record_date, category_id: form.category_id,
      images: form.images,
    })
    form.title = ''; form.content = ''; form.category_id = null; form.images = []
    uploaderRef.value?.reset()
    emit('refresh')
  } catch (err) {
    alert('保存失败: ' + (err.message || '未知错误'))
  } finally {
    saving.value = false
  }
}
</script>
