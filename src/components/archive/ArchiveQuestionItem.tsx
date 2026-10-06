import { useState } from 'react'

import Card from '@/components/common/Card'
import StatusTag from '@/components/common/StatusTag'
import type { Question } from '@/types/question'

interface ArchiveQuestionItemProps {
  question: Question
  order: number
  defaultExpanded: boolean
}

const itemButtonClassName =
  'border-line text-ink-muted hover:bg-canvas h-7 shrink-0 cursor-pointer rounded-lg border bg-white px-4 text-xs font-medium transition'

export default function ArchiveQuestionItem({
  question,
  order,
  defaultExpanded,
}: ArchiveQuestionItemProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  const aiAnswer = question.answers.find((answer) => answer.type === 'AI')
  const presenterAnswers = question.answers.filter(
    (answer) => answer.type === 'PRESENTER',
  )
  const hasAnswer = Boolean(aiAnswer) || presenterAnswers.length > 0
  const authorName =
    question.anonymous || !question.author ? '익명' : question.author.username

  return (
    <Card as="li" className="flex flex-col rounded-lg p-[21px]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          <StatusTag variant={hasAnswer ? 'info' : 'neutral'}>
            Q{order}
          </StatusTag>
          <div className="flex min-w-0 flex-col gap-2">
            <h4 className="text-ink text-[17px] leading-[25.5px] break-words">
              {question.content}
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-ink-muted text-[13px]">{authorName}</span>
              {aiAnswer ? (
                <StatusTag variant="info">자료 기반 자동 답변</StatusTag>
              ) : presenterAnswers.length > 0 ? (
                <StatusTag variant="request">발표자 답변</StatusTag>
              ) : (
                <StatusTag variant="neutral">기록된 답변이 없어요.</StatusTag>
              )}
            </div>
          </div>
        </div>
        {hasAnswer && (
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
            className={itemButtonClassName}
          >
            {expanded ? '답변 닫기' : '답변 펼치기'}
          </button>
        )}
      </div>

      {hasAnswer && expanded && (
        <div className="border-line mt-4 flex flex-col gap-3 border-t pt-[17px]">
          {aiAnswer && (
            <p className="bg-canvas border-canvas-subtle text-ink rounded-[10px] border p-[17px] text-base break-words whitespace-pre-wrap">
              {aiAnswer.content}
            </p>
          )}
          {presenterAnswers.map((answer) => (
            <div
              key={answer.id}
              className="border-request-line bg-request-bg flex flex-col gap-1 rounded-[10px] border p-[17px]"
            >
              <span className="text-request text-sm font-bold">
                발표자 구두 추가 답변
              </span>
              <p className="text-ink-sub text-sm break-words whitespace-pre-wrap">
                “{answer.content}”
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
