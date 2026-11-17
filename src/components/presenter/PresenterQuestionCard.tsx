import { useState } from 'react'

import { getApiErrorMessage } from '@/api/client'
import Icon from '@/components/common/Icon'
import Button from '@/components/common/Button'
import StatusTag from '@/components/common/StatusTag'
import Markdown from '@/components/common/Markdown'
import LikeRank from '@/components/presenter/LikeRank'
import CompleteMemoForm from '@/components/presenter/CompleteMemoForm'
import PresenterAnswers from '@/components/presenter/PresenterAnswers'
import AnswerSources from '@/components/question/AnswerSources'
import { useCreateAnswer, useSetQuestionAnswered } from '@/hooks/useQuestion'
import { formatRelativeTime } from '@/utils/date'
import type { Question } from '@/types/question'
import Card from '@/components/common/Card'
import { getAnswerResolution, resolutionLabel } from '@/utils/answerResolution'
import { formatAuthorName } from '@/utils/format'

/**
 * 완료 처리 단계.
 * - choose: AI 답변이 있을 때 "AI 답변으로 완료"와 "직접 답변 달기" 중 고른다
 * - write: 직접 답변 입력 (AI 답변이 있으면 내용 필수)
 */
type CompleteStep = 'idle' | 'choose' | 'write'

interface PresenterQuestionCardProps {
  question: Question
  /** 공감 순위. 공감이 하나도 없으면 null */
  rank: number | null
}

