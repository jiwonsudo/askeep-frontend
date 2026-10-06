import type { ReactNode } from 'react'

type StatusTagVariant =
  'info' | 'success' | 'warning' | 'request' | 'danger' | 'neutral'

interface StatusTagProps {
  variant?: StatusTagVariant
  children: ReactNode
}

const variantClassNames: Record<StatusTagVariant, string> = {
  info: 'bg-info-bg text-brand-deep',
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  request: 'bg-request-bg text-request',
  danger: 'bg-danger-bg text-danger',
  neutral: 'bg-canvas-subtle text-ink-button',
}

export default function StatusTag({
  variant = 'info',
  children,
}: StatusTagProps) {
  return (
    <span
      className={`inline-flex h-[26px] items-center rounded-[10px] px-3 py-1 text-xs font-bold whitespace-nowrap ${variantClassNames[variant]}`}
    >
      {children}
    </span>
  )
}
