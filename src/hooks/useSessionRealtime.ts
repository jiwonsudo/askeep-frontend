import { useQueryClient } from '@tanstack/react-query'

import { questionKeys } from '@/hooks/useQuestion'
import { sessionKeys } from '@/hooks/useSession'
import { useSessionSocket } from '@/hooks/useSessionSocket'
import type { PageResponse } from '@/types/common'
import type { Question } from '@/types/question'
import type { Session } from '@/types/session'

type QuestionPage = PageResponse<Question>

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
          (session: Session | undefined) =>
            session && { ...session, status: event.data.status },
        )
        // 홈의 참여 중인 세션, 아카이브 목록도 바뀐 상태에 맞춘다
        queryClient.invalidateQueries({ queryKey: ['sessions', 'mine'] })
        break
      }

      case 'QUESTION_CREATED': {
        queryClient.setQueryData(
          questionKeys.list(sessionId),
          (page: QuestionPage | undefined) => {
            if (!page) return page
            if (page.items.some((q) => q.id === event.data.id)) return page
            return {
              ...page,
              items: [...page.items, event.data],
              totalElements: page.totalElements + 1,
            }
          },
        )
        break
      }

      case 'QUESTION_UPDATED': {
        const incoming = event.data

        queryClient.setQueryData(
          questionKeys.list(sessionId),
          (page: QuestionPage | undefined) =>
            page && {
              ...page,
              items: page.items.map((q) =>
                q.id === incoming.id && incoming.updatedAt > q.updatedAt
                  ? { ...incoming, mine: q.mine }
                  : q,
              ),
            },
        )
        queryClient.setQueryData(
          questionKeys.detail(incoming.id),
          (question: Question | undefined) =>
            !question || incoming.updatedAt > question.updatedAt
              ? { ...incoming, mine: question?.mine ?? incoming.mine }
              : question,
        )
        break
      }

      case 'QUESTION_DELETED': {
        queryClient.setQueryData(
          questionKeys.list(sessionId),
          (page: QuestionPage | undefined) =>
            page && {
              ...page,
              items: page.items.filter((q) => q.id !== event.data.questionId),
              totalElements: Math.max(0, page.totalElements - 1),
            },
        )
        break
      }
    }
  })
}
