import axios from "axios"

const backendUrl = import.meta.env.VITE_BACKEND_URL

const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken")
    if (token) config.headers["Authorization"] = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

let isRefreshing = false
let failedQueue = []

const NO_RETRY_URLS = new Set([
  "/api/user/login",
  "/api/user/register",
  "/api/user/refresh-token",
])

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) =>
    error ? prom.reject(error) : prom.resolve(token)
  )
  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const requestPath = originalRequest.url?.replace(backendUrl, "").split("?")[0]

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !NO_RETRY_URLS.has(requestPath)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) =>
          failedQueue.push({ resolve, reject })
        )
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`
            return axiosInstance(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${backendUrl}/api/user/refresh-token`,
          {},
          { withCredentials: true }
        )
        const newToken = data.data.accessToken
        localStorage.setItem("accessToken", newToken)
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`
        processQueue(null, newToken)
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem("accessToken")
        sessionStorage.clear()
        window.location.href = "/login"
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance