import { useState } from 'react'

import Icon from '@/components/common/Icon'
import Button from '@/components/common/Button'
import { useRetryAiAnswer } from '@/hooks/useQuestion'
import type { Question } from '@/types/question'

interface AiAnswerProps {
  question: Question
}

const hintClassName = 'text-ink-muted text-xs font-medium'

export default function AiAnswer({ question }: AiAnswerProps) {
  const [expanded, setExpanded] = useState(false)
  const { mutate: retry, isPending } = useRetryAiAnswer(question.id)

  const aiAnswer = question.answers.find((answer) => answer.type === 'AI')

  if (question.aiStatus === 'PENDING' || question.aiStatus === 'PROCESSING') {
    return (
      <p className={hintClassName}>
        자료를 바탕으로 AI가 답변을 준비하고 있어요.
      </p>
    )
  }

  if (question.aiStatus === 'FAILED') {
    return (
      <div className="flex items-center justify-between gap-3">
        <p className={hintClassName}>AI 답변을 만들지 못했어요.</p>
        {question.mine && (
          <Button
            variant="ai"
            className="h-9"
            disabled={isPending}
            onClick={() => retry()}
          >
            다시 시도
          </Button>
        )}
      </div>
    )
  }

  if (!aiAnswer) {
    return <p className={hintClassName}>슬라이드에 명시되지 않은 질문입니다.</p>
  }

  if (!expanded) {
    return (
      <div className="flex items-center justify-between gap-3">
        <Button variant="ai" className="h-9" onClick={() => setExpanded(true)}>
          AI 답변 보기
        </Button>
        <span className={hintClassName}>자료 기반 자동 분석 완료</span>
      </div>
    )
  }

  return (
    <div className="border-info-line bg-info-bg flex flex-col gap-1 rounded-lg border p-[17px]">
      <div className="border-info-line flex items-center gap-1.5 border-b pb-2">
        <span className="bg-brand-deep flex size-5 items-center justify-center rounded">
          <Icon name="sparkles" className="size-4" />
        </span>
        <span className="text-brand-deep text-sm font-bold">
          자료 기반 자동 답변
        </span>
      </div>
      <p className="text-ink pt-2 text-sm break-words whitespace-pre-wrap">
        {aiAnswer.content}
      </p>
      <div className="border-info-line mt-2 flex items-center justify-between gap-3 border-t pt-[9px]">
        <span className="text-ink-button text-xs font-medium">
          ∗ 발표 슬라이드 내용을 바탕으로 작성된 답변입니다.
        </span>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="text-brand-deep flex shrink-0 cursor-pointer items-center gap-1 text-sm"
        >
          접기
          <Icon name="chevron-up" className="size-5" />
        </button>
      </div>
    </div>
  )
}
