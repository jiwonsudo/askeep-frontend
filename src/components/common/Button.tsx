import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ai' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variantClassNames: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-deep',
  secondary:
    'border border-line bg-white text-ink-button hover:shadow-[0_0_2px_rgba(0,0,0,0.24)]',
  outline: 'border border-brand-deep bg-white text-brand-deep hover:bg-info-bg',
  ai: 'border border-info-line bg-info-bg text-brand-deep hover:shadow-[0_0_2px_rgba(0,0,0,0.24)]',
  danger:
    'border border-danger-line-strong bg-danger-bg text-danger hover:shadow-[0_0_2px_rgba(0,0,0,0.24)]',
}

export default function Button({
  variant = 'primary',
  leftIcon,
  rightIcon,
  className = '',
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50',
        variantClassNames[variant],
        className,
      )}
      {...props}
    >
      {leftIcon}
      <span className="px-[5px] py-1">{children}</span>
      {rightIcon}
    </button>
  )
}
