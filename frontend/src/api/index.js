import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('[API Error]', error.message, error.response?.status)
    
    let msg = '网络错误'
    let code = -1
    let data = null

    if (error.response) {
      const resData = error.response.data
      code = error.response.status
      data = resData

      if (typeof resData === 'string') {
        msg = resData || `HTTP ${code} 错误`
      } else if (resData && typeof resData === 'object') {
        msg = resData.message || resData.error || `HTTP ${code} 错误`
      } else {
        msg = `HTTP ${code} 错误`
      }
    } else if (error.request) {
      msg = '服务器无响应，请检查网络连接'
    }
    
    return Promise.reject({ code, message: msg, data })
  }
)

export default api
