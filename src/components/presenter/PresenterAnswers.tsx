import { useState } from 'react'
import type { FormEvent } from 'react'

import { getApiErrorMessage } from '@/api/client'
import Button from '@/components/common/Button'
import Textarea from '@/components/common/Textarea'
import { isVerbalAnswer } from '@/components/presenter/verbalAnswer'
import { useDeleteAnswer, useUpdateAnswer } from '@/hooks/useQuestion'
import type { Question } from '@/types/question'

type Mode = { type: 'closed' } | { type: 'edit'; answerId: number }

interface PresenterAnswersProps {
  question: Question
}

const textButtonClassName =
  'text-ink-muted hover:text-ink cursor-pointer text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50'

/** 질문에 단 발표자 답변을 보여주고, 고치거나 지우는 영역. 새 답변은 "답변 완료"의 한 줄 메모로 남긴다 */
export default function PresenterAnswers({ question }: PresenterAnswersProps) {
  const [mode, setMode] = useState<Mode>({ type: 'closed' })
  const [draft, setDraft] = useState('')

  const updateAnswer = useUpdateAnswer(question.id)
  const deleteAnswer = useDeleteAnswer(question.id)

  const presenterAnswers = question.answers.filter(
    (answer) => answer.type === 'PRESENTER',
  )
  const written = presenterAnswers.filter((answer) => !isVerbalAnswer(answer))
  const hasVerbal = presenterAnswers.some(isVerbalAnswer)

  const submitting = updateAnswer.isPending
  const error = updateAnswer.error ?? deleteAnswer.error
  const canSubmit = draft.trim().length > 0 && !submitting

  const close = () => {
    setMode({ type: 'closed' })
    setDraft('')
    updateAnswer.reset()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit) return

    if (mode.type !== 'edit') return

    updateAnswer.mutate(
      { answerId: mode.answerId, payload: { content: draft.trim() } },
      { onSuccess: close },
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {hasVerbal && (
        <p className="text-ink-muted text-xs font-medium">
          현장에서 말로 답변했어요.
        </p>
      )}

      {written.map((answer) => (
        <div
          key={answer.id}
          className="border-request-line bg-request-bg flex flex-col gap-1.5 rounded-lg border px-[17px] py-3"
        >
          <span className="text-request text-sm font-bold">내 답변</span>
          <p className="text-ink text-sm break-words whitespace-pre-wrap">
            {answer.content}
          </p>
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              className={textButtonClassName}
              disabled={deleteAnswer.isPending}
              onClick={() => {
                setDraft(answer.content)
                setMode({ type: 'edit', answerId: answer.id })
              }}
            >
              수정
            </button>
            <button
              type="button"
              className={textButtonClassName}
              disabled={deleteAnswer.isPending}
              onClick={() => deleteAnswer.mutate(answer.id)}
            >
              삭제
            </button>
          </div>
        </div>
      ))}

      {mode.type === 'edit' && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Textarea
            aria-label="발표자 답변 내용"
            className="min-h-[96px]"
            value={draft}
            autoFocus
            onChange={(event) => setDraft(event.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              className="h-9"
              disabled={submitting}
              onClick={close}
            >
              취소
            </Button>
            <Button type="submit" className="h-9" disabled={!canSubmit}>
              수정 완료
            </Button>
          </div>
        </form>
      )}

      {error != null && (
        <p role="alert" className="text-danger text-xs font-medium">
          {getApiErrorMessage(error, '답변을 저장하지 못했어요.')}
        </p>
      )}
    </div>
  )
}
