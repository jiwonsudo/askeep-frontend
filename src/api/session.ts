import { apiClient } from '@/api/client'
import type {
  CreateSessionRequest,
  JoinByEntryCodeRequest,
  MySessionsQuery,
  Session,
  SessionMaterial,
  SessionSummary,
  UpdateSessionRequest,
} from '@/types/session'

export const createSession = async (payload: CreateSessionRequest) => {
  const { data } = await apiClient.post<Session>('/sessions', payload)
  return data
}

export const getSessions = async () => {
  const { data } = await apiClient.get<Session[]>('/sessions')
  return data
}

export const getSession = async (sessionId: number) => {
  const { data } = await apiClient.get<Session>(`/sessions/${sessionId}`)
  return data
}

export const updateSession = async (
  sessionId: number,
  payload: UpdateSessionRequest,
) => {
  const { data } = await apiClient.patch<Session>(
    `/sessions/${sessionId}`,
    payload,
  )
  return data
}

export const deleteSession = async (sessionId: number) => {
  await apiClient.delete(`/sessions/${sessionId}`)
}

export const startSession = async (sessionId: number) => {
  await apiClient.post(`/sessions/${sessionId}/start`)
}

export const endSession = async (sessionId: number) => {
  await apiClient.post(`/sessions/${sessionId}/end`)
}

export const joinSessionByEntryCode = async (
  payload: JoinByEntryCodeRequest,
) => {
  await apiClient.post('/sessions/participants', payload)
}

export const getSessionSummary = async (sessionId: number) => {
  const { data } = await apiClient.get<SessionSummary>(
    `/sessions/${sessionId}/summary`,
  )
  return data
}

export const retrySessionSummary = async (sessionId: number) => {
  await apiClient.post(`/sessions/${sessionId}/summary/retry`)
}

export const getMySessions = async (query: MySessionsQuery) => {
  const { data } = await apiClient.get<Session[]>('/users/me/sessions', {
    params: query,
  })
  return data
}

export const uploadSessionMaterial = async (
  sessionId: number,
  file: File,
) => {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await apiClient.post<SessionMaterial>(
    `/sessions/${sessionId}/materials`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data
}

export const getSessionMaterials = async (sessionId: number) => {
  const { data } = await apiClient.get<SessionMaterial[]>(
    `/sessions/${sessionId}/materials`,
  )
  return data
}

export const getMaterial = async (materialId: number) => {
  const { data } = await apiClient.get<SessionMaterial>(
    `/materials/${materialId}`,
  )
  return data
}

export const deleteMaterial = async (materialId: number) => {
  await apiClient.delete(`/materials/${materialId}`)
}

export const retryMaterial = async (materialId: number) => {
  await apiClient.post(`/materials/${materialId}/retry`)
}
