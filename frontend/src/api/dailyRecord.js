import api from './index.js'

export function getDailyRecords(params = {}) {
  return api.get('/daily-records', { params })
}

export function getDailyRecord(id) {
  return api.get(`/daily-records/${id}`)
}

export function createDailyRecord(data) {
  return api.post('/daily-records', data)
}

export function updateDailyRecord(id, data) {
  return api.put(`/daily-records/${id}`, data)
}

export function deleteDailyRecord(id) {
  return api.delete(`/daily-records/${id}`)
}
