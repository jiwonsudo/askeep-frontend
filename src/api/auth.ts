import { apiClient } from '@/api/client'
import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
  SignupRequest,
} from '@/types/auth'

export const signup = async (payload: SignupRequest) => {
  await apiClient.post('/users/auth/signup', payload)
}

export const login = async (payload: LoginRequest) => {
  const { data } = await apiClient.post<LoginResponse>(
    '/users/auth/login',
    payload,
  )
  return data
}

export const logout = async () => {
  await apiClient.post('/users/auth/logout')
}

export const getMe = async () => {
  const { data } = await apiClient.get<MeResponse>('/users/me')
  return data
}
