<template>
  <div v-if="visible" @click="close" class="fixed inset-0 bg-[#3d3528]/70 flex items-center justify-center z-50 p-4">
    <div @click.stop class="terminal-card w-full max-w-lg max-h-[80vh] flex flex-col">
      <div class="flex items-center justify-between p-4 border-b border-terminal-border">
        <h3 class="text-terminal-green text-lg">分类管理</h3>
        <button @click="close" class="text-terminal-muted hover:text-terminal-red text-xl">x</button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <!-- 日常记录分类 -->
        <div>
          <h4 class="text-terminal-green mb-2 text-sm">== 日常记录分类 ==</h4>
          <div class="space-y-2">
            <div v-for="cat in dailyCategories" :key="cat.id" class="flex items-center gap-2 terminal-card p-2">
              <!-- 编辑模式 -->
              <template v-if="editingId === cat.id">
                <input type="color" v-model="editingForm.color" class="w-8 h-8 rounded cursor-pointer bg-transparent border border-terminal-border" />
                <input v-model="editingForm.name" class="terminal-input flex-1 py-1" :maxlength="50" />
                <button @click="saveEdit(cat.id)" class="text-terminal-green text-sm px-2">保存</button>
                <button @click="cancelEdit" class="text-terminal-muted text-sm px-2">取消</button>
              </template>
              <!-- 展示模式 -->
              <template v-else>
                <span class="w-8 h-8 rounded border border-terminal-border flex-shrink-0" :style="{ backgroundColor: cat.color }"></span>
                <span class="flex-1 text-terminal-text py-1">{{ cat.name }}</span>
                <button @click="startEdit(cat)" class="text-terminal-muted hover:text-terminal-blue text-sm px-2">编辑</button>
                <button @click="handleDelete(cat)" class="text-terminal-muted hover:text-terminal-red text-sm px-2">删除</button>
                <span v-if="cat.is_default" class="text-terminal-muted text-xs px-2">原始</span>
              </template>
            </div>
          </div>
          <button @click="addNew('daily')" class="terminal-btn-secondary text-sm mt-2">+ 新增日常分类</button>
        </div>

        <!-- 灵感碎片分类 -->
        <div>
          <h4 class="text-terminal-yellow mb-2 text-sm">== 灵感碎片分类 ==</h4>
          <div class="space-y-2">
            <div v-for="cat in inspirationCategories" :key="cat.id" class="flex items-center gap-2 terminal-card p-2">
              <!-- 编辑模式 -->
              <template v-if="editingId === cat.id">
                <input type="color" v-model="editingForm.color" class="w-8 h-8 rounded cursor-pointer bg-transparent border border-terminal-border" />
                <input v-model="editingForm.name" class="terminal-input flex-1 py-1" :maxlength="50" />
                <button @click="saveEdit(cat.id)" class="text-terminal-green text-sm px-2">保存</button>
                <button @click="cancelEdit" class="text-terminal-muted text-sm px-2">取消</button>
              </template>
              <!-- 展示模式 -->
              <template v-else>
                <span class="w-8 h-8 rounded border border-terminal-border flex-shrink-0" :style="{ backgroundColor: cat.color }"></span>
                <span class="flex-1 text-terminal-text py-1">{{ cat.name }}</span>
                <button @click="startEdit(cat)" class="text-terminal-muted hover:text-terminal-blue text-sm px-2">编辑</button>
                <button @click="handleDelete(cat)" class="text-terminal-muted hover:text-terminal-red text-sm px-2">删除</button>
                <span v-if="cat.is_default" class="text-terminal-muted text-xs px-2">原始</span>
              </template>
            </div>
          </div>
          <button @click="addNew('inspiration')" class="terminal-btn-secondary text-sm mt-2">+ 新增灵感分类</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useCategoryStore } from '../stores/category.js'

const props = defineProps({
  visible: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])
const categoryStore = useCategoryStore()

const editingId = ref(null)
const editingForm = reactive({ name: '', color: '' })

const dailyCategories = computed(() => categoryStore.categories.filter(c => c.type === 'daily'))
const inspirationCategories = computed(() => categoryStore.categories.filter(c => c.type === 'inspiration'))

function close() { 
  editingId.value = null
  emit('close') 
}

function startEdit(cat) {
  editingId.value = cat.id
  editingForm.name = cat.name
  editingForm.color = cat.color
}

function cancelEdit() {
  editingId.value = null
  editingForm.name = ''
  editingForm.color = ''
}

async function saveEdit(id) {
  const name = editingForm.name.trim()
  if (!name) { alert('分类名称不能为空'); return }
  if (name.length > 50) { alert('分类名称不能超过 50 字'); return }
  try {
    await categoryStore.editCategory(id, { name, color: editingForm.color })
    editingId.value = null
  } catch (err) {
    const msg = (err && typeof err === 'object' && err.message) ? err.message : (typeof err === 'string' ? err : '未知错误')
    alert('保存失败: ' + msg)
  }
}

async function handleDelete(cat) {
  if (!confirm(`确定删除分类"${cat.name}"吗？关联的记录将变为未分类。`)) return
  try {
    await categoryStore.removeCategory(cat.id)
    if (editingId.value === cat.id) cancelEdit()
  } catch (err) {
    const msg = (err && typeof err === 'object' && err.message) ? err.message : (typeof err === 'string' ? err : '未知错误')
    alert('删除失败: ' + msg)
  }
}

async function addNew(type) {
  const name = prompt(`请输入新的${type === 'daily' ? '日常' : '灵感'}分类名称：`)
  if (!name || !name.trim()) return
  if (name.trim().length > 50) { alert('分类名称不能超过 50 字'); return }
  try {
    await categoryStore.addCategory({ name: name.trim(), type, color: '#6b8e4e' })
  } catch (err) {
    const msg = (err && typeof err === 'object' && err.message) ? err.message : (typeof err === 'string' ? err : '未知错误')
    alert('新增失败: ' + msg)
  }
}
</script>
