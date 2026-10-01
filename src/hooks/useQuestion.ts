import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  createAnswer,
  createQuestion,
  deleteAnswer,
  deleteQuestion,
  getAnswers,
  getQuestion,
  getQuestions,
  retryAiAnswer,
  updateAnswer,
  updateQuestion,
} from '@/api/question'
import type { CreateQuestionRequest } from '@/types/question'

export const questionKeys = {
  list: (sessionId: number) => ['sessions', sessionId, 'questions'] as const,
  detail: (questionId: number) => ['questions', questionId] as const,
  answers: (questionId: number) =>
    ['questions', questionId, 'answers'] as const,
}

export const useQuestions = (sessionId: number) => {
  return useQuery({
    queryKey: questionKeys.list(sessionId),
    queryFn: () => getQuestions(sessionId),
  })
}

/**
 * 진행 중인 세션에서만 사용. 웹소켓 QUESTION_CREATED 수신이 끊겼을 때의
 * 폴백 용도로 afterId 기준 새 질문을 주기적으로 확인한다.
 */
export const useNewQuestionsPolling = (
  sessionId: number,
  afterId: number | undefined,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: [...questionKeys.list(sessionId), 'after', afterId],
    queryFn: () => getQuestions(sessionId, { afterId }),
    enabled,
    refetchInterval: enabled ? 5000 : false,
  })
}

export const useQuestion = (questionId: number) => {
  return useQuery({
    queryKey: questionKeys.detail(questionId),
    queryFn: () => getQuestion(questionId),
  })
}

export const useCreateQuestion = (sessionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateQuestionRequest) =>
      createQuestion(sessionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.list(sessionId) })
    },
  })
}

export const useUpdateQuestion = (questionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Parameters<typeof updateQuestion>[1]) =>
      updateQuestion(questionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.detail(questionId),
      })
    },
  })
}

export const useDeleteQuestion = (sessionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.list(sessionId) })
    },
  })
}

export const useRetryAiAnswer = (questionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => retryAiAnswer(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.detail(questionId),
      })
    },
  })
}

export const useAnswers = (questionId: number) => {
  return useQuery({
    queryKey: questionKeys.answers(questionId),
    queryFn: () => getAnswers(questionId),
  })
}

export const useCreateAnswer = (questionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Parameters<typeof createAnswer>[1]) =>
      createAnswer(questionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.answers(questionId),
      })
    },
  })
}

export const useUpdateAnswer = (questionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (variables: {
      answerId: number
      payload: Parameters<typeof updateAnswer>[1]
    }) => updateAnswer(variables.answerId, variables.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.answers(questionId),
      })
    },
  })
}

export const useDeleteAnswer = (questionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAnswer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.answers(questionId),
      })
    },
  })
}
