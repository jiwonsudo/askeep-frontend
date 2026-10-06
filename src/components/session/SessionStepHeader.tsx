import Icon from '@/components/common/Icon'
import StatusTag from '@/components/common/StatusTag'
import BackLink from '@/components/common/BackLink'

interface SessionStepHeaderProps {
  step: 1 | 2
}

/** 세션 만들기 단계 표시줄 (세션 목록으로 돌아가기 + Step 1 → Step 2) */
export default function SessionStepHeader({ step }: SessionStepHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <BackLink to="/">세션 목록</BackLink>
      <div
        className="flex items-center gap-2"
        aria-label={`${step}단계 진행 중`}
      >
        <StatusTag variant={step === 1 ? 'info' : 'neutral'}>
          Step 1. 정보입력
        </StatusTag>
        <Icon name="step-arrow" className="size-5 -scale-x-100" />
        <StatusTag variant={step === 2 ? 'info' : 'neutral'}>
          Step 2. 자료 업로드
        </StatusTag>
      </div>
    </div>
  )
}
