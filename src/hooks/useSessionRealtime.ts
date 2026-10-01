import { useQueryClient } from '@tanstack/react-query'

import { questionKeys } from '@/hooks/useQuestion'
import { sessionKeys } from '@/hooks/useSession'
import { useSessionSocket } from '@/hooks/useSessionSocket'
import type { Question } from '@/types/question'

/**
 * 세션 상세/질문 목록 react-query 캐시를 웹소켓 이벤트로 직접 갱신한다.
 * 화면에서 useSession, useQuestions와 함께 호출하면 됨.
 */
export const useSessionRealtime = (sessionId: number | undefined) => {
  const queryClient = useQueryClient()

  useSessionSocket(sessionId, (event) => {
    if (!sessionId) return

    switch (event.type) {
      case 'SESSION_STATUS_CHANGED': {
        queryClient.setQueryData(
          sessionKeys.detail(sessionId),
          (session: { status: string } | undefined) =>
            session && { ...session, status: event.data.status },
        )
        break
      }

      case 'QUESTION_CREATED': {
        queryClient.setQueryData(
          questionKeys.list(sessionId),
          (questions: Question[] | undefined) => {
            if (!questions) return questions
            if (questions.some((q) => q.id === event.data.id)) {
              return questions
            }
            return [...questions, event.data]
          },
        )
        break
      }

      case 'QUESTION_UPDATED': {
        const incoming = event.data

        queryClient.setQueryData(
          questionKeys.list(sessionId),
          (questions: Question[] | undefined) =>
            questions?.map((q) =>
              q.id === incoming.id && incoming.updatedAt > q.updatedAt
                ? incoming
                : q,
            ),
        )
        queryClient.setQueryData(
          questionKeys.detail(incoming.id),
          (question: Question | undefined) =>
            !question || incoming.updatedAt > question.updatedAt
              ? incoming
              : question,
        )
        break
      }

      case 'QUESTION_DELETED': {
        queryClient.setQueryData(
          questionKeys.list(sessionId),
          (questions: Question[] | undefined) =>
            questions?.filter((q) => q.id !== event.data.questionId),
        )
        break
      }
    }
  })
}
