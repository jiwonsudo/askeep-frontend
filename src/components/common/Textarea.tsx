import type { TextareaHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export default function Textarea({
  error,
  className = '',
  ...props
}: TextareaProps) {
  return (
    <textarea
      aria-invalid={error}
      className={cn(
        'placeholder:text-ink-muted min-h-[110px] w-full resize-none rounded-lg border bg-white px-[17px] py-4 text-[17px] leading-[25.5px] outline-none disabled:cursor-not-allowed disabled:opacity-50',
        error
          ? 'border-danger-line bg-danger-bg text-danger'
          : 'border-ink-sub focus:border-brand-deep',
        className,
      )}
      {...props}
    />
  )
}
