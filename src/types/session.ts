import type { PageResponse } from '@/types/common'

/** ACTIVE는 백엔드에서 확인 중인 값 */
export type SessionStatus = 'READY' | 'ONGOING' | 'ACTIVE' | 'ENDED'
export type ParticipantRoleType = 'PRESENTER' | 'AUDIENCE'
export type ProcessStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

/** 날짜는 서버 기준 한국 시간이며 타임존 표기가 없다 */
export interface Session {
  sessionId: number
  title: string
  description: string | null
  presenterId: number
  presenterName: string
  entryCode: string
  status: SessionStatus
  startedAt: string | null
  endedAt: string | null
  createdAt: string
}

export interface CreateSessionRequest {
  title: string
  description?: string
}

export interface UpdateSessionRequest {
  title?: string
  description?: string
}

export interface SessionsQuery {
  status?: SessionStatus
}

export interface JoinByEntryCodeRequest {
  entryCode: string
}

export interface ParticipantResponse {
  sessionId: number
  userId: number
  role: ParticipantRoleType
}

export interface SessionSummary {
  sessionId: number
  status: ProcessStatus
  summary: string | null
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface MySessionsQuery {
  role?: ParticipantRoleType
}

export interface MySession {
  myRole: ParticipantRoleType
  session: Session
  summaryStatus: ProcessStatus | null
}

export interface SessionMaterial {
  id: number
  sessionId: number
  fileName: string
  contentType: string
  fileSize: number
  status: ProcessStatus
  createdAt: string
  updatedAt: string
}

export type SessionMaterialPage = PageResponse<SessionMaterial>
