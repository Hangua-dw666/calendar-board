import api from './index.js'

export function getCategories(type = null) {
  const params = {}
  if (type) params.type = type
  return api.get('/categories', { params })
}

export function createCategory(data) {
  return api.post('/categories', data)
}

export function updateCategory(id, data) {
  return api.put(`/categories/${id}`, data)
}

export function deleteCategory(id) {
  return api.delete(`/categories/${id}`)
}
