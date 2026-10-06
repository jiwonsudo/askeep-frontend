import { Navigate, useParams } from 'react-router'

import { getApiErrorMessage } from '@/api/client'
import PageLayout from '@/components/common/PageLayout'
import StatusTag from '@/components/common/StatusTag'
import QuestionCard from '@/components/question/QuestionCard'
import QuestionForm from '@/components/session/QuestionForm'
import SlideViewer from '@/components/session/SlideViewer'
import { useQuestions } from '@/hooks/useQuestion'
import { useSession } from '@/hooks/useSession'
import { useSessionRealtime } from '@/hooks/useSessionRealtime'
import BrandEyebrow from '@/components/common/BrandEyebrow'
import StateMessage from '@/components/common/StateMessage'
import BackLink from '@/components/common/BackLink'
import Card from '@/components/common/Card'

interface AudienceSessionContentProps {
  sessionId: number
}

function AudienceSessionContent({ sessionId }: AudienceSessionContentProps) {
  const session = useSession(sessionId)
  const questions = useQuestions(sessionId)
  useSessionRealtime(sessionId)

  // 최신 질문이 위로 오도록 정렬
  const items = [...(questions.data?.items ?? [])].sort((a, b) => b.id - a.id)

  return (
    <PageLayout activeMenu="join">
      <main className="flex w-full max-w-[1480px] flex-1 flex-col px-4 pb-12 md:px-10">
        <div className="mt-8 flex items-center justify-between md:mt-12">
          <BackLink to="/">이전</BackLink>
          <StatusTag>세션 참여중</StatusTag>
        </div>

        {session.isError ? (
          <p role="alert" className="text-danger mt-10 text-center text-sm">
            {getApiErrorMessage(
              session.error,
              '세션 정보를 불러오지 못했어요. 입장 코드를 다시 확인해 주세요.',
            )}
          </p>
        ) : (
          <div className="mt-6 grid items-start gap-6 lg:mt-9 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <SlideViewer />
              <QuestionForm
                sessionId={sessionId}
                status={session.data?.status}
              />
            </div>

            <Card as="section" className="border-line-soft p-6 sm:p-8">
              <div className="flex flex-col gap-1.5">
                <BrandEyebrow />
                <div className="border-line flex items-center gap-3 border-b pb-[25px]">
                  <h1 className="text-ink text-2xl font-bold sm:text-[32px]">
                    실시간 질문
                  </h1>
                  <span className="bg-info-bg text-brand-deep rounded-full px-3 py-0.5 text-xl font-bold">
                    {questions.data?.totalElements ?? 0}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4 lg:max-h-[600px] lg:overflow-y-auto lg:pr-1.5">
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
                  <StateMessage>
                    아직 질문이 없어요. 첫 질문을 남겨보세요.
                  </StateMessage>
                )}
                {items.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </div>
            </Card>
          </div>
        )}
      </main>
    </PageLayout>
  )
}

export default function AudienceSessionPage() {
  const { sessionId } = useParams()
  const id = Number(sessionId)

  if (!Number.isInteger(id) || id <= 0) {
    return <Navigate to="/" replace />
  }

  return <AudienceSessionContent sessionId={id} />
}
