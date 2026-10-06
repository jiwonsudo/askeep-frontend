import type { ReactNode } from 'react'
import { Link } from 'react-router'

import Icon from '@/components/common/Icon'
import { cn } from '@/utils/cn'

interface BackLinkProps {
  to: string
  children: ReactNode
  className?: string
}

/** 화면 왼쪽 위의 "← 이전" 링크 */
export default function BackLink({ to, children, className }: BackLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        'text-ink-sub flex w-fit items-center gap-1.5 text-sm',
        className,
      )}
    >
      <Icon name="arrow-left" className="size-5" />
      {children}
    </Link>
  )
}