export default function PresenterQuestionCard({
  question,
  rank,
}: PresenterQuestionCardProps) {
  const [aiOpen, setAiOpen] = useState(false)
  const [step, setStep] = useState<CompleteStep>('idle')
  const createAnswer = useCreateAnswer(question.id)
  const setAnswered = useSetQuestionAnswered(question.id)

  const aiAnswer = question.answers.find((answer) => answer.type === 'AI')
  const resolution = getAnswerResolution(question)
  const done = resolution !== 'NONE'
  const pending = createAnswer.isPending || setAnswered.isPending
  const error = createAnswer.error ?? setAnswered.error

  const authorName = formatAuthorName(question)
  const close = { onSuccess: () => setStep('idle') }

  // AI 답변이 있으면 어떻게 마무리할지 먼저 고르고, 판단할 수 있게 AI 답변도 펼친다
  const startCompleting = () => {
    if (aiAnswer) {
      setAiOpen(true)
      setStep('choose')
    } else {
      setStep('write')
    }
  }

  // 답변을 쓰면 답변으로 남고(서버가 완료로 함께 표시한다), 비우면 완료 표시만 한다
  const submitAnswer = (memo: string) => {
    if (memo) createAnswer.mutate({ content: memo }, close)
    else setAnswered.mutate(true, close)
  }

  return (
    <Card
      as="article"
      className="flex flex-col gap-2 p-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:p-[25px]"
    >
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:gap-6">
        <LikeRank count={question.likeCount} rank={rank} />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-ink-sub text-xs font-medium">
              {authorName}
            </span>
            <span className="text-line text-xs">•</span>
            <time className="text-ink-sub text-xs font-medium">
              {formatRelativeTime(question.createdAt)}
            </time>
            {resolution !== 'NONE' ? (
              <StatusTag variant={resolution === 'AI' ? 'info' : 'success'}>
                {resolutionLabel[resolution]}
              </StatusTag>
            ) : (
              <StatusTag variant="warning">미답변</StatusTag>
            )}
            {question.presenterRequested && !done && (
              <StatusTag variant="request">직접 답변 요청</StatusTag>
            )}
            {aiAnswer && <StatusTag>AI 답변됨</StatusTag>}
          </div>

          <h2
            className={`text-lg font-bold break-words sm:text-xl ${
              done ? 'text-ink-muted' : 'text-ink'
            }`}
          >
            {question.content}
          </h2>

          {aiAnswer ? (
            <button
              type="button"
              aria-expanded={aiOpen}
              onClick={() => setAiOpen((value) => !value)}
              className={`flex w-fit cursor-pointer items-center gap-1.5 py-1 text-sm ${
                aiOpen ? 'text-brand-deep' : 'text-ink-button'
              }`}
            >
              <Icon
                name={aiOpen ? 'sparkles-blue' : 'sparkles-gray'}
                className="size-4"
              />
              {aiOpen ? 'AI 답변 접기' : 'AI 답변 보기'}
              <Icon
                name={aiOpen ? 'chevron-down-blue' : 'chevron-down-gray'}
                className={`size-5 ${aiOpen ? 'rotate-180' : ''}`}
              />
            </button>
          ) : (
            <p className="text-ink-muted text-xs font-medium">
              {question.aiStatus === 'PENDING' ||
              question.aiStatus === 'PROCESSING'
                ? 'AI가 답변을 준비하고 있어요.'
                : question.aiStatus === 'FAILED'
                  ? 'AI 답변을 만들지 못했어요.'
                  : '슬라이드에 근거가 없어 AI가 답하지 않았어요.'}
            </p>
          )}

          {aiAnswer && aiOpen && (
            <div className="border-info-line bg-info-bg flex flex-col gap-[7px] rounded-lg border p-[17px]">
              <div className="border-info-line/60 flex items-center gap-1.5 border-b pb-[9px]">
                <Icon name="book-open" className="size-3.5" />
                <span className="text-brand-deep text-sm font-bold">
                  자료 기반 자동 답변
                </span>
              </div>
              <Markdown className="text-ink text-base">
                {aiAnswer.content}
              </Markdown>
              <AnswerSources sources={aiAnswer.sources} />
            </div>
          )}

          <PresenterAnswers question={question} />

          {step === 'choose' && (
            <div className="border-line flex flex-col gap-3 rounded-lg border p-4">
              <p className="text-ink text-sm font-bold">
                이 질문을 어떻게 마무리할까요?
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  variant="ai"
                  className="h-[39px]"
                  disabled={pending}
                  onClick={() => setAnswered.mutate(true, close)}
                >
                  AI 답변으로 완료
                </Button>
                <Button
                  variant="outline"
                  className="h-[39px]"
                  disabled={pending}
                  onClick={() => setStep('write')}
                >
                  직접 답변 달기
                </Button>
                <Button
                  variant="secondary"
                  className="h-[39px] sm:ml-auto"
                  disabled={pending}
                  onClick={() => setStep('idle')}
                >
                  취소
                </Button>
              </div>
              <p className="text-ink-muted text-xs font-medium">
                AI 답변으로 충분하면 그대로 완료하고, 보충할 내용이 있으면 직접
                답변을 남겨 주세요. 직접 답변은 AI 답변과 함께 보여요.
              </p>
            </div>
          )}

          {step === 'write' && (
            <CompleteMemoForm
              pending={pending}
              required={Boolean(aiAnswer)}
              onSubmit={submitAnswer}
              onCancel={() => setStep('idle')}
            />
          )}
        </div>

        {step === 'idle' && (
          <div className="flex shrink-0 flex-row-reverse items-center gap-4 pt-0.5 sm:flex-col sm:items-end sm:gap-2">
            <Button
              variant={done ? 'secondary' : 'primary'}
              className={`h-[39px] ${done ? 'text-ink-muted' : ''}`}
              disabled={pending}
              onClick={done ? () => setAnswered.mutate(false) : startCompleting}
            >
              {done ? '완료됨 (취소)' : '답변 완료'}
            </Button>
            {/* AI 답변으로 마무리한 뒤에도 보충 답변을 남길 수 있다 */}
            {resolution === 'AI' && (
              <button
                type="button"
                disabled={pending}
                onClick={() => setStep('write')}
                className="text-ink-button hover:text-ink cursor-pointer text-xs font-medium underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                직접 답변 추가
              </button>
            )}
          </div>
        )}
      </div>

      {error != null && (
        <p role="alert" className="text-danger text-xs font-medium">
          {getApiErrorMessage(error, '답변 상태를 바꾸지 못했어요.')}
        </p>
      )}
    </Card>
  )
}
