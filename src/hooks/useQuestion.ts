import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'

import {
  createAnswer,
  createQuestion,
  deleteAnswer,
  deleteQuestion,
  getAnswers,
  getQuestion,
  getQuestions,
  retryAiAnswer,
  setPresenterRequested,
  setQuestionAnswered,
  setQuestionLiked,
  updateAnswer,
  updateQuestion,
} from '@/api/question'
import type { PageResponse } from '@/types/common'
import type { CreateQuestionRequest, Question } from '@/types/question'

export const questionKeys = {
  list: (sessionId: number) => ['sessions', sessionId, 'questions'] as const,
  detail: (questionId: number) => ['questions', questionId] as const,
  answers: (questionId: number) =>
    ['questions', questionId, 'answers'] as const,
}

/** 한 번에 불러오는 질문 수. 페이지네이션 UI가 생기기 전까지는 한 페이지로 충분히 가져온다 */
export const QUESTIONS_PAGE_SIZE = 100

/** 답변이 바뀌면 질문 목록(답변 포함)도 다시 불러온다 */
const isQuestionListKey = (queryKey: readonly unknown[]) =>
  queryKey[0] === 'sessions' && queryKey[2] === 'questions'

/**
 * 서버가 돌려준 질문을 목록에 바로 반영한다.
 * 이 응답에는 보는 사람 기준 값(`mine`, `likedByMe`)이 들어 있어서 그대로 덮어쓴다.
 */
const storeQuestion = (queryClient: QueryClient, question: Question) => {
  queryClient.setQueryData(
    questionKeys.list(question.sessionId),
    (page: PageResponse<Question> | undefined) =>
      page && {
        ...page,
        items: page.items.map((item) => {
          if (item.id !== question.id) return item

          // 그사이 웹소켓으로 더 새로운 내용이 왔으면 보는 사람 기준 값만 가져온다
          return question.updatedAt >= item.updatedAt
            ? question
            : { ...item, mine: question.mine, likedByMe: question.likedByMe }
        }),
      },
  )
  queryClient.setQueryData(questionKeys.detail(question.id), question)
}

export const useQuestions = (sessionId: number) => {
  return useQuery({
    queryKey: questionKeys.list(sessionId),
    queryFn: () =>
      getQuestions(sessionId, { page: 0, size: QUESTIONS_PAGE_SIZE }),
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

/** "나도 궁금해요"를 누르거나 취소한다 */
export const useSetQuestionLiked = (sessionId: number, questionId: number) => {
  const queryClient = useQueryClient()

  // 공감 수 알림이 응답보다 먼저 올 수 있어서, 누른 상태는 응답을 기다리지 않고 바로 바꿔 둔다
  const setLikedByMe = (likedByMe: boolean) =>
    queryClient.setQueryData(
      questionKeys.list(sessionId),
      (page: PageResponse<Question> | undefined) =>
        page && {
          ...page,
          items: page.items.map((item) =>
            item.id === questionId ? { ...item, likedByMe } : item,
          ),
        },
    )

  return useMutation({
    mutationFn: (liked: boolean) => setQuestionLiked(questionId, liked),
    onMutate: (liked) => setLikedByMe(liked),
    onError: (_error, liked) => setLikedByMe(!liked),
    onSuccess: (question) => storeQuestion(queryClient, question),
  })
}

/** 발표자가 "답변 완료"를 표시하거나 취소한다 */
export const useSetQuestionAnswered = (questionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (answered: boolean) =>
      setQuestionAnswered(questionId, answered),
    onSuccess: (question) => storeQuestion(queryClient, question),
  })
}

/** 질문 작성자가 발표자에게 직접 답변을 요청하거나 취소한다 */
export const useSetPresenterRequested = (questionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (requested: boolean) =>
      setPresenterRequested(questionId, requested),
    onSuccess: (question) => storeQuestion(queryClient, question),
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
        predicate: ({ queryKey }) => isQuestionListKey(queryKey),
      })
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
        predicate: ({ queryKey }) => isQuestionListKey(queryKey),
      })
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
        predicate: ({ queryKey }) => isQuestionListKey(queryKey),
      })
      queryClient.invalidateQueries({
        queryKey: questionKeys.answers(questionId),
      })
    },
  })
}
