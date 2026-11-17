import { isAxiosError } from 'axios'

import { apiClient } from '@/api/client'
import type {
  CreateSessionRequest,
  JoinByEntryCodeRequest,
  MaterialPages,
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

export const getMaterialPages = async (materialId: number) => {
  const { data } = await apiClient.get<MaterialPages>(
    `/materials/${materialId}/pages`,
  )
  return data
}

/** 로그인 토큰이 필요한 주소라 `<img src>`로 바로 쓸 수 없어서 이미지 데이터로 받는다 */
export const getMaterialPageImage = async (
  materialId: number,
  pageNumber: number,
) => {
  const { data } = await apiClient.get<Blob>(
    `/materials/${materialId}/pages/${pageNumber}/image`,
    { responseType: 'blob' },
  )
  return data
}

export const retryMaterial = async (materialId: number) => {
  const { data } = await apiClient.post<SessionMaterial>(
    `/materials/${materialId}/retry`,
  )
  return data
}

/** Content-Disposition에서 파일명을 꺼낸다. 한글 이름은 filename*=UTF-8''... 쪽에 들어 있다 */
const parseFileName = (disposition: string | undefined) => {
  if (!disposition) return undefined

  const encoded = disposition.match(/filename\*=UTF-8''([^;]+)/i)
  if (encoded) {
    try {
      return decodeURIComponent(encoded[1].trim())
    } catch {
      // 잘못 인코딩된 이름이면 아래의 일반 filename으로 넘어간다
    }
  }

  return disposition.match(/filename="?([^";]+)"?/i)?.[1]
}

/**
 * 발표자료 원본 PDF. 로그인 토큰이 필요해서 `<a href>`로 바로 받을 수 없으므로 파일 데이터로 받는다.
 * 종료된 세션의 자료는 로그인한 누구나, 그 전에는 발표자·참여자만 받을 수 있다.
 */
export const downloadMaterial = async (
  materialId: number,
  fallbackName: string,
) => {
  try {
    const response = await apiClient.get<Blob>(
      `/materials/${materialId}/download`,
      { responseType: 'blob' },
    )
    const fileName =
      parseFileName(response.headers['content-disposition']) ?? fallbackName

    return { blob: response.data, fileName }
  } catch (error) {
    // 실패 응답도 Blob으로 오므로, 공통 에러 문구를 쓸 수 있게 JSON으로 바꿔 둔다
    if (isAxiosError(error) && error.response?.data instanceof Blob) {
      try {
        error.response.data = JSON.parse(await error.response.data.text())
      } catch {
        // JSON이 아니면 그대로 둔다
      }
    }
    throw error
  }
}
