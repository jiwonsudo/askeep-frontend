import { useEffect } from 'react'

import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import StatusTag from '@/components/common/StatusTag'

interface LeaveMaterialsModalProps {
  open: boolean
  pending: boolean
  onConfirm: () => void
  onClose: () => void
}

/** 자료를 등록하거나 분석하는 중에 다른 화면으로 가려 할 때 한 번 더 확인한다 */
export default function LeaveMaterialsModal({
  open,
  pending,
  onConfirm,
  onClose,
}: LeaveMaterialsModalProps) {
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
        aria-labelledby="leave-materials-title"
        className="flex w-full max-w-[432px] flex-col items-center gap-4 px-6 py-8 drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.04)] sm:py-[49px]"
        onClick={(event) => event.stopPropagation()}
      >
        <StatusTag variant="warning">자료 등록 중</StatusTag>
        <div className="flex flex-col items-center gap-2 pt-2 text-center">
          <h2
            id="leave-materials-title"
            className="text-ink text-2xl font-bold break-keep"
          >
            지금 이동하면 등록 중인 자료는 삭제돼요. 계속할까요?
          </h2>
          <p className="text-ink-sub text-sm">
            등록이 끝난 자료는 그대로 유지돼요.
          </p>
        </div>
        <div className="flex w-full flex-col gap-4 pt-3">
          <Button variant="secondary" disabled={pending} onClick={onClose}>
            취소
          </Button>
          <Button variant="danger" disabled={pending} onClick={onConfirm}>
            계속 이동하기
          </Button>
        </div>
      </Card>
    </div>
  )
}
