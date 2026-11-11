import { useState } from 'react'
import { useNavigate } from 'react-router'

import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Icon from '@/components/common/Icon'
import StatusTag from '@/components/common/StatusTag'
import DeleteSessionModal from '@/components/session/DeleteSessionModal'
import { useMe } from '@/hooks/useAuth'
import { useDeleteSession, useMySessions } from '@/hooks/useSession'
import type { MySession, ParticipantRoleType, Session } from '@/types/session'
import { formatDateTime, parseServerDate } from '@/utils/date'
import { hideSession, loadHiddenSessions } from '@/utils/hiddenSessionStorage'

/** 한 목록에 보여줄 최대 개수. 오래 방치된 세션이 홈을 채우지 않게 한다 */
const MAX_PER_GROUP = 5

/** 내가 맡은 역할별로 목록을 나눈다. 이름은 이 두 가지로만 부른다 */
const GROUPS: { role: ParticipantRoleType; title: string }[] = [
  { role: 'PRESENTER', title: '내가 연 세션' },
  { role: 'AUDIENCE', title: '참여 중인 세션' },
]

/** 시작 전이거나 진행 중인 세션만 "다시 들어갈 수 있는 세션"으로 본다. 종료된 세션은 빠진다 */
const isLive = ({ session }: MySession) => session.status !== 'ENDED'

/** 최근에 입장했거나 만든 세션이 위로 오게 한다 */
const recentTime = ({ joinedAt, session }: MySession) =>
  parseServerDate(joinedAt ?? session.createdAt).getTime()
const recentFirst = (a: MySession, b: MySession) =>
  recentTime(b) - recentTime(a)

/** 역할과 세션 상태에 따라 다시 들어갈 화면과 버튼 이름이 달라진다 */
const getAction = ({ myRole, session }: MySession) => {
  if (myRole === 'PRESENTER') {
    return session.status === 'READY'
      ? { label: '자료 등록', to: `/sessions/${session.sessionId}/materials` }
      : { label: '발표 화면', to: `/sessions/${session.sessionId}/present` }
  }

  return { label: '입장', to: `/sessions/${session.sessionId}` }
}

/** 화면을 벗어난 뒤에도 입장 코드 없이 다시 들어갈 수 있는 세션 목록 */
export default function MyLiveSessions() {
  const navigate = useNavigate()
  const { data } = useMySessions()
  const myId = useMe().data?.userId
  const deleteSession = useDeleteSession()
  const [deleteTarget, setDeleteTarget] = useState<Session>()
  // 숨긴 목록은 브라우저 저장소에 있어서, 숨길 때 다시 그리도록 신호만 준다
  const [, setHiddenVersion] = useState(0)

  const hidden = myId === undefined ? [] : loadHiddenSessions(myId)
  const live = (data ?? [])
    .filter(isLive)
    .filter(
      ({ myRole, session }) =>
        myRole !== 'AUDIENCE' || !hidden.includes(session.sessionId),
    )
    .sort(recentFirst)

  const hide = (sessionId: number) => {
    if (myId === undefined) return

    hideSession(myId, sessionId)
    setHiddenVersion((version) => version + 1)
  }

  const closeDelete = () => {
    setDeleteTarget(undefined)
    deleteSession.reset()
  }

  return (
    <>
      {GROUPS.map(({ role, title }) => {
        const sessions = live
          .filter((item) => item.myRole === role)
          .slice(0, MAX_PER_GROUP)

        if (sessions.length === 0) return null

        return (
          <section
            key={role}
            aria-labelledby={`live-sessions-${role}`}
            className="flex flex-col gap-3"
          >
            <h2
              id={`live-sessions-${role}`}
              className="text-ink text-sm font-bold"
            >
              {title}
            </h2>
            <ul className="flex flex-col gap-2">
              {sessions.map((item) => {
                const { session } = item
                const action = getAction(item)

                return (
                  <li key={session.sessionId}>
                    <Card className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="flex min-w-0 flex-col gap-1.5">
                        <span className="text-ink truncate text-sm font-medium">
                          {session.title}
                        </span>
                        {session.startedAt && (
                          <span className="text-ink-muted text-xs font-medium">
                            {formatDateTime(session.startedAt)} 시작
                          </span>
                        )}
                        <div>
                          <StatusTag
                            variant={
                              session.status === 'READY' ? 'warning' : 'success'
                            }
                          >
                            {session.status === 'READY' ? '시작 전' : '진행 중'}
                          </StatusTag>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {/* 시작 전인 내 세션만 지울 수 있다 */}
                        {role === 'PRESENTER' && session.status === 'READY' && (
                          <button
                            type="button"
                            aria-label={`${session.title} 삭제`}
                            onClick={() => setDeleteTarget(session)}
                            className="border-info-bg hover:bg-canvas flex cursor-pointer rounded-lg border p-2 transition"
                          >
                            <Icon name="trash" className="size-5" />
                          </button>
                        )}
                        {/* 참여 취소 API가 없어서 이 목록에서만 뺀다 */}
                        {role === 'AUDIENCE' && (
                          <button
                            type="button"
                            aria-label={`${session.title} 목록에서 숨기기`}
                            title="목록에서 숨기기"
                            onClick={() => hide(session.sessionId)}
                            className="text-ink-muted hover:bg-canvas hover:text-ink flex size-9 cursor-pointer items-center justify-center rounded-lg transition"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 20 20"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.75"
                              strokeLinecap="round"
                              aria-hidden="true"
                            >
                              <path d="M5 5l10 10M15 5L5 15" />
                            </svg>
                          </button>
                        )}
                        <Button
                          variant="outline"
                          className="h-9"
                          onClick={() => navigate(action.to)}
                        >
                          {action.label}
                        </Button>
                      </div>
                    </Card>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}

      <DeleteSessionModal
        open={deleteTarget !== undefined}
        title={deleteTarget?.title}
        pending={deleteSession.isPending}
        error={deleteSession.error}
        onClose={closeDelete}
        onConfirm={() => {
          if (!deleteTarget) return

          deleteSession.mutate(deleteTarget.sessionId, {
            onSuccess: closeDelete,
          })
        }}
      />
    </>
  )
}
