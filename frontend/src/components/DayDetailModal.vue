<template>
  <div v-if="visible" @click="close" class="fixed inset-0 bg-[#3d3528]/70 flex items-center justify-center z-50 p-4">
    <div @click.stop class="terminal-card w-full max-w-2xl max-h-[80vh] flex flex-col">
      <div class="flex items-center justify-between p-4 border-b border-terminal-border">
        <h3 class="text-terminal-green text-lg">
          <span class="text-terminal-muted">$</span> {{ formatDateDisplay }}
        </h3>
        <button @click="close" class="text-terminal-muted hover:text-terminal-red text-xl">x</button>
      </div>
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <h4 class="text-terminal-green mb-2 text-sm">== 日常记录 ==</h4>
          <div v-if="dailyRecords.length === 0" class="text-terminal-muted text-sm">暂无记录</div>
          <div v-for="record in dailyRecords" :key="record.id" class="terminal-card p-3 mb-2">
            <!-- 编辑表单 -->
            <template v-if="editing.id === record.id && editing.type === 'daily'">
              <div class="space-y-2">
                <input v-model="editing.title" type="text" maxlength="200" class="terminal-input w-full" placeholder="标题" />
                <textarea v-model="editing.content" class="terminal-input w-full h-20 resize-none" placeholder="内容"></textarea>
                <div class="flex items-center gap-2">
                  <span class="text-terminal-muted text-sm">分类:</span>
                  <CategorySelect v-model="editing.category_id" type="daily" class="flex-1" />
                </div>
                <div class="flex gap-2">
                  <button @click="saveEdit" class="terminal-btn text-sm px-3 py-1">保存</button>
                  <button @click="cancelEdit" class="terminal-btn-secondary text-sm px-3 py-1">取消</button>
                </div>
              </div>
            </template>
            <!-- 展示 -->
            <template v-else>
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <span v-if="record.category" class="terminal-tag mr-2" :style="{ borderColor: record.category.color, color: record.category.color }">{{ record.category.name }}</span>
                  <span class="text-terminal-text font-bold">{{ record.title }}</span>
                </div>
                <div class="flex gap-2">
                  <button @click="startEdit(record, 'daily')" class="text-terminal-muted hover:text-terminal-blue text-sm">编辑</button>
                  <button @click="deleteDaily(record.id)" class="text-terminal-muted hover:text-terminal-red text-sm">删除</button>
                </div>
              </div>
              <p v-if="record.content" class="text-terminal-muted text-sm mt-2 whitespace-pre-wrap">{{ record.content }}</p>
              <div v-if="record.images && record.images.length > 0" class="flex flex-wrap gap-2 mt-2">
                <img v-for="(img, i) in record.images" :key="i" :src="img.supabase_url" class="w-16 h-16 object-cover rounded border border-terminal-border cursor-pointer" @click="viewImage(img.supabase_url)" />
              </div>
            </template>
          </div>
        </div>
        <div>
          <h4 class="text-terminal-yellow mb-2 text-sm">== 灵感碎片 ==</h4>
          <div v-if="inspirationRecords.length === 0" class="text-terminal-muted text-sm">暂无灵感</div>
          <div v-for="record in inspirationRecords" :key="record.id" class="terminal-card p-3 mb-2">
            <template v-if="editing.id === record.id && editing.type === 'inspiration'">
              <div class="space-y-2">
                <input v-model="editing.title" type="text" maxlength="200" class="terminal-input w-full" placeholder="标题" />
                <textarea v-model="editing.content" class="terminal-input w-full h-20 resize-none" placeholder="内容"></textarea>
                <div class="flex items-center gap-2">
                  <span class="text-terminal-muted text-sm">分类:</span>
                  <CategorySelect v-model="editing.category_id" type="inspiration" class="flex-1" />
                </div>
                <div class="flex gap-2">
                  <button @click="saveEdit" class="terminal-btn text-sm px-3 py-1" style="background-color:#d4a017;color:#fffaf0;">保存</button>
                  <button @click="cancelEdit" class="terminal-btn-secondary text-sm px-3 py-1">取消</button>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <span v-if="record.category" class="terminal-tag mr-2" :style="{ borderColor: record.category.color, color: record.category.color }">{{ record.category.name }}</span>
                  <span class="text-terminal-text font-bold">{{ record.title }}</span>
                </div>
                <div class="flex gap-2">
                  <button @click="startEdit(record, 'inspiration')" class="text-terminal-muted hover:text-terminal-blue text-sm">编辑</button>
                  <button @click="deleteInspiration(record.id)" class="text-terminal-muted hover:text-terminal-red text-sm">删除</button>
                </div>
              </div>
              <p v-if="record.content" class="text-terminal-muted text-sm mt-2 whitespace-pre-wrap">{{ record.content }}</p>
              <div v-if="record.images && record.images.length > 0" class="flex flex-wrap gap-2 mt-2">
                <img v-for="(img, i) in record.images" :key="i" :src="img.supabase_url" class="w-16 h-16 object-cover rounded border border-terminal-border cursor-pointer" @click="viewImage(img.supabase_url)" />
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="previewImage" @click="previewImage = null" class="fixed inset-0 bg-[#3d3528]/90 flex items-center justify-center z-[60] p-4">
    <img :src="previewImage" class="max-w-full max-h-full object-contain" />
  </div>
