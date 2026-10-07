import Icon from '@/components/common/Icon'
import { cn } from '@/utils/cn'

interface LikeRankProps {
  /** "나도 궁금해요" 수 */
  count: number
  /** 공감 순위. 공감이 하나도 없으면 null */
  rank: number | null
}

/** 발표자 화면 질문 카드 왼쪽의 공감 수와 순위 박스. 1위는 파란색으로 강조한다 */
export default function LikeRank({ count, rank }: LikeRankProps) {
  const top = rank === 1

  return (
    <div
      role="img"
      aria-label={
        rank === null
          ? `공감 ${count}개`
          : `공감 ${count}개, 공감 순위 ${rank}위`
      }
      className={cn(
        'flex h-[89px] w-16 shrink-0 flex-col items-center gap-[3px] rounded-lg border px-[17px] py-[11px]',
        top
          ? 'border-info-bg bg-info-bg'
          : 'border-canvas-subtle bg-canvas-subtle',
      )}
    >
      <Icon
        name={top ? 'chevron-down-blue' : 'chevron-down-gray'}
        className="size-5 rotate-180"
      />
      <span
        className={cn(
          'text-xl leading-none font-bold',
          top ? 'text-brand-deep' : 'text-[#1e293b]',
        )}
      >
        {count}
      </span>
      <span className="text-ink-muted text-sm leading-none">
        {rank === null ? '-' : `${rank}위`}
      </span>
    </div>
  )
}
