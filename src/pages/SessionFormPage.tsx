import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { getApiErrorMessage } from '@/api/client'
import Button from '@/components/common/Button'
import Callout from '@/components/common/Callout'
import Input from '@/components/common/Input'
import PageLayout from '@/components/common/PageLayout'
import StatusTag from '@/components/common/StatusTag'
import Textarea from '@/components/common/Textarea'
import SessionStepHeader from '@/components/session/SessionStepHeader'
import { useMe } from '@/hooks/useAuth'
import {
  useCreateSession,
  useSession,
  useUpdateSession,
} from '@/hooks/useSession'
import type { Session } from '@/types/session'
import Icon from '@/components/common/Icon'
import BrandEyebrow from '@/components/common/BrandEyebrow'
import Card from '@/components/common/Card'

const TITLE_MAX_LENGTH = 100
const DESCRIPTION_MAX_LENGTH = 500

interface SessionFormProps {
  /** 있으면 수정 모드, 없으면 새로 만든다 */
  session?: Session
}

function SessionForm({ session }: SessionFormProps) {
  const navigate = useNavigate()
  const me = useMe()
  const [title, setTitle] = useState(session?.title ?? '')
  const [description, setDescription] = useState(session?.description ?? '')

  const create = useCreateSession()
  const update = useUpdateSession(session?.sessionId ?? 0)
  const { isPending, error } = session ? update : create

  const canSubmit = title.trim().length > 0 && !isPending

  const handleSubmit = (event: FormEvent<HTMLElement>) => {
    event.preventDefault()

    if (!canSubmit) return

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
    }
    const goToMaterials = (sessionId: number) =>
      navigate(`/sessions/${sessionId}/materials`)

    if (session) {
      update.mutate(payload, {
        onSuccess: () => goToMaterials(session.sessionId),
      })
    } else {
      create.mutate(payload, {
        onSuccess: ({ sessionId }) => goToMaterials(sessionId),
      })
    }
  }

  return (
    <main className="mt-8 flex w-full max-w-[720px] flex-1 flex-col gap-6 px-4 pb-12 md:mt-12">
      <SessionStepHeader step={1} />

      <Card
        as="form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 p-6 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:p-[33px]"
      >
        <header className="border-canvas flex flex-col gap-1.5 border-b pb-[25px]">
          <BrandEyebrow />
          <h1 className="pt-0.5 text-2xl font-bold text-[#1e293b] sm:text-[32px]">
            {session ? '세션 정보 수정' : '새 세션 만들기'}
          </h1>
          <p className="text-ink-sub text-sm">세션 정보를 입력해 주세요.</p>
        </header>

        <Input
          label="세션 제목"
          required
          placeholder="예: LLM의 최신 동향과 실제 서비스 적용 사례"
          value={title}
          maxLength={TITLE_MAX_LENGTH}
          helper="청자 화면 및 지식 아카이브에 표시됩니다"
          onChange={(event) => setTitle(event.target.value)}
        />

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-ink text-sm font-bold">
              발표자 <span className="text-danger">*</span>
            </span>
            <StatusTag>현재 로그인 계정</StatusTag>
          </div>
          <div className="border-canvas-subtle bg-canvas-subtle flex h-12 items-baseline gap-2 rounded-lg border px-[17px] py-3">
            <span className="text-base text-[#1e293b]">
              {me.data?.name ?? '-'}
            </span>
            <span className="text-ink-sub text-sm">{me.data?.email}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="session-description"
              className="text-ink text-sm font-bold"
            >
              세션 설명
              <span className="text-ink-muted text-xs font-medium">
                {' '}
                (선택)
              </span>
            </label>
            <span className="text-ink-muted text-sm">
              {description.length}/{DESCRIPTION_MAX_LENGTH}
            </span>
          </div>
          <Textarea
            id="session-description"
            className="border-line-strong min-h-[140px]"
            placeholder="발표할 세션의 간단한 소개나 다룰 내용을 적어주세요. 청자 접속 화면과 질의응답 창 상단에 안내됩니다."
            value={description}
            maxLength={DESCRIPTION_MAX_LENGTH}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <Callout
          className="gap-3.5"
          contentClassName="gap-1"
          titleClassName="text-[#1e293b]"
          icon={
            <span className="bg-info-line flex size-8 shrink-0 items-center justify-center rounded-full">
              <Icon name="callout-info" className="size-[16.7px]" />
            </span>
          }
          title="입장 코드 발급 안내"
        >
          세션을 만들면 참여용 코드가 자동으로 발급됩니다.
        </Callout>

        {error && (
          <p role="alert" className="text-danger text-xs font-medium">
            {getApiErrorMessage(
              error,
              '세션을 저장하지 못했어요. 잠시 후 다시 시도해 주세요.',
            )}
          </p>
        )}

        <div className="border-canvas flex items-center justify-end gap-3 border-t pt-px">
          <Link
            to="/"
            className="text-ink-sub flex h-12 items-center rounded-lg px-6 text-[17px] font-bold"
          >
            취소
          </Link>
          <Button
            type="submit"
            disabled={!canSubmit}
            className="px-8 text-[17px]"
            rightIcon={
              <Icon name="arrow-right-small" className="size-[13.3px]" />
            }
          >
            {session ? '저장하고 다음 단계' : '세션 자료 등록하기'}
          </Button>
        </div>
      </Card>
    </main>
  )
}

export default function SessionFormPage() {
  const { sessionId } = useParams()
  const id = sessionId === undefined ? undefined : Number(sessionId)

  // 수정 모드는 기존 값이 도착한 뒤에 폼을 띄워 초기값을 채운다
  const session = useSession(id ?? 0, { enabled: id !== undefined })

  return (
    <PageLayout activeMenu="join">
      {id === undefined ? (
        <SessionForm />
      ) : session.data ? (
        <SessionForm session={session.data} />
      ) : (
        <p className="text-ink-muted mt-20 text-sm">
          {session.isError
            ? '세션 정보를 불러오지 못했어요.'
            : '세션 정보를 불러오는 중이에요.'}
        </p>
      )}
    </PageLayout>
  )
}
