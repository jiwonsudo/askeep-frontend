import { useEffect } from 'react'
import { Link } from 'react-router'

import StatusTag from '@/components/common/StatusTag'
import Card from '@/components/common/Card'

interface SignupCompleteModalProps {
  open: boolean
  onClose: () => void
}

export default function SignupCompleteModal({
  open,
  onClose,
}: SignupCompleteModalProps) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-complete-title"
        className="flex w-full max-w-[432px] flex-col items-center gap-4 px-6 py-8 drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.04)] sm:py-[49px]"
        onClick={(event) => event.stopPropagation()}
      >
        <StatusTag>GDGoC SMU 실시간 세션</StatusTag>
        <div className="flex flex-col items-center gap-2 pt-2 text-center">
          <h2
            id="signup-complete-title"
            className="text-ink text-2xl font-bold break-keep sm:text-[32px] sm:whitespace-nowrap"
          >
            회원가입이 완료되었습니다.
          </h2>
          <p className="text-ink-sub text-sm">
            ASKeep에 로그인하고 실시간 세션 기능을 이용해보세요.
          </p>
        </div>
        <div className="flex w-full flex-col gap-4 pt-3">
          <Link
            to="/login"
            className="bg-brand hover:bg-brand-deep flex h-12 items-center justify-center rounded-lg px-4 text-sm font-bold text-white transition"
          >
            로그인 바로가기
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="border-line text-ink-button hover:bg-canvas h-12 cursor-pointer rounded-lg border bg-white text-sm font-bold transition"
          >
            닫기
          </button>
        </div>
      </Card>
    </div>
  )
}
