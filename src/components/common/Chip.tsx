import type { ButtonHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
}

export default function Chip({
  selected = false,
  className = '',
  children,
  type = 'button',
  ...props
}: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(
        'h-[37px] shrink-0 cursor-pointer rounded-full border px-[17px] text-sm font-bold whitespace-nowrap transition',
        selected
          ? 'border-black bg-black text-white'
          : 'border-line text-ink-muted hover:bg-canvas-subtle bg-white',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
