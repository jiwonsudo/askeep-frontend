import { useEffect } from 'react'

import logoutConfirmIcon from '@/assets/logout-confirm.svg'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import StatusTag from '@/components/common/StatusTag'

interface LogoutConfirmModalProps {
  open: boolean
  pending: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function LogoutConfirmModal({
  open,
  pending,
  onConfirm,
  onClose,
}: LogoutConfirmModalProps) {
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
        aria-labelledby="logout-confirm-title"
        className="flex w-full max-w-[432px] flex-col items-center gap-4 px-6 py-8 drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.04)] sm:py-[49px]"
        onClick={(event) => event.stopPropagation()}
      >
        <StatusTag>GDGoC SMU 실시간 세션</StatusTag>
        <div className="flex flex-col items-center gap-2 pt-2 text-center">
          <h2
            id="logout-confirm-title"
            className="text-ink text-2xl font-bold break-keep sm:text-[32px] sm:whitespace-nowrap"
          >
            로그아웃 하시겠습니까?
          </h2>
          <p className="text-ink-sub text-sm">
            로그아웃하면 현재 계정에서 연결이 해제됩니다.
          </p>
        </div>
        <img src={logoutConfirmIcon} alt="" className="size-20" />
        <div className="flex w-full flex-col gap-4 pt-3">
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button variant="danger" disabled={pending} onClick={onConfirm}>
            로그아웃
          </Button>
        </div>
      </Card>
    </div>
  )
}
