import api from './index.js'

export function getInspirations(params = {}) {
  return api.get('/inspirations', { params })
}

export function getInspiration(id) {
  return api.get(`/inspirations/${id}`)
}

export function createInspiration(data) {
  return api.post('/inspirations', data)
}

export function updateInspiration(id, data) {
  return api.put(`/inspirations/${id}`, data)
}

export function deleteInspiration(id) {
  return api.delete(`/inspirations/${id}`)
}
