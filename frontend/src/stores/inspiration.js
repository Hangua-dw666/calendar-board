import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getInspirations, createInspiration, updateInspiration, deleteInspiration } from '../api/inspiration.js'

export const useInspirationStore = defineStore('inspiration', () => {
  const records = ref([])
  const loading = ref(false)

  async function fetchRecords(params = {}) {
    loading.value = true
    try {
      const res = await getInspirations(params)
      records.value = res.data || []
    } catch (err) {
      console.error('获取灵感碎片失败:', err.message)
    } finally {
      loading.value = false
    }
  }

  async function addRecord(data) {
    return await createInspiration(data)
  }

  async function editRecord(id, data) {
    return await updateInspiration(id, data)
  }

  async function removeRecord(id) {
    return await deleteInspiration(id)
  }

  return { records, loading, fetchRecords, addRecord, editRecord, removeRecord }
})
