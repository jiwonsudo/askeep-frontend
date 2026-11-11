import type { ProcessStatus } from '@/types/session'

/** NO_EVIDENCE는 자료에 근거가 없어 AI가 답하지 않은 경우 */
export type AiStatus = ProcessStatus | 'NO_EVIDENCE'
export type AnswerType = 'AI' | 'PRESENTER'
export type QuestionSort = 'latest' | 'popular'

export interface UserSummary {
  id: number
  username: string
}

/** AI 답변이 참고한 자료의 위치 */
export interface AnswerSource {
  materialId: number
  fileName: string | null
  pageNumber: number | null
  similarity: number | null
}

export interface Answer {
  id: number
  questionId: number
  content: string
  type: AnswerType
  author: UserSummary | null
  sources: AnswerSource[]
  createdAt: string
}

/** 날짜는 `2026-11-20T14:00:00+09:00`처럼 시간대가 붙어서 온다 */
export interface Question {
  id: number
  sessionId: number
  content: string
  anonymous: boolean
  /** 익명 질문은 발표자와 작성자 본인에게만 내려온다 */
  author: UserSummary | null
  aiStatus: AiStatus
  answers: Answer[]
  createdAt: string
  updatedAt: string
  /** 발표자가 "답변 완료"로 표시했는지. 발표자가 답변을 달면 자동으로 켜진다 */
  answered: boolean
  answeredAt: string | null
  /** 작성자가 발표자에게 직접 답변을 요청했는지 */
  presenterRequested: boolean
  presenterRequestedAt: string | null
  /** "나도 궁금해요" 수 */
  likeCount: number
  /**
   * 보는 사람마다 다른 값이라 웹소켓 알림에는 빠져서 온다.
   * 알림으로 질문을 갱신할 때는 `useSessionRealtime`이 기존 값을 지킨다
   */
  mine?: boolean
  likedByMe?: boolean
}

export interface CreateQuestionRequest {
  content: string
  anonymous?: boolean
}

export interface UpdateQuestionRequest {
  content?: string
  anonymous?: boolean
}

export interface GetQuestionsQuery {
  page?: number
  size?: number
  /** afterId는 latest 정렬에서만 쓸 수 있다 */
  afterId?: number
  sort?: QuestionSort
}

export interface CreateAnswerRequest {
  content: string
}

export interface UpdateAnswerRequest {
  content: string
}