</template>

<script setup>
import { computed, ref, reactive } from 'vue'
import { useDailyRecordStore } from '../stores/dailyRecord.js'
import { useInspirationStore } from '../stores/inspiration.js'
import CategorySelect from './CategorySelect.vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  date: { type: String, default: '' },
})

const emit = defineEmits(['close', 'refresh'])
const dailyRecordStore = useDailyRecordStore()
const inspirationStore = useInspirationStore()
const previewImage = ref(null)
const editing = reactive({ id: null, type: '', title: '', content: '', category_id: null })

const dailyRecords = computed(() => {
  if (!props.date) return []
  return dailyRecordStore.records.filter(r => r.record_date === props.date)
})

const inspirationRecords = computed(() => {
  if (!props.date) return []
  return inspirationStore.records.filter(r => r.record_date === props.date)
})

const formatDateDisplay = computed(() => {
  if (!props.date) return ''
  const [y, m, d] = props.date.split('-')
  return `${y}年${parseInt(m)}月${parseInt(d)}日`
})

function close() { emit('close') }
function viewImage(url) { previewImage.value = url }

function startEdit(record, type) {
  editing.id = record.id
  editing.type = type
  editing.title = record.title
  editing.content = record.content || ''
  editing.category_id = record.category_id
}

function cancelEdit() {
  editing.id = null; editing.type = ''; editing.title = ''; editing.content = ''; editing.category_id = null
}

async function saveEdit() {
  const title = editing.title.trim()
  if (!title) { alert('请输入标题'); return }
  if (title.length > 200) { alert('标题不能超过 200 字'); return }
  try {
    const data = { title, content: editing.content, category_id: editing.category_id }
    if (editing.type === 'daily') {
      await dailyRecordStore.editRecord(editing.id, data)
    } else {
      await inspirationStore.editRecord(editing.id, data)
    }
    cancelEdit()
    emit('refresh')
  } catch (err) {
    alert('保存失败: ' + (err.message || '未知错误'))
  }
}

async function deleteDaily(id) {
  if (!confirm('确定删除这条记录吗？')) return
  try { await dailyRecordStore.removeRecord(id); emit('refresh') }
  catch (err) { alert('删除失败: ' + (err.message || '未知错误')) }
}

async function deleteInspiration(id) {
  if (!confirm('确定删除这条灵感吗？')) return
  try { await inspirationStore.removeRecord(id); emit('refresh') }
  catch (err) { alert('删除失败: ' + (err.message || '未知错误')) }
}
</script>
