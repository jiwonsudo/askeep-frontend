import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'

import { getApiErrorMessage } from '@/api/client'
import PageLayout from '@/components/common/PageLayout'
import SessionNavbar from '@/components/common/SessionNavbar'
import Button from '@/components/common/Button'
import Callout from '@/components/common/Callout'
import Icon from '@/components/common/Icon'
import StatusTag from '@/components/common/StatusTag'
import EndSessionModal from '@/components/presenter/EndSessionModal'
import EntryCodeBanner from '@/components/session/EntryCodeBanner'
import PresenterQuestionCard from '@/components/presenter/PresenterQuestionCard'
import { useMe } from '@/hooks/useAuth'
import { useQuestions } from '@/hooks/useQuestion'
import { useEndSession, useSession, useStartSession } from '@/hooks/useSession'
import { useSessionRealtime } from '@/hooks/useSessionRealtime'
import type { Question } from '@/types/question'
import BackLink from '@/components/common/BackLink'
import BrandEyebrow from '@/components/common/BrandEyebrow'
import StateMessage from '@/components/common/StateMessage'

function PresenterSessionContent({ sessionId }: { sessionId: number }) {
  const navigate = useNavigate()
  const me = useMe()
  const session = useSession(sessionId)
  const questions = useQuestions(sessionId)
  const end = useEndSession(sessionId)
  const start = useStartSession(sessionId)
  const [endOpen, setEndOpen] = useState(false)
  useSessionRealtime(sessionId)

  // 발표자가 아닌 사람이 들어오면 청자 화면으로 보낸다
  if (session.data && me.data && session.data.presenterId !== me.data.userId) {
    return <Navigate to={`/sessions/${sessionId}`} replace />
  }

  const ended = session.data?.status === 'ENDED'
  // 입장 코드·링크·QR로 들어오면 시작 전(READY)인데도 이 화면에 올 수 있다. 서버는 시작 전 세션을 종료하지 못하게 한다
  const ready = session.data?.status === 'READY'

  // 아직 답하지 않은 질문을 위로, 그 안에서는 공감이 많은 순 → 직접 답변을 요청한 질문 → 최신 순
  const likes = (question: Question) => question.likeCount
  const all = questions.data?.items ?? []
  const items = [...all].sort(
    (a, b) =>
      Number(a.answered) - Number(b.answered) ||
      likes(b) - likes(a) ||
      Number(b.presenterRequested) - Number(a.presenterRequested) ||
      b.id - a.id,
  )
  // 공감이 더 많은 질문의 수 + 1이 순위. 공감이 없으면 순위를 매기지 않는다
  const rankOf = (question: Question) =>
    likes(question) === 0
      ? null
      : 1 + all.filter((other) => likes(other) > likes(question)).length

  return (
    <PageLayout
      navbar={
        <SessionNavbar
          onExit={() => navigate('/')}
          onEndSession={() => setEndOpen(true)}
          endDisabled={!session.data || ended || ready}
        />
      }
    >
      <main className="flex w-full max-w-[1480px] flex-1 flex-col px-4 pb-12 md:px-10">
        <div className="mt-8 flex items-center justify-between md:mt-12">
          <BackLink to="/">이전</BackLink>
          <StatusTag variant={ended ? 'neutral' : ready ? 'warning' : 'info'}>
            {ended ? '세션 종료' : ready ? '시작 전' : '세션 진행 중'}
          </StatusTag>
        </div>

        <div className="mx-auto mt-6 flex w-full max-w-[1400px] flex-col gap-8 md:mt-9">
          {ready && (
            <div className="flex flex-col gap-3">
              <Callout
                icon={<Icon name="info" className="mt-0.5 size-4 shrink-0" />}
                title="아직 세션을 시작하지 않았어요."
                className="sm:items-center"
              >
                시작해야 청중이 질문을 남길 수 있고, 끝낼 때 세션을 종료할 수
                있어요.
              </Callout>
              <div className="flex flex-wrap gap-3">
                <Button
                  disabled={start.isPending}
                  onClick={() => start.mutate()}
                >
                  세션 시작하기
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/sessions/${sessionId}/materials`)}
                >
                  발표 자료 관리
                </Button>
              </div>
              {start.isError && (
                <p role="alert" className="text-danger text-xs font-medium">
                  {getApiErrorMessage(start.error, '세션을 시작하지 못했어요.')}
                </p>
              )}
            </div>
          )}

          {!ended && session.data?.entryCode && (
            <EntryCodeBanner entryCode={session.data.entryCode} />
          )}

          <header className="flex flex-col gap-1.5">
            <BrandEyebrow />
            <div className="border-line flex flex-col gap-2 border-b pb-[25px]">
              <div className="flex items-center gap-3">
                <h1 className="text-ink text-2xl font-bold sm:text-[32px]">
                  질문
                </h1>
                <span className="bg-info-bg text-brand-deep rounded-full px-3 py-0.5 text-xl font-bold">
                  {questions.data?.totalElements ?? 0}
                </span>
              </div>
              <p className="text-ink-sub text-sm">
                공감이 많은 질문부터 순서대로 말로 답변하고{' '}
                <strong className="text-ink font-bold">'답변 완료'</strong>를
                표시하세요.
              </p>
            </div>
          </header>

          <div className="flex flex-col gap-6">
            {questions.isPending && (
              <StateMessage>질문을 불러오는 중이에요.</StateMessage>
            )}
            {questions.isError && (
              <StateMessage tone="error">
                {getApiErrorMessage(
                  questions.error,
                  '질문을 불러오지 못했어요.',
                )}
              </StateMessage>
            )}
            {questions.isSuccess && items.length === 0 && (
              <StateMessage>아직 들어온 질문이 없어요.</StateMessage>
            )}
            {items.map((question) => (
              <PresenterQuestionCard
                key={question.id}
                question={question}
                rank={rankOf(question)}
              />
            ))}
          </div>
        </div>
      </main>

      <EndSessionModal
        open={endOpen}
        pending={end.isPending}
        error={end.error}
        onClose={() => setEndOpen(false)}
        onConfirm={() =>
          end.mutate(undefined, {
            onSuccess: () =>
              navigate('/archive', { state: { expandedId: sessionId } }),
          })
        }
      />
    </PageLayout>
  )
}

export default function PresenterSessionPage() {
  const { sessionId } = useParams()
  const id = Number(sessionId)

  if (!Number.isInteger(id) || id <= 0) {
    return <Navigate to="/" replace />
  }

  return <PresenterSessionContent sessionId={id} />
}
