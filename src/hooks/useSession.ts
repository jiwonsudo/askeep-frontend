import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createSession,
  deleteMaterial,
  deleteSession,
  endSession,
  getMaterial,
  getMySessions,
  getSession,
  getSessionMaterials,
  getSessions,
  getSessionSummary,
  joinSessionByEntryCode,
  retryMaterial,
  retrySessionSummary,
  startSession,
  updateSession,
  uploadSessionMaterial,
} from '@/api/session'
import type { MySessionsQuery, SessionsQuery } from '@/types/session'

export const sessionKeys = {
  all: ['sessions'] as const,
  list: (query?: SessionsQuery) => ['sessions', 'list', query] as const,
  detail: (sessionId: number) => ['sessions', sessionId] as const,
  summary: (sessionId: number) => ['sessions', sessionId, 'summary'] as const,
  materials: (sessionId: number) =>
    ['sessions', sessionId, 'materials'] as const,
  material: (materialId: number) => ['materials', materialId] as const,
  mine: (query?: MySessionsQuery) => ['sessions', 'mine', query] as const,
}

export const useSessions = (query?: SessionsQuery) => {
  return useQuery({
    queryKey: sessionKeys.list(query),
    queryFn: () => getSessions(query),
  })
}

export const useSession = (
  sessionId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: sessionKeys.detail(sessionId),
    queryFn: () => getSession(sessionId),
    enabled: options?.enabled,
  })
}

export const useMySessions = (query?: MySessionsQuery) => {
  return useQuery({
    queryKey: sessionKeys.mine(query),
    queryFn: () => getMySessions(query),
  })
}

export const useCreateSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all })
    },
  })
}

export const useUpdateSession = (sessionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Parameters<typeof updateSession>[1]) =>
      updateSession(sessionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      })
    },
  })
}

export const useDeleteSession = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.all })
    },
  })
}

export const useStartSession = (sessionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => startSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      })
    },
  })
}

export const useEndSession = (sessionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => endSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      })
    },
  })
}

export const useJoinSessionByEntryCode = () => {
  return useMutation({
    mutationFn: joinSessionByEntryCode,
  })
}

export const useSessionSummary = (sessionId: number) => {
  return useQuery({
    queryKey: sessionKeys.summary(sessionId),
    queryFn: () => getSessionSummary(sessionId),
  })
}

export const useRetrySessionSummary = (sessionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => retrySessionSummary(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.summary(sessionId),
      })
      queryClient.invalidateQueries({ queryKey: ['sessions', 'mine'] })
    },
  })
}

export const useSessionMaterials = (sessionId: number) => {
  return useQuery({
    queryKey: sessionKeys.materials(sessionId),
    queryFn: () => getSessionMaterials(sessionId),
    // 분석이 끝나기 전까지는 상태를 주기적으로 다시 확인한다
    refetchInterval: (query) =>
      query.state.data?.items.some(
        ({ status }) => status === 'PENDING' || status === 'PROCESSING',
      )
        ? 3000
        : false,
  })
}

export const useUploadSessionMaterial = (sessionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => uploadSessionMaterial(sessionId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.materials(sessionId),
      })
    },
  })
}

export const useMaterial = (materialId: number) => {
  return useQuery({
    queryKey: sessionKeys.material(materialId),
    queryFn: () => getMaterial(materialId),
  })
}

export const useDeleteMaterial = (sessionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.materials(sessionId),
      })
    },
  })
}

export const useRetryMaterial = (sessionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: retryMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.materials(sessionId),
      })
    },
  })
}
