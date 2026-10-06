import type { InputHTMLAttributes } from 'react'

import Icon from '@/components/common/Icon'
import { cn } from '@/utils/cn'

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label: string
}

export default function Checkbox({
  label,
  className = '',
  ...props
}: CheckboxProps) {
  return (
    <label
      className={cn(
        'text-ink-button flex cursor-pointer items-center gap-1.5 text-base font-medium has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50',
        className,
      )}
    >
      <input type="checkbox" className="peer sr-only" {...props} />
      <span className="peer-focus-visible:outline-brand-deep border-ink-button relative size-4 shrink-0 rounded-[3px] border-2 peer-checked:border-transparent peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 [&>img]:hidden peer-checked:[&>img]:block">
        <Icon
          name="checkbox-checked"
          className="absolute -inset-0.5 size-4 max-w-none"
        />
      </span>
      {label}
    </label>
  )
}
