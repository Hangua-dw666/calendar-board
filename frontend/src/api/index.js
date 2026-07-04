import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('[API Error]', error.message)
    if (error.response) {
      return Promise.reject(error.response.data)
    }
    return Promise.reject({ code: -1, message: '网络错误', data: null })
  }
)

export default api
