import Icon from '@/components/common/Icon'
import Button from '@/components/common/Button'
import StatusTag from '@/components/common/StatusTag'
import { formatFileSize } from '@/utils/format'
import type { ProcessStatus, SessionMaterial } from '@/types/session'

const statusView: Record<
  ProcessStatus,
  { variant: 'success' | 'warning' | 'danger'; tag: string; text: string }
> = {
  COMPLETED: {
    variant: 'success',
    tag: '준비 완료',
    text: 'AI 지식 인덱싱 완료',
  },
  PROCESSING: {
    variant: 'warning',
    tag: '분석 중',
    text: '자료를 분석하고 있어요',
  },
  PENDING: {
    variant: 'warning',
    tag: '대기 중',
    text: '분석을 기다리고 있어요',
  },
  FAILED: {
    variant: 'danger',
    tag: '분석 실패',
    text: '자료를 분석하지 못했어요',
  },
}

interface MaterialItemProps {
  material: SessionMaterial
  busy: boolean
  onDelete: () => void
  onRetry: () => void
}

export default function MaterialItem({
  material,
  busy,
  onDelete,
  onRetry,
}: MaterialItemProps) {
  const view = statusView[material.status]

  return (
    <li className="border-line flex items-center justify-between gap-3 rounded-lg border bg-white p-[17px]">
      <div className="flex min-w-0 flex-col">
        <span className="text-ink truncate text-base">{material.fileName}</span>
        <span className="text-ink-button text-xs font-medium">
          {formatFileSize(material.fileSize)} • {view.text}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <StatusTag variant={view.variant}>{view.tag}</StatusTag>
        {material.status === 'FAILED' && (
          <Button
            variant="ai"
            className="h-9"
            disabled={busy}
            onClick={onRetry}
          >
            다시 시도
          </Button>
        )}
        <button
          type="button"
          aria-label={`${material.fileName} 삭제`}
          disabled={busy}
          onClick={onDelete}
          className="border-info-bg hover:bg-canvas flex cursor-pointer rounded-lg border p-[11px] transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="trash" className="size-5" />
        </button>
      </div>
    </li>
  )
}
