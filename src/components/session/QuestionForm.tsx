import { useState } from 'react'
import type { FormEvent } from 'react'

import { getApiErrorMessage } from '@/api/client'
import Button from '@/components/common/Button'
import Checkbox from '@/components/common/Checkbox'
import Textarea from '@/components/common/Textarea'
import { useCreateQuestion } from '@/hooks/useQuestion'
import type { SessionStatus } from '@/types/session'
import Icon from '@/components/common/Icon'
import Card from '@/components/common/Card'

const MAX_LENGTH = 300

/** 질문은 진행 중인 세션에서만 받을 수 있다(그 외에는 서버가 409를 돌려준다) */
const closedMessage: Partial<Record<SessionStatus, string>> = {
  READY: '발표가 시작되면 질문을 보낼 수 있어요.',
  ENDED: '종료된 세션에서는 질문을 보낼 수 없어요.',
}

interface QuestionFormProps {
  sessionId: number
  /** 세션 정보가 아직 없으면 undefined */
  status?: SessionStatus
}

export default function QuestionForm({ sessionId, status }: QuestionFormProps) {
  const disabled = status !== 'ONGOING'
  const [content, setContent] = useState('')
  const [anonymous, setAnonymous] = useState(true)
  const {
    mutate: createQuestion,
    isPending,
    error,
  } = useCreateQuestion(sessionId)

  const canSubmit = content.trim().length > 0 && !disabled && !isPending

  const handleSubmit = (event: FormEvent<HTMLElement>) => {
    event.preventDefault()

    if (!canSubmit) return

    createQuestion(
      { content: content.trim(), anonymous },
      { onSuccess: () => setContent('') },
    )
  }

  return (
    <Card
      as="form"
      onSubmit={handleSubmit}
      className="border-line-soft flex flex-col gap-4 p-6"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-ink flex items-center gap-1 text-xl font-bold">
          <Icon name="speech" className="size-5" />
          발표자에게 질문하기
        </h2>
        <span className="text-ink-muted text-xs font-medium">
          {content.length} / {MAX_LENGTH}자
        </span>
      </div>
      <Textarea
        aria-label="질문 내용"
        placeholder="발표를 들으며 궁금한 점을 남겨보세요."
        value={content}
        maxLength={MAX_LENGTH}
        disabled={disabled}
        error={Boolean(error)}
        onChange={(event) => setContent(event.target.value)}
      />
      {error && (
        <p role="alert" className="text-danger text-xs font-medium">
          {getApiErrorMessage(
            error,
            '질문을 보내지 못했어요. 다시 시도해 주세요.',
          )}
        </p>
      )}
      {disabled && status && (
        <p className="text-ink-muted text-xs font-medium">
          {closedMessage[status] ?? '지금은 질문을 보낼 수 없어요.'}
        </p>
      )}
      <div className="flex items-center justify-between gap-3">
        <Checkbox
          label="익명으로 질문하기"
          checked={anonymous}
          disabled={disabled}
          onChange={(event) => setAnonymous(event.target.checked)}
        />
        <Button
          type="submit"
          disabled={!canSubmit}
          className="h-11"
          rightIcon={<Icon name="send" className="size-5 -rotate-90" />}
        >
          질문 보내기
        </Button>
      </div>
    </Card>
  )
}
