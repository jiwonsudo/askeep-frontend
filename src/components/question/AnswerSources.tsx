import type { AnswerSource } from '@/types/question'

interface AnswerSourcesProps {
  sources: AnswerSource[]
  /** 주면 출처를 눌러 그 슬라이드로 이동할 수 있다 */
  onSelect?: (source: AnswerSource) => void
}

const chipClassName =
  'border-info-line text-brand-deep max-w-full truncate rounded-full border bg-white px-2.5 py-0.5 text-xs font-medium'

const toLabel = ({ fileName, pageNumber }: AnswerSource) =>
  [fileName ?? '발표 자료', pageNumber !== null ? `${pageNumber}쪽` : null]
    .filter(Boolean)
    .join(' · ')

/** AI 답변이 참고한 자료와 페이지 목록 */
export default function AnswerSources({
  sources,
  onSelect,
}: AnswerSourcesProps) {
  if (sources.length === 0) return null

  return (
    <ul aria-label="답변 출처" className="flex flex-wrap items-center gap-1.5">
      {sources.map((source) => (
        <li
          key={`${source.materialId}-${source.pageNumber}`}
          className="flex max-w-full"
        >
          {onSelect && source.pageNumber !== null ? (
            <button
              type="button"
              onClick={() => onSelect(source)}
              className={`${chipClassName} hover:bg-info-bg cursor-pointer`}
            >
              {toLabel(source)}
            </button>
          ) : (
            <span className={chipClassName}>{toLabel(source)}</span>
          )}
        </li>
      ))}
    </ul>
  )
}
