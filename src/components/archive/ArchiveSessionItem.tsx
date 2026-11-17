import ArchiveMaterialList from '@/components/archive/ArchiveMaterialList'
import ArchiveQuestionList from '@/components/archive/ArchiveQuestionList'
import SessionSummary from '@/components/archive/SessionSummary'
import Button from '@/components/common/Button'
import Icon from '@/components/common/Icon'
import StatusTag from '@/components/common/StatusTag'
import { formatDate, formatTimeRange } from '@/utils/date'
import type { MySession, ProcessStatus } from '@/types/session'
import Card from '@/components/common/Card'
import { cn } from '@/utils/cn'

interface ArchiveSessionItemProps {
  item: MySession
  tags: string[]
  expanded: boolean
  onToggle: () => void
  /** 내가 연 세션일 때만 넘긴다 */
  onDelete?: () => void
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
  onDelete,
}: ArchiveSessionItemProps) {
  const { session, summaryStatus, myRole, questionCount } = item
  // 발표자가 세션을 시작·종료한 시각
  const period = formatTimeRange(session.startedAt, session.endedAt)
  const tag = summaryTag[summaryStatus ?? 'NONE']

  return (
    <Card
      as="article"
      className={cn(
        'overflow-hidden',
        expanded && 'shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
      )}
    >
      <div className="flex flex-col gap-3 p-4 sm:p-[25px]">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusTag variant={tag.variant}>{tag.label}</StatusTag>
            <StatusTag variant={myRole === 'PRESENTER' ? 'request' : 'neutral'}>
              {myRole === 'PRESENTER' ? '발표자' : '청자'}
            </StatusTag>
            <time className="text-ink-sub text-xs font-medium">
              {formatDate(session.endedAt ?? session.createdAt)}
            </time>
            <span className="text-ink-sub text-xs font-medium">
              질문 {questionCount}개
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                type="button"
                aria-label={`${session.title} 삭제`}
                title="세션 삭제"
                onClick={onDelete}
                className="border-info-bg hover:bg-canvas flex cursor-pointer rounded-lg border p-2 transition"
              >
                <Icon name="trash" className="size-5" />
              </button>
            )}
            {/* 모바일에서는 제목 위에 끼지 않게 카드 맨 아래에 넓게 둔다 */}
            <Button
              variant="outline"
              className="hidden h-9 sm:flex"
              aria-expanded={expanded}
              onClick={onToggle}
            >
              {expanded ? '기록 닫기' : '기록 보기'}
            </Button>
          </div>
        </header>

        <div className="flex flex-col gap-2">
          <h2 className="text-ink text-base">{session.title}</h2>
          {session.description && (
            <p className="text-ink-sub text-sm">{session.description}</p>
          )}
          {period && (
            <p className="text-ink-muted text-xs font-medium">
              진행 일시 {period}
            </p>
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

        <Button
          variant="outline"
          className="h-11 w-full sm:hidden"
          aria-expanded={expanded}
          onClick={onToggle}
        >
          {expanded ? '기록 닫기' : '기록 보기'}
        </Button>
      </div>

      {expanded && (
        <div className="bg-canvas-subtle flex flex-col gap-7 p-4 sm:p-6">
          <SessionSummary
            sessionId={session.sessionId}
            summaryStatus={summaryStatus}
            canRetry={myRole === 'PRESENTER'}
          />
          <ArchiveMaterialList sessionId={session.sessionId} />
          <ArchiveQuestionList sessionId={session.sessionId} />
        </div>
      )}
    </Card>
  )
}
