import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'

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
import { parseServerDate } from '@/utils/date'

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

/** 요약이 만들어지는 동안 목록을 다시 불러오는 간격 */
const SUMMARY_POLL_MS = 5000
/** 종료 직후 요약 상태가 아직 비어 있을 수 있어서, 이 시간 안에 끝난 세션은 준비 중으로 본다 */
const SUMMARY_GRACE_MS = 5 * 60 * 1000

export const useMySessions = (query?: MySessionsQuery) => {
  return useQuery({
    queryKey: sessionKeys.mine(query),
    queryFn: () => getMySessions(query),
    // 종료한 세션의 AI 요약이 끝날 때까지는 새로고침 없이도 상태가 바뀌도록 주기적으로 확인한다
    refetchInterval: (state) =>
      state.state.data?.some(({ session, summaryStatus }) => {
        if (session.status !== 'ENDED') return false
        if (summaryStatus === 'PENDING' || summaryStatus === 'PROCESSING') {
          return true
        }

        return (
          summaryStatus === null &&
          session.endedAt !== null &&
          Date.now() - parseServerDate(session.endedAt).getTime() <
            SUMMARY_GRACE_MS
        )
      })
        ? SUMMARY_POLL_MS
        : false,
  })
}

/**
 * 내 세션 목록(홈의 참여 중인 세션, 아카이브)을 최신으로 맞춘다.
 * 아직 화면에 안 떠 있는 목록도 다시 받아 두어서, 이동하자마자 바뀐 상태가 보이게 한다.
 * 다시 받기에 실패해도 호출한 동작(종료·시작 등)은 실패로 만들지 않는다.
 */
const refreshMySessions = async (queryClient: QueryClient) => {
  await queryClient.invalidateQueries({ queryKey: ['sessions', 'mine'] })
  await queryClient
    .refetchQueries({ queryKey: ['sessions', 'mine'], type: 'all' })
    .catch(() => undefined)
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
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      })
      await refreshMySessions(queryClient)
    },
  })
}

export const useEndSession = (sessionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => endSession(sessionId),
    // 다음 화면(아카이브)으로 넘어가기 전에 목록을 먼저 새로 받아 둔다
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.detail(sessionId),
      })
      await refreshMySessions(queryClient)
    },
  })
}

export const useJoinSessionByEntryCode = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: joinSessionByEntryCode,
    onSuccess: () => refreshMySessions(queryClient),
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
