import { useState } from 'react'
import { useNavigate } from 'react-router'
import type { FormEvent } from 'react'

import { getApiErrorMessage } from '@/api/client'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import AuthCard from '@/components/auth/AuthCard'
import PageLayout from '@/components/common/PageLayout'
import { useJoinSessionByEntryCode } from '@/hooks/useSession'
import Icon from '@/components/common/Icon'

const ENTRY_CODE_LENGTH = 6
const ENTRY_CODE_PATTERN = /^[A-Za-z0-9]{6}$/

export default function SessionJoinPage() {
  const navigate = useNavigate()
  const [entryCode, setEntryCode] = useState('')
  const { mutate: join, isPending, error } = useJoinSessionByEntryCode()

  const isValid = ENTRY_CODE_PATTERN.test(entryCode)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isValid || isPending) return

    join(
      { entryCode },
      { onSuccess: ({ sessionId }) => navigate(`/sessions/${sessionId}`) },
    )
  }

  return (
    <PageLayout activeMenu="join">
      <AuthCard
        title="세션에 참여하기"
        description="발표자가 공유한 입장코드를 입력해 주세요."
        className="md:pt-[88px]"
        footer={
          <p className="text-ink-muted flex items-start justify-center gap-2 pt-1 pb-2 text-sm">
            <span className="flex size-4 shrink-0 items-center justify-center">
              <Icon name="info" className="size-[14.83px]" />
            </span>
            <span className="pr-[7px] break-keep">
              6자리 영문·숫자 코드를 입력하면 질문 화면으로 바로 연결됩니다.
            </span>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-3">
          <Input
            label="입장코드"
            required
            placeholder="예: ABC123"
            value={entryCode}
            maxLength={ENTRY_CODE_LENGTH}
            autoComplete="off"
            autoCapitalize="characters"
            helper={`${entryCode.length}/${ENTRY_CODE_LENGTH}`}
            error={
              error
                ? getApiErrorMessage(
                    error,
                    '세션에 참여하지 못했어요. 입장코드를 다시 확인해 주세요.',
                  )
                : undefined
            }
            onChange={(event) =>
              setEntryCode(event.target.value.replace(/[^A-Za-z0-9]/g, ''))
            }
          />
          <Button
            type="submit"
            disabled={!isValid || isPending}
            rightIcon={
              <Icon name="arrow-right" className="size-5 -scale-x-100" />
            }
          >
            세션 참여하기
          </Button>
        </form>
      </AuthCard>
    </PageLayout>
  )
}
