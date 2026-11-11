import { useState } from 'react'
import type { FormEvent } from 'react'

import Button from '@/components/common/Button'

const MEMO_MAX_LENGTH = 200

interface CompleteMemoFormProps {
  pending: boolean
  /** true면 답변을 꼭 입력해야 한다 (AI 답변 대신 직접 답할 때) */
  required?: boolean
  /** 메모를 비워 두면 빈 문자열로 호출된다 */
  onSubmit: (memo: string) => void
  onCancel: () => void
}

/** "답변 완료"를 누르면 열리는 한 줄 답변 입력. `required`가 아니면 비워 두고 완료해도 된다 */
export default function CompleteMemoForm({
  pending,
  required = false,
  onSubmit,
  onCancel,
}: CompleteMemoFormProps) {
  const [memo, setMemo] = useState('')
  const canSubmit = !pending && (!required || memo.trim().length > 0)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (canSubmit) onSubmit(memo.trim())
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 sm:flex-row sm:items-center"
    >
      <input
        type="text"
        aria-label={required ? '발표자 답변' : '답변 한 줄 메모 (선택)'}
        placeholder={
          required
            ? '청자에게 보여줄 답변을 입력해 주세요'
            : '어떻게 답했는지 한 줄로 남겨 주세요 (선택)'
        }
        maxLength={MEMO_MAX_LENGTH}
        autoFocus
        value={memo}
        onChange={(event) => setMemo(event.target.value)}
        className="border-ink-sub placeholder:text-ink-muted focus:border-brand-deep h-[39px] min-w-0 flex-1 rounded-lg border bg-white px-3.5 text-sm outline-none"
      />
      <div className="flex shrink-0 justify-end gap-2">
        <Button
          variant="secondary"
          className="h-[39px]"
          disabled={pending}
          onClick={onCancel}
        >
          취소
        </Button>
        <Button type="submit" className="h-[39px]" disabled={!canSubmit}>
          완료
        </Button>
      </div>
    </form>
  )
}
