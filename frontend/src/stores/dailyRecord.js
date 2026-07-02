import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDailyRecords, createDailyRecord, updateDailyRecord, deleteDailyRecord } from '../api/dailyRecord.js'

export const useDailyRecordStore = defineStore('dailyRecord', () => {
  const records = ref([])
  const loading = ref(false)

  async function fetchRecords(params = {}) {
    loading.value = true
    try {
      const res = await getDailyRecords(params)
      records.value = res.data || []
    } catch (err) {
      console.error('获取日常记录失败:', err.message)
    } finally {
      loading.value = false
    }
  }

  async function addRecord(data) {
    return await createDailyRecord(data)
  }

  async function editRecord(id, data) {
    return await updateDailyRecord(id, data)
  }

  async function removeRecord(id) {
    return await deleteDailyRecord(id)
  }

  return { records, loading, fetchRecords, addRecord, editRecord, removeRecord }
})
