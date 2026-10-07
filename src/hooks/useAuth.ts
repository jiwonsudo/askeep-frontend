import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getMe, login, logout, signup } from '@/api/auth'
import { clearEntryCodes } from '@/utils/entryCodeStorage'

export const meQueryKey = ['me'] as const

export const useMe = () => {
  return useQuery({
    queryKey: meQueryKey,
    queryFn: getMe,
    enabled: Boolean(localStorage.getItem('accessToken')),
  })
}

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: ({ accessToken, user }) => {
      localStorage.setItem('accessToken', accessToken)
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
      localStorage.removeItem('accessToken')
      clearEntryCodes()
      // 다른 계정의 데이터가 남지 않도록 캐시를 모두 비운다
      queryClient.clear()
    },
  })
}
