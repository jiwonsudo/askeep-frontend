import { cn } from '@/utils/cn'

interface SpinnerProps {
  className?: string
}

export default function Spinner({ className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="처리 중"
      className={cn(
        'border-current inline-block size-4 shrink-0 animate-spin rounded-full border-2 border-t-transparent',
        className,
      )}
    />
  )
}
