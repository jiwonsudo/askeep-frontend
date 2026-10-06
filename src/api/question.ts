import { apiClient } from '@/api/client'
import type { PageResponse } from '@/types/common'
import type {
  Answer,
  CreateAnswerRequest,
  CreateQuestionRequest,
  GetQuestionsQuery,
  Question,
  UpdateAnswerRequest,
  UpdateQuestionRequest,
} from '@/types/question'

export const createQuestion = async (
  sessionId: number,
  payload: CreateQuestionRequest,
) => {
  const { data } = await apiClient.post<Question>(
    `/sessions/${sessionId}/questions`,
    payload,
  )
  return data
}

export const getQuestions = async (
  sessionId: number,
  query?: GetQuestionsQuery,
) => {
  const { data } = await apiClient.get<PageResponse<Question>>(
    `/sessions/${sessionId}/questions`,
    { params: query },
  )
  return data
}

export const getQuestion = async (questionId: number) => {
  const { data } = await apiClient.get<Question>(`/questions/${questionId}`)
  return data
}

export const updateQuestion = async (
  questionId: number,
  payload: UpdateQuestionRequest,
) => {
  const { data } = await apiClient.patch<Question>(
    `/questions/${questionId}`,
    payload,
  )
  return data
}

export const deleteQuestion = async (questionId: number) => {
  await apiClient.delete(`/questions/${questionId}`)
}

export const retryAiAnswer = async (questionId: number) => {
  const { data } = await apiClient.post<Question>(
    `/questions/${questionId}/ai-answer/retry`,
  )
  return data
}

export const getAnswers = async (questionId: number) => {
  const { data } = await apiClient.get<Answer[]>(
    `/questions/${questionId}/answers`,
  )
  return data
}

export const createAnswer = async (
  questionId: number,
  payload: CreateAnswerRequest,
) => {
  const { data } = await apiClient.post<Answer>(
    `/questions/${questionId}/answers`,
    payload,
  )
  return data
}

export const updateAnswer = async (
  answerId: number,
  payload: UpdateAnswerRequest,
) => {
  const { data } = await apiClient.patch<Answer>(
    `/answers/${answerId}`,
    payload,
  )
  return data
}

// Swagger상 삭제 엔드포인트만 단수형 `/answer`. 백엔드에서 `/answers/`로 바뀔 수 있음
export const deleteAnswer = async (answerId: number) => {
  await apiClient.delete(`/answer/${answerId}`)
}
