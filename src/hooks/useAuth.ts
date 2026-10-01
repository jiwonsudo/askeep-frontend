import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { getMe, login, logout, signup } from '@/api/auth'

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
    onSuccess: ({ accessToken }) => {
      localStorage.setItem('accessToken', accessToken)
      queryClient.invalidateQueries({ queryKey: meQueryKey })
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
    onSuccess: () => {
      localStorage.removeItem('accessToken')
      queryClient.removeQueries({ queryKey: meQueryKey })
    },
  })
}
