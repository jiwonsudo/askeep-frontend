export type SessionStatus = 'SCHEDULED' | 'ONGOING' | 'ENDED'

export interface Session {
  id: number
  title: string
  status: SessionStatus
  /** 발표자 본인 조회가 아니면 null로 내려옴 */
  entryCode: string | null
}

export interface CreateSessionRequest {
  title: string
}

export interface UpdateSessionRequest {
  title?: string
}

export interface ParticipantRole {
  role: 'PRESENTER' | 'AUDIENCE'
}

export interface JoinByEntryCodeRequest {
  entryCode: string
}

export interface SessionSummary {
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  content?: string
}

export interface MySessionsQuery {
  role: 'PRESENTER' | 'AUDIENCE'
}

export interface SessionMaterial {
  id: number
  sessionId: number
  fileName: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
}
