import { apiClient } from '@/api/client'
import type {
  CreateSessionRequest,
  JoinByEntryCodeRequest,
  MySession,
  MySessionsQuery,
  ParticipantResponse,
  Session,
  SessionMaterial,
  SessionMaterialPage,
  SessionsQuery,
  SessionSummary,
  UpdateSessionRequest,
} from '@/types/session'

export const createSession = async (payload: CreateSessionRequest) => {
  const { data } = await apiClient.post<Session>('/sessions', payload)
  return data
}

export const getSessions = async (query?: SessionsQuery) => {
  const { data } = await apiClient.get<Session[]>('/sessions', {
    params: query,
  })
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
  const { data } = await apiClient.post<Session>(`/sessions/${sessionId}/start`)
  return data
}

export const endSession = async (sessionId: number) => {
  const { data } = await apiClient.post<Session>(`/sessions/${sessionId}/end`)
  return data
}

export const joinSessionByEntryCode = async (
  payload: JoinByEntryCodeRequest,
) => {
  const { data } = await apiClient.post<ParticipantResponse>(
    '/sessions/participants',
    payload,
  )
  return data
}

export const getSessionSummary = async (sessionId: number) => {
  const { data } = await apiClient.get<SessionSummary>(
    `/sessions/${sessionId}/summary`,
  )
  return data
}

export const retrySessionSummary = async (sessionId: number) => {
  const { data } = await apiClient.post<SessionSummary>(
    `/sessions/${sessionId}/summary/retry`,
  )
  return data
}

export const getMySessions = async (query?: MySessionsQuery) => {
  const { data } = await apiClient.get<MySession[]>('/users/me/sessions', {
    params: query,
  })
  return data
}

export const uploadSessionMaterial = async (sessionId: number, file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await apiClient.post<SessionMaterial>(
    `/sessions/${sessionId}/materials`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data
}

export const getSessionMaterials = async (
  sessionId: number,
  query?: { page?: number; size?: number },
) => {
  const { data } = await apiClient.get<SessionMaterialPage>(
    `/sessions/${sessionId}/materials`,
    { params: query },
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
  const { data } = await apiClient.post<SessionMaterial>(
    `/materials/${materialId}/retry`,
  )
  return data
}
