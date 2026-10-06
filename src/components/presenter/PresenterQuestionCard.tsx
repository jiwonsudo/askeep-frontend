import { useState } from 'react'

import { getApiErrorMessage } from '@/api/client'
import Icon from '@/components/common/Icon'
import Button from '@/components/common/Button'
import StatusTag from '@/components/common/StatusTag'
import { useCreateAnswer, useDeleteAnswer } from '@/hooks/useQuestion'
import { formatRelativeTime } from '@/utils/date'
import type { Question } from '@/types/question'
import Card from '@/components/common/Card'

/**
 * 백엔드에 "답변 완료" 표시 전용 API가 없어서, 발표자 답변(PRESENTER)을
 * 하나 남기는 것으로 완료를 표현한다. 답변 내용은 필수라 고정 문구를 쓴다.
 */
const DONE_ANSWER_CONTENT = '발표자가 현장에서 구두로 답변했어요.'

interface PresenterQuestionCardProps {
  question: Question
}

export default function PresenterQuestionCard({
  question,
}: PresenterQuestionCardProps) {
  const [aiOpen, setAiOpen] = useState(false)
  const createAnswer = useCreateAnswer(question.id)
  const deleteAnswer = useDeleteAnswer(question.id)

  const aiAnswer = question.answers.find((answer) => answer.type === 'AI')
  const presenterAnswers = question.answers.filter(
    (answer) => answer.type === 'PRESENTER',
  )
  const done = presenterAnswers.length > 0
  const pending = createAnswer.isPending || deleteAnswer.isPending
  const error = createAnswer.error ?? deleteAnswer.error

  const authorName =
    question.anonymous || !question.author ? '익명' : question.author.username

  const toggleDone = async () => {
    if (done) {
      for (const answer of presenterAnswers) {
        await deleteAnswer.mutateAsync(answer.id).catch(() => undefined)
      }
    } else {
      createAnswer.mutate({ content: DONE_ANSWER_CONTENT })
    }
  }

  return (
    <Card
      as="article"
      className="flex flex-col gap-2 p-[25px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-ink-sub text-xs font-medium">
              {authorName}
            </span>
            <span className="text-line text-xs">•</span>
            <time className="text-ink-sub text-xs font-medium">
              {formatRelativeTime(question.createdAt)}
            </time>
            {done ? (
              <StatusTag variant="success">발표자 답변 완료</StatusTag>
            ) : (
              <StatusTag variant="warning">미답변</StatusTag>
            )}
            {aiAnswer && <StatusTag>AI 답변됨</StatusTag>}
          </div>

          <h2
            className={`text-xl font-bold break-words ${
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
              <p className="text-ink text-base leading-[25px] font-medium break-words whitespace-pre-wrap">
                {aiAnswer.content}
              </p>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1 pt-0.5">
          <Button
            variant={done ? 'secondary' : 'primary'}
            className={`h-[39px] ${done ? 'text-ink-muted' : ''}`}
            disabled={pending}
            onClick={toggleDone}
          >
            {done ? '완료됨 (취소)' : '답변 완료'}
          </Button>
        </div>
      </div>

      {error != null && (
        <p role="alert" className="text-danger text-xs font-medium">
          {getApiErrorMessage(error, '답변 상태를 바꾸지 못했어요.')}
        </p>
      )}
    </Card>
  )
}
