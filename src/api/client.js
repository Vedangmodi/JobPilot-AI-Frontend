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

const envBase = import.meta.env.VITE_API_URL?.trim()
const defaultProdApi = 'https://jobpilot-ai-pa1k.onrender.com'
const resolvedBaseURL =
  envBase ||
  (import.meta.env.DEV ? 'http://localhost:8080' : defaultProdApi)

export const api = axios.create({
  baseURL: resolvedBaseURL,
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
