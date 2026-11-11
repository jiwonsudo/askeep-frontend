import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  changePassword,
  confirmPasswordReset,
  getMe,
  login,
  logout,
  requestPasswordReset,
  signup,
  updateProfile,
  withdraw,
} from '@/api/auth'
import {
  clearAccessToken,
  clearExpiredNotice,
  getAccessToken,
  saveAccessToken,
} from '@/utils/authStorage'

export const meQueryKey = ['me'] as const

export const useMe = () => {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: getMe,
    enabled: Boolean(getAccessToken()),
  })
}

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: ({ accessToken, user }) => {
      saveAccessToken(accessToken)
      queryClient.setQueryData(meQueryKey, user)
    },
  })
}

export const useSignup = () => {
  return useMutation({
    mutationFn: signup,
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,
    // 서버 요청이 실패해도(토큰 만료 등) 이 기기에서는 로그아웃 처리한다
    onSettled: () => {
      clearAccessToken()
      clearExpiredNotice()
      // 다른 계정의 데이터가 남지 않도록 캐시를 모두 비운다
      queryClient.clear()
    },
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(meQueryKey, user)
    },
  })
}

export const useChangePassword = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: changePassword,
    // 서버가 기존 토큰을 모두 무효로 만들고 새 토큰을 주므로 바꿔 끼운다
    onSuccess: ({ accessToken, user }) => {
      saveAccessToken(accessToken)
      queryClient.setQueryData(meQueryKey, user)
    },
  })
}

export const useWithdraw = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: withdraw,
    onSuccess: () => {
      clearAccessToken()
      clearExpiredNotice()
      queryClient.clear()
    },
  })
}

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: requestPasswordReset,
  })
}

export const useConfirmPasswordReset = () => {
  return useMutation({
    mutationFn: confirmPasswordReset,
  })
}
