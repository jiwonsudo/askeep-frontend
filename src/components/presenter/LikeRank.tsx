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
        // 모바일에서는 카드 위에 한 줄로 붙여 세로 공간을 아낀다
        'flex h-8 shrink-0 flex-row items-center gap-1.5 rounded-lg border px-2.5 sm:h-[89px] sm:w-16 sm:flex-col sm:gap-[3px] sm:px-[17px] sm:py-[11px]',
        top
          ? 'border-info-bg bg-info-bg'
          : 'border-canvas-subtle bg-canvas-subtle',
      )}
    >
      <Icon
        name={top ? 'chevron-down-blue' : 'chevron-down-gray'}
        className="size-4 rotate-180 sm:size-5"
      />
      <span
        className={cn(
          'text-base leading-none font-bold sm:text-xl',
          top ? 'text-brand-deep' : 'text-[#1e293b]',
        )}
      >
        {count}
      </span>
      <span className="text-ink-muted text-xs leading-none sm:text-sm">
        {rank === null ? '-' : `${rank}위`}
      </span>
    </div>
  )
}
