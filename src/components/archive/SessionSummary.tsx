import Icon from '@/components/common/Icon'
import Button from '@/components/common/Button'
import StatusTag from '@/components/common/StatusTag'
import { useRetrySessionSummary, useSessionSummary } from '@/hooks/useSession'
import type { ProcessStatus } from '@/types/session'

interface SessionSummaryProps {
  sessionId: number
  summaryStatus: ProcessStatus | null
  /** 발표자만 요약 재생성을 요청할 수 있다 */
  canRetry: boolean
}

const LIST_MARKER = /^\s*(\d+[.)]|[-•*])\s*/

/** 줄바꿈으로 나뉜 요약을 항목 배열로 바꾼다. 앞의 번호·불릿은 떼어낸다 */
const toPoints = (summary: string) =>
  summary
    .split('\n')
    .map((line) => line.replace(LIST_MARKER, '').trim())
    .filter(Boolean)

const hintClassName = 'text-ink-muted text-sm'

function SummaryBody({ sessionId }: { sessionId: number }) {
  const { data, isPending, isError } = useSessionSummary(sessionId)

  if (isPending)
    return <p className={hintClassName}>요약을 불러오는 중이에요.</p>
  if (isError || !data.summary) {
    return <p className={hintClassName}>요약을 불러오지 못했어요.</p>
  }

  const points = toPoints(data.summary)

  if (points.length <= 1) {
    return (
      <p className="text-ink text-base break-words whitespace-pre-wrap">
        {data.summary}
      </p>
    )
  }

  return (
    <ol className="flex flex-col gap-2.5">
      {points.map((point, index) => (
        <li key={index} className="text-ink flex gap-1 text-base">
          <span className="text-brand-deep w-[22.7px] shrink-0">
            {index + 1}.
          </span>
          <span className="break-words">{point}</span>
        </li>
      ))}
    </ol>
  )
}

export default function SessionSummary({
  sessionId,
  summaryStatus,
  canRetry,
}: SessionSummaryProps) {
  const { mutate: retry, isPending } = useRetrySessionSummary(sessionId)

  return (
    <section className="border-info-line bg-info-bg flex flex-col gap-3.5 rounded-lg border p-[21px]">
      <header className="border-info-line flex flex-wrap items-center justify-between gap-2 border-b pb-[13px]">
        <h3 className="text-brand-deep flex items-center gap-2 text-xl font-bold">
          <Icon name="ai-summary" className="size-5" />
          AI 세션 요약
        </h3>
        <span className="text-brand-deep inline-flex h-[26px] items-center rounded-[10px] bg-white px-3 text-xs font-medium">
          슬라이드 기반 자동 추출
        </span>
      </header>

      {summaryStatus === 'COMPLETED' && <SummaryBody sessionId={sessionId} />}

      {(summaryStatus === 'PENDING' || summaryStatus === 'PROCESSING') && (
        <p className={hintClassName}>AI가 세션 요약을 만들고 있어요.</p>
      )}

      {summaryStatus === 'FAILED' && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <StatusTag variant="danger">요약 생성 실패</StatusTag>
          {canRetry && (
            <Button
              variant="ai"
              className="h-9"
              disabled={isPending}
              onClick={() => retry()}
            >
              다시 시도
            </Button>
          )}
        </div>
      )}

      {summaryStatus === null && (
        <p className={hintClassName}>아직 요약이 없어요.</p>
      )}
    </section>
  )
}
