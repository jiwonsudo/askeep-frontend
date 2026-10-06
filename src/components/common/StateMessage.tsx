import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

interface StateMessageProps {
  /** 안내(muted)와 에러(error) */
  tone?: 'muted' | 'error'
  children: ReactNode
  className?: string
}

/** 목록이 비었거나 불러오는 중, 실패했을 때 가운데에 보여주는 문구 */
export default function StateMessage({
  tone = 'muted',
  children,
  className,
}: StateMessageProps) {
  return (
    <p
      role={tone === 'error' ? 'alert' : undefined}
      className={cn(
        'py-8 text-center text-sm',
        tone === 'error' ? 'text-danger' : 'text-ink-muted',
        className,
      )}
    >
      {children}
    </p>
  )
}
