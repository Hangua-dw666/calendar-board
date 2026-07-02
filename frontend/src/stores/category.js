import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/category.js'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([])
  const loading = ref(false)

  async function fetchCategories(type = null) {
    loading.value = true
    try {
      const res = await getCategories(type)
      categories.value = res.data || []
    } catch (err) {
      console.error('获取分类失败:', err.message)
    } finally {
      loading.value = false
    }
  }

  async function addCategory(data) {
    const res = await createCategory(data)
    await fetchCategories()
    return res
  }

  async function editCategory(id, data) {
    const res = await updateCategory(id, data)
    await fetchCategories()
    return res
  }

  async function removeCategory(id) {
    const res = await deleteCategory(id)
    await fetchCategories()
    return res
  }

  return { categories, loading, fetchCategories, addCategory, editCategory, removeCategory }
})
