import { apiClient } from '@/api/client'
import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  PasswordResetConfirmRequest,
  PasswordResetRequest,
  SignupRequest,
  UpdateProfileRequest,
  UserResponse,
  WithdrawRequest,
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

/** 가입 여부와 관계없이 항상 성공으로 응답한다 */
export const requestPasswordReset = async (payload: PasswordResetRequest) => {
  await apiClient.post('/users/auth/password-reset/request', payload)
}

export const confirmPasswordReset = async (
  payload: PasswordResetConfirmRequest,
) => {
  await apiClient.post('/users/auth/password-reset/confirm', payload)
}

export const getMe = async () => {
  const { data } = await apiClient.get<UserResponse>('/users/me')
  return data
}

export const updateProfile = async (payload: UpdateProfileRequest) => {
  const { data } = await apiClient.patch<UserResponse>('/users/me', payload)
  return data
}

/** 기존 토큰은 모두 무효가 되고 새 토큰이 온다 */
export const changePassword = async (payload: ChangePasswordRequest) => {
  const { data } = await apiClient.patch<LoginResponse>(
    '/users/me/password',
    payload,
  )
  return data
}

export const withdraw = async (payload: WithdrawRequest) => {
  await apiClient.delete('/users/me', { data: payload })
}
