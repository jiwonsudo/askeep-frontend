import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

interface CalloutProps {
  icon: ReactNode
  title: string
  children: ReactNode
  className?: string
  titleClassName?: string
  contentClassName?: string
}

/** 아이콘, 굵은 제목, 보조 설명으로 된 파란 안내 박스 */
export default function Callout({
  icon,
  title,
  children,
  className,
  titleClassName,
  contentClassName,
}: CalloutProps) {
  return (
    <div
      className={cn(
        'bg-info-bg flex items-start gap-3 rounded-lg p-4',
        className,
      )}
    >
      {icon}
      <div className={cn('flex flex-col gap-0.5', contentClassName)}>
        <p className={cn('text-ink text-sm font-bold', titleClassName)}>
          {title}
        </p>
        <p className="text-ink-button text-xs font-medium">{children}</p>
      </div>
    </div>
  )
}
