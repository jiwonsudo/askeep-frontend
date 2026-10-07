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
  /**
   * 내가 쓴 질문인지. Swagger에는 있지만 dev 서버 응답에는 아직 내려오지 않아서
   * 화면에서는 `useQuestions`가 작성자 ID로 채운 값을 쓴다
   */
  mine?: boolean
  /**
   * "나도 궁금해요" 수와 내가 눌렀는지 여부. 백엔드에 좋아요 API가 아직 없어서
   * 응답에 오지 않으면 화면에서는 0으로 보여준다
   */
  likeCount?: number
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
  afterId?: number
}

export interface CreateAnswerRequest {
  content: string
}

export interface UpdateAnswerRequest {
  content: string
}
