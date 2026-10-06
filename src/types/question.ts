import type { ProcessStatus } from '@/types/session'

export type AiStatus = ProcessStatus
export type AnswerType = 'AI' | 'PRESENTER'

export interface UserSummary {
  id: number
  username: string
}

export interface Answer {
  id: number
  questionId: number
  content: string
  type: AnswerType
  author: UserSummary | null
  createdAt: string
}

/** 날짜는 서버 기준 한국 시간이며 타임존 표기가 없다 */
export interface Question {
  id: number
  sessionId: number
  content: string
  anonymous: boolean
  author: UserSummary | null
  aiStatus: AiStatus
  answers: Answer[]
  createdAt: string
  updatedAt: string
  /** 내가 쓴 질문인지 */
  mine: boolean
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
  afterId?: number
}

export interface CreateAnswerRequest {
  content: string
}

export interface UpdateAnswerRequest {
  content: string
}
