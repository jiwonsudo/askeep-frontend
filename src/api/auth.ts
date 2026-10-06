import { apiClient } from '@/api/client'
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  UserResponse,
} from '@/types/auth'

export const signup = async (payload: SignupRequest) => {
  const { data } = await apiClient.post<UserResponse>(
    '/users/auth/signup',
    payload,
  )
  return data
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
  const { data } = await apiClient.get<UserResponse>('/users/me')
  return data
}
