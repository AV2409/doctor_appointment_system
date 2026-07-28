import axios from 'axios'
import { getRoleFromToken } from './getRoleFromToken'

const backendUrl = import.meta.env.VITE_BACKEND_URL

const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers['Authorization'] = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)))
  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) =>
          failedQueue.push({ resolve, reject })
        )
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return axiosInstance(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const storedToken = localStorage.getItem('accessToken')
        const role = getRoleFromToken(storedToken) || 'ADMIN'
        const refreshEndpoint =
          role === 'DOCTOR'
            ? '/api/doctor/refresh-token'
            : '/api/admin/refresh-token'

        const { data } = await axios.post(
          `${backendUrl}${refreshEndpoint}`,
          {},
          { withCredentials: true }
        )

        const newToken = data.data.accessToken
        localStorage.setItem('accessToken', newToken)
        axiosInstance.defaults.headers['Authorization'] = `Bearer ${newToken}`
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`
        processQueue(null, newToken)
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('accessToken')
        window.location.href = '/'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
