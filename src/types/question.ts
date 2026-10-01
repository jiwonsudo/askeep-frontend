export type AiStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
export type AnswerType = 'AI' | 'PRESENTER'

export interface Author {
  id: number
  username: string
}

export interface Answer {
  id: number
  questionId: number
  content: string
  type: AnswerType
  author: Author | null
  createdAt: string
}

export interface Question {
  id: number
  sessionId: number
  content: string
  anonymous: boolean
  author: Author | null
  aiStatus: AiStatus
  answers: Answer[]
  createdAt: string
  updatedAt: string
}

export interface CreateQuestionRequest {
  content: string
  anonymous?: boolean
}

export interface UpdateQuestionRequest {
  content?: string
}

export interface GetQuestionsQuery {
  afterId?: number
}

export interface CreateAnswerRequest {
  content: string
}

export interface UpdateAnswerRequest {
  content: string
}
