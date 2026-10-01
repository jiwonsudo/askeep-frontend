import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createSession,
  deleteSession,
  endSession,
  getMySessions,
  getSession,
  getSessionMaterials,
  getSessions,
  getSessionSummary,
  joinSessionByEntryCode,
  retrySessionSummary,
  startSession,
  updateSession,
  uploadSessionMaterial,
} from '@/api/session'
import type { MySessionsQuery } from '@/types/session'

export const sessionKeys = {
  all: ['sessions'] as const,
  detail: (sessionId: number) => ['sessions', sessionId] as const,
  summary: (sessionId: number) => ['sessions', sessionId, 'summary'] as const,
  materials: (sessionId: number) =>
    ['sessions', sessionId, 'materials'] as const,
  mine: (query: MySessionsQuery) => ['sessions', 'mine', query] as const,
}

export const useSessions = () => {
  return useQuery({
    queryKey: sessionKeys.all,
    queryFn: getSessions,
  })
}

export const useSession = (sessionId: number) => {
  return useQuery({
    queryKey: sessionKeys.detail(sessionId),
    queryFn: () => getSession(sessionId),
  })
}

export const useMySessions = (query: MySessionsQuery) => {
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
    },
  })
}

export const useSessionMaterials = (sessionId: number) => {
  return useQuery({
    queryKey: sessionKeys.materials(sessionId),
    queryFn: () => getSessionMaterials(sessionId),
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
