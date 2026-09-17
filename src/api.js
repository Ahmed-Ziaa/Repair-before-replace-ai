import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('repair_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('repair_token')
    window.dispatchEvent(new Event('repair:unauthorized'))
  }
  return Promise.reject(error)
})

export const getApiError = (error, fallback = 'Something went wrong. Please try again.') => error.response?.data?.message || fallback
export default api
