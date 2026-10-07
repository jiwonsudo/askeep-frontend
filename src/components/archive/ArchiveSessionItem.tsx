import ArchiveQuestionList from '@/components/archive/ArchiveQuestionList'
import SessionSummary from '@/components/archive/SessionSummary'
import Button from '@/components/common/Button'
import StatusTag from '@/components/common/StatusTag'
import { formatDate } from '@/utils/date'
import type { MySession, ProcessStatus } from '@/types/session'
import Card from '@/components/common/Card'
import { cn } from '@/utils/cn'

interface ArchiveSessionItemProps {
  item: MySession
  tags: string[]
  expanded: boolean
  onToggle: () => void
}

const summaryTag: Record<
  ProcessStatus | 'NONE',
  { variant: 'info' | 'warning' | 'danger' | 'neutral'; label: string }
> = {
  COMPLETED: { variant: 'info', label: 'AI 요약 완료' },
  PENDING: { variant: 'warning', label: '요약 준비 중' },
  PROCESSING: { variant: 'warning', label: '요약 준비 중' },
  FAILED: { variant: 'danger', label: '요약 생성 실패' },
  NONE: { variant: 'neutral', label: '요약 없음' },
}

export default function ArchiveSessionItem({
  item,
  tags,
  expanded,
  onToggle,
}: ArchiveSessionItemProps) {
  const { session, summaryStatus, myRole } = item
  const tag = summaryTag[summaryStatus ?? 'NONE']

  return (
    <Card
      as="article"
      className={cn(
        'overflow-hidden',
        expanded && 'shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
      )}
    >
      <div className="flex flex-col gap-3 p-[25px]">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <StatusTag variant={tag.variant}>{tag.label}</StatusTag>
            <StatusTag variant={myRole === 'PRESENTER' ? 'request' : 'neutral'}>
              {myRole === 'PRESENTER' ? '발표자' : '청자'}
            </StatusTag>
            <time className="text-ink-sub text-xs font-medium">
              {formatDate(session.endedAt ?? session.createdAt)}
            </time>
          </div>
          <Button
            variant="outline"
            className="h-9"
            aria-expanded={expanded}
            onClick={onToggle}
          >
            {expanded ? '기록 닫기' : '기록 보기'}
          </Button>
        </header>

        <div className="flex flex-col gap-2">
          <h2 className="text-ink text-base">{session.title}</h2>
          {session.description && (
            <p className="text-ink-sub text-sm">{session.description}</p>
          )}
        </div>

        {tags.length > 0 && (
          <ul className="flex flex-wrap items-center gap-1.5">
            {tags.map((name) => (
              <li
                key={name}
                className="bg-canvas-subtle text-ink-muted rounded px-2 py-0.5 text-[13px]"
              >
                #{name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {expanded && (
        <div className="bg-canvas-subtle flex flex-col gap-7 p-4 sm:p-6">
          <SessionSummary
            sessionId={session.sessionId}
            summaryStatus={summaryStatus}
            canRetry={myRole === 'PRESENTER'}
          />
          <ArchiveQuestionList sessionId={session.sessionId} />
        </div>
      )}
    </Card>
  )
}
