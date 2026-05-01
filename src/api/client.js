import axios from 'axios'

const TOKEN_KEY = 'jobpilot_token'
const USER_KEY = 'jobpilot_user'

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  getUser: () => {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(USER_KEY),
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}

const publicEndpoints = ['/api/auth/login', '/api/auth/signup']

export const api = axios.create({
  baseURL: 'http://localhost:8080',
})

api.interceptors.request.use(
  (config) => {
    const token = storage.getToken()
    const isPublic = publicEndpoints.some((path) => config.url?.includes(path))

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else if (!isPublic && window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
      window.location.href = '/login'
    }

    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.clearAuth()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)
