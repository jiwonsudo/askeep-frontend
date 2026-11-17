import { getApiErrorMessage } from '@/api/client'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'

interface DeleteSessionModalProps {
  open: boolean
  /** 지우려는 세션의 제목 */
  title?: string
  pending: boolean
  error: unknown
  /** 종료된 세션이면 질문·답변과 요약도 함께 지워진다고 알린다 */
  ended?: boolean
  onConfirm: () => void
  onClose: () => void
}

/** 세션을 지우기 전에 한 번 더 확인한다 */
export default function DeleteSessionModal({
  open,
  title,
  pending,
  error,
  ended = false,
  onConfirm,
  onClose,
}: DeleteSessionModalProps) {
  return (
    <Modal
      open={open}
      title="세션을 삭제할까요?"
      description={
        ended
          ? `"${title ?? ''}" 세션의 발표 자료, 질문·답변, AI 요약이 모두 삭제되고, 되돌릴 수 없어요.`
          : `"${title ?? ''}" 세션과 올려 둔 발표 자료가 모두 삭제되고, 되돌릴 수 없어요.`
      }
      onClose={onClose}
    >
      {error != null && (
        <p role="alert" className="text-danger text-xs font-medium">
          {getApiErrorMessage(error, '세션을 삭제하지 못했어요.')}
        </p>
      )}
      <Button variant="danger" disabled={pending} onClick={onConfirm}>
        세션 삭제
      </Button>
    </Modal>
  )
}
