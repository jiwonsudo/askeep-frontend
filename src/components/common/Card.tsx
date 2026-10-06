import type { ElementType, HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type CardVariant = 'default' | 'selected' | 'interactive'

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  variant?: CardVariant
}

const variantClassNames: Record<CardVariant, string> = {
  default: 'border-line bg-white',
  selected: 'border-brand-deep bg-canvas',
  interactive:
    'border-line cursor-pointer bg-white transition hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]',
}

/** 흰 배경에 테두리와 둥근 모서리가 있는 기본 카드. 안쪽 여백은 쓰는 곳에서 정한다 */
export default function Card({
  as: Component = 'div',
  variant = 'default',
  className,
  ...props
}: CardProps) {
  return (
    <Component
      className={cn('rounded-xl border', variantClassNames[variant], className)}
      {...props}
    />
  )
}
