import axios, { isAxiosError } from 'axios'

interface ApiEnvelope {
  success: boolean
  data?: unknown
  error?: { code?: string; message?: string }
}

const isApiEnvelope = (body: unknown): body is ApiEnvelope =>
  typeof body === 'object' &&
  body !== null &&
  'success' in body &&
  typeof body.success === 'boolean'

/** 서버 공통 에러 응답(error.message)을 꺼내고, 없으면 fallback을 돌려준다 */
export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error) && isApiEnvelope(error.response?.data)) {
    return error.response.data.error?.message ?? fallback
  }

  return fallback
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => {
    // 서버는 { success, data, error } 형태로 감싸서 내려주므로 data만 꺼내 쓴다
    if (isApiEnvelope(response.data)) {
      response.data = response.data.data
    }

    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
    }

    return Promise.reject(error)
  },
)
