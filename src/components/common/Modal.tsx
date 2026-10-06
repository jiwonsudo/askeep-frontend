import type { ReactNode } from 'react'
import { useEffect, useId, useRef } from 'react'
import Card from '@/components/common/Card'

interface ModalProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
}

export default function Modal({
  open,
  title,
  description,
  onClose,
  children,
}: ModalProps) {
  const titleId = useId()
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    closeButtonRef.current?.focus()
    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <Card
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex w-full max-w-[400px] flex-col gap-4 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.12)] sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <h2 id={titleId} className="text-ink text-xl font-bold">
            {title}
          </h2>
          {description && <p className="text-ink-sub text-sm">{description}</p>}
        </div>
        {children}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="border-line text-ink-button hover:bg-canvas h-12 cursor-pointer rounded-lg border bg-white text-sm font-bold transition"
        >
          닫기
        </button>
      </Card>
    </div>
  )
}
