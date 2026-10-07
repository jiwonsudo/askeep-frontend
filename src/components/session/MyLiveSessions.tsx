import { useNavigate } from 'react-router'

import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import StatusTag from '@/components/common/StatusTag'
import { useMySessions } from '@/hooks/useSession'
import type { MySession, ParticipantRoleType } from '@/types/session'
import { parseServerDate } from '@/utils/date'

/** 한 목록에 보여줄 최대 개수. 오래 방치된 세션이 홈을 채우지 않게 한다 */
const MAX_PER_GROUP = 5

/** 내가 맡은 역할별로 목록을 나눈다. 이름은 이 두 가지로만 부른다 */
const GROUPS: { role: ParticipantRoleType; title: string }[] = [
  { role: 'PRESENTER', title: '내가 연 세션' },
  { role: 'AUDIENCE', title: '참여 중인 세션' },
]

/** 시작 전이거나 진행 중인 세션만 "다시 들어갈 수 있는 세션"으로 본다. 종료된 세션은 빠진다 */
const isLive = ({ session }: MySession) =>
  session.status === 'READY' || session.status === 'ONGOING'

/** 최근에 시작했거나 만든 세션이 위로 오게 한다 */
const recentFirst = (a: MySession, b: MySession) =>
  parseServerDate(b.session.startedAt ?? b.session.createdAt).getTime() -
  parseServerDate(a.session.startedAt ?? a.session.createdAt).getTime()

/** 역할과 세션 상태에 따라 다시 들어갈 화면과 버튼 이름이 달라진다 */
const getAction = ({ myRole, session }: MySession) => {
  if (myRole === 'PRESENTER') {
    return session.status === 'READY'
      ? { label: '자료 등록', to: `/sessions/${session.sessionId}/materials` }
      : { label: '발표 화면', to: `/sessions/${session.sessionId}/present` }
  }

  return { label: '입장', to: `/sessions/${session.sessionId}` }
}

/**
 * 다시 들어갈 수 있는 세션 목록.
 * 청자는 입장 코드를 발표자만 볼 수 있어서, 이 목록이 없으면 화면을 벗어난 뒤
 * 매번 코드를 다시 받아야 한다.
 */
export default function MyLiveSessions() {
  const navigate = useNavigate()
  const { data } = useMySessions()

  const live = (data ?? []).filter(isLive).sort(recentFirst)

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
                      <Button
                        variant="outline"
                        className="h-9 shrink-0"
                        onClick={() => navigate(action.to)}
                      >
                        {action.label}
                      </Button>
                    </Card>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </>
  )
}
