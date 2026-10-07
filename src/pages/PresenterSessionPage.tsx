import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'

import { getApiErrorMessage } from '@/api/client'
import PageLayout from '@/components/common/PageLayout'
import SessionNavbar from '@/components/common/SessionNavbar'
import StatusTag from '@/components/common/StatusTag'
import EndSessionModal from '@/components/presenter/EndSessionModal'
import PresenterQuestionCard from '@/components/presenter/PresenterQuestionCard'
import { useMe } from '@/hooks/useAuth'
import { useQuestions } from '@/hooks/useQuestion'
import { useEndSession, useSession } from '@/hooks/useSession'
import { useSessionRealtime } from '@/hooks/useSessionRealtime'
import type { Question } from '@/types/question'
import BackLink from '@/components/common/BackLink'
import BrandEyebrow from '@/components/common/BrandEyebrow'
import StateMessage from '@/components/common/StateMessage'

const isAnswered = (question: Question) =>
  question.answers.some((answer) => answer.type === 'PRESENTER')

function PresenterSessionContent({ sessionId }: { sessionId: number }) {
  const navigate = useNavigate()
  const me = useMe()
  const session = useSession(sessionId)
  const questions = useQuestions(sessionId)
  const end = useEndSession(sessionId)
  const [endOpen, setEndOpen] = useState(false)
  useSessionRealtime(sessionId)

  // 발표자가 아닌 사람이 들어오면 청자 화면으로 보낸다
  if (session.data && me.data && session.data.presenterId !== me.data.userId) {
    return <Navigate to={`/sessions/${sessionId}`} replace />
  }

  const ended = session.data?.status === 'ENDED'

  // 아직 답하지 않은 질문을 위로, 같은 상태끼리는 최신 질문부터 보여준다
  const items = [...(questions.data?.items ?? [])].sort(
    (a, b) => Number(isAnswered(a)) - Number(isAnswered(b)) || b.id - a.id,
  )

  return (
    <PageLayout
      navbar={
        <SessionNavbar
          onExit={() => navigate('/')}
          onEndSession={() => setEndOpen(true)}
          endDisabled={!session.data || ended}
        />
      }
    >
      <main className="flex w-full max-w-[1480px] flex-1 flex-col px-4 pb-12 md:px-10">
        <div className="mt-8 flex items-center justify-between md:mt-12">
          <BackLink to="/">이전</BackLink>
          <StatusTag variant={ended ? 'neutral' : 'info'}>
            {ended ? '세션 종료' : '세션 참여 중'}
          </StatusTag>
        </div>

        <div className="mx-auto mt-6 flex w-full max-w-[1400px] flex-col gap-8 md:mt-9">
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
                질문을 말로 답변하고{' '}
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
              <PresenterQuestionCard key={question.id} question={question} />
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
