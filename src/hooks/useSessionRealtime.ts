import { useQueryClient } from '@tanstack/react-query'

import { questionKeys } from '@/hooks/useQuestion'
import { sessionKeys } from '@/hooks/useSession'
import { useSessionSocket } from '@/hooks/useSessionSocket'
import type { PageResponse } from '@/types/common'
import type { Question } from '@/types/question'
import type { Session } from '@/types/session'

type QuestionPage = PageResponse<Question>

/**
 * 알림은 모두에게 같은 내용이 가서 보는 사람 기준 값이 빠져 있고, 익명 질문의 작성자도 가려져 있다.
 * 갖고 있던 값을 이어 쓴다
 */
const viewerFields = (current: Question, incoming: Question) => ({
  mine: current.mine,
  likedByMe: current.likedByMe,
  // 원래 익명이던 질문만 이어 쓴다. 공개였다가 익명으로 바뀐 질문의 이름을 남기면 안 된다
  author: incoming.author ?? (current.anonymous ? current.author : null),
})

/**
 * 세션 상세/질문 목록 react-query 캐시를 웹소켓 이벤트로 직접 갱신한다.
 * 화면에서 useSession, useQuestions와 함께 호출하면 됨.
 */
export const useSessionRealtime = (sessionId: number | undefined) => {
  const queryClient = useQueryClient()

  // 처음 불러온 뒤 구독이 붙기 전까지, 또는 연결이 끊겼던 동안 놓친 알림이 있을 수 있어서 연결될 때마다 다시 받는다
  const resync = () => {
    if (!sessionId) return

    queryClient.invalidateQueries({ queryKey: sessionKeys.detail(sessionId) })
    queryClient.invalidateQueries({
      queryKey: questionKeys.list(sessionId),
      exact: true,
    })
  }

  useSessionSocket(
    sessionId,
    (event) => {
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
          // 익명 질문은 알림에 작성자가 빠져 있어서, 작성자를 볼 수 있는 사람(발표자·본인)을 위해 목록을 다시 받는다
          if (event.data.anonymous) {
            queryClient.invalidateQueries({
              queryKey: questionKeys.list(sessionId),
              exact: true,
            })
          }

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
                    ? { ...incoming, ...viewerFields(q, incoming) }
                    : q,
                ),
              },
          )
          queryClient.setQueryData(
            questionKeys.detail(incoming.id),
            (question: Question | undefined) =>
              !question || incoming.updatedAt > question.updatedAt
                ? {
                    ...incoming,
                    ...(question && viewerFields(question, incoming)),
                  }
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
    },
    resync,
  )
}
