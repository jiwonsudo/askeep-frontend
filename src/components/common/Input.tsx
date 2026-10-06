import type { InputHTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'

import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  required?: boolean
  /** 라벨 오른쪽에 보여주는 보조 텍스트 (예: 글자 수) */
  helper?: ReactNode
  /** 에러 메시지. 있으면 Error 스타일로 바뀐다 */
  error?: string
  /** 입력창 오른쪽 안쪽에 놓는 요소 (예: 비밀번호 보기 버튼) */
  endAdornment?: ReactNode
}

export default function Input({
  label,
  required,
  helper,
  error,
  endAdornment,
  className = '',
  id,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="text-ink text-sm font-bold">
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
        {helper && (
          <span className="text-ink-muted text-xs font-medium">{helper}</span>
        )}
      </div>
      <div className="relative">
        <input
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            'placeholder:text-ink-muted h-12 w-full rounded-lg border px-[17px] text-sm font-medium outline-none',
            error
              ? 'border-danger-line bg-danger-bg text-danger placeholder:text-danger'
              : 'border-line-strong focus:border-brand-deep focus:bg-canvas bg-white',
            endAdornment ? 'pr-12' : undefined,
          )}
          {...props}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-[13px] flex items-center">
            {endAdornment}
          </div>
        )}
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-danger text-xs font-medium"
        >
          {error}
        </p>
      )}
    </div>
  )
}
