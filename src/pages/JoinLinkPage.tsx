import { useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { getApiErrorMessage } from '@/api/client'
import PageLayout from '@/components/common/PageLayout'
import Spinner from '@/components/common/Spinner'
import StateMessage from '@/components/common/StateMessage'
import { useMe } from '@/hooks/useAuth'
import { useJoinSessionByEntryCode } from '@/hooks/useSession'
import { unhideSession } from '@/utils/hiddenSessionStorage'

const ENTRY_CODE_PATTERN = /^[A-Z0-9]{6}$/

/** 발표자가 공유한 링크(/join/:entryCode)로 들어오면 입장 코드 입력 없이 바로 세션에 참여시킨다 */
export default function JoinLinkPage() {
  const navigate = useNavigate()
  const me = useMe()
  const entryCode = (useParams().entryCode ?? '').toUpperCase()
  const isValid = ENTRY_CODE_PATTERN.test(entryCode)
  const { mutate: join, error } = useJoinSessionByEntryCode()
  // StrictMode에서 effect가 두 번 돌아도 참여 요청은 한 번만 보낸다
  const requested = useRef(false)

  useEffect(() => {
    if (!isValid || requested.current) return
    requested.current = true

    join(
      { entryCode },
      {
        onSuccess: ({ sessionId }) => {
          if (me.data) unhideSession(me.data.userId, sessionId)
          navigate(`/sessions/${sessionId}`, { replace: true })
        },
      },
    )
  }, [entryCode, isValid, join, me.data, navigate])

  const failed = !isValid || error

  return (
    <PageLayout activeMenu="join">
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16">
        {failed ? (
          <>
            <StateMessage tone="error" className="py-0">
              {isValid
                ? getApiErrorMessage(
                    error,
                    '세션에 참여하지 못했어요. 링크가 맞는지 확인해 주세요.',
                  )
                : '올바르지 않은 참여 링크예요.'}
            </StateMessage>
            <Link
              to="/"
              replace
              className="text-brand text-sm font-bold underline"
            >
              입장 코드 직접 입력하기
            </Link>
          </>
        ) : (
          <>
            <Spinner className="text-brand size-6" />
            <StateMessage className="py-0">
              세션에 들어가는 중이에요…
            </StateMessage>
          </>
        )}
      </main>
    </PageLayout>
  )
}
