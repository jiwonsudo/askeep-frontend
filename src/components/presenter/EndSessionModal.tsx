import { getApiErrorMessage } from '@/api/client'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'

interface EndSessionModalProps {
  open: boolean
  pending: boolean
  error: unknown
  onConfirm: () => void
  onClose: () => void
}

export default function EndSessionModal({
  open,
  pending,
  error,
  onConfirm,
  onClose,
}: EndSessionModalProps) {
  return (
    <Modal
      open={open}
      title="세션을 종료할까요?"
      description="종료하면 더 이상 질문을 받을 수 없고, AI가 세션 요약을 만들어 아카이브에 저장해요."
      onClose={onClose}
    >
      {error != null && (
        <p role="alert" className="text-danger text-xs font-medium">
          {getApiErrorMessage(error, '세션을 종료하지 못했어요.')}
        </p>
      )}
      <Button variant="danger" disabled={pending} onClick={onConfirm}>
        세션 종료
      </Button>
    </Modal>
  )
}
