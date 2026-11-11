import type { PageResponse } from '@/types/common'

/** ACTIVE는 예전 데이터에 남아 있는 "진행 중" 값. 새 세션은 ONGOING을 쓴다 */
export type SessionStatus = 'READY' | 'ONGOING' | 'ACTIVE' | 'ENDED'
export type ParticipantRoleType = 'PRESENTER' | 'AUDIENCE'
export type ProcessStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

/** 날짜는 `2026-11-20T14:00:00+09:00`처럼 시간대가 붙어서 온다 */
export interface Session {
  sessionId: number
  title: string
  description: string | null
  presenterId: number
  presenterName: string
  /** 발표자와 참여한 청자에게만 내려온다 */
  entryCode: string | null
  status: SessionStatus
  /** 발표자가 세션을 시작·종료한 시각. 아직이면 null */
  startedAt: string | null
  endedAt: string | null
  createdAt: string
}

export interface CreateSessionRequest {
  title: string
  description?: string
}

/** 보낸 필드만 바뀐다 */
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

export interface SummarySection {
  title: string
  description: string
}

export interface SessionSummary {
  sessionId: number
  status: ProcessStatus
  summary: string | null
  tags: string[]
  createdAt: string
  updatedAt: string
  /** "소제목 + 설명"으로 나뉜 요약. 나뉘지 않은 요약은 "세션 요약" 한 항목으로 온다 */
  sections: SummarySection[]
}

export interface MySessionsQuery {
  role?: ParticipantRoleType
  tag?: string
}

export interface MySession {
  myRole: ParticipantRoleType
  session: Session
  summaryStatus: ProcessStatus | null
  /** 세션 요약의 태그. 요약이 없으면 빈 배열 */
  tags: string[]
  questionCount: number
  /** 청자는 입장한 시각, 발표자는 세션을 만든 시각 */
  joinedAt: string | null
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
  /** 아직 세어 보지 않은 자료는 null */
  pageCount: number | null
}

export type SessionMaterialPage = PageResponse<SessionMaterial>

export interface MaterialPages {
  materialId: number
  pageCount: number
  pages: { pageNumber: number; imageUrl: string }[]
}
