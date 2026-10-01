import { apiClient } from '@/api/client'
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
  const { data } = await apiClient.get<Question[]>(
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
  await apiClient.post(`/questions/${questionId}/ai-answer/retry`)
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

// 명세상 삭제 엔드포인트만 단수형 `/answer`로 되어 있어 그대로 반영 (팀에 오탈자 여부 확인 필요)
export const deleteAnswer = async (answerId: number) => {
  await apiClient.delete(`/answer/${answerId}`)
}
