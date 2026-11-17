import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

interface RevealProps {
  children: ReactNode
  className?: string
  /** 같은 줄의 다른 요소보다 늦게 나오게 할 때 (ms) */
  delay?: number
}

/** 스크롤해서 화면에 들어오면 아래에서 떠오르게 한다. 움직임 줄이기 설정이면 처음부터 보인다 */
export default function Reveal({
  children,
  className,
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setVisible(true)
        observer.disconnect()
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        visible ? 'motion-safe:animate-fade-up' : 'motion-safe:opacity-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
