import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import { createPortal } from 'react-dom'

interface JoinQrOverlayProps {
  entryCode: string
  joinLink: string
  onClose: () => void
}

/** 크기 조절 범위(px)와 키보드로 한 번에 바꾸는 양 */
const MIN_SIZE = 160
const KEY_STEP = 40

/** 가장 크게 키워도 위 안내 문구와 함께 한 화면에 들어오고, 모서리 핸들이 화면 안에 남는 크기 */
const getMaxSize = () =>
  Math.floor(Math.min(window.innerWidth * 0.95, window.innerHeight * 0.85))

const clampSize = (size: number) =>
  Math.min(Math.max(size, MIN_SIZE), getMaxSize())

/** 발표 화면에 크게 띄워 청중이 폰 카메라로 찍고 바로 참여할 수 있게 하는 QR 화면 */
export default function JoinQrOverlay({
  entryCode,
  joinLink,
  onClose,
}: JoinQrOverlayProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const qrRef = useRef<HTMLDivElement>(null)
  // null이면 기본 크기(화면에 맞춘 CSS 크기). 핸들을 끌면 px로 정한다
  const [size, setSize] = useState<number | null>(null)
  const dragRef = useRef<{ x: number; y: number; size: number } | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    closeButtonRef.current?.focus({ preventScroll: true })
    document.addEventListener('keydown', handleKeyDown)
    // 띄워 둔 동안 뒤 화면이 스크롤되지 않게 한다
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = overflow
    }
  }, [onClose])

  const currentSize = () => size ?? qrRef.current?.offsetWidth ?? MIN_SIZE

  // QR은 가운데 정렬이라 양쪽으로 함께 커진다. 모서리를 끈 거리(가로+세로)만큼 크기를 바꾼다
  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      size: currentSize(),
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const start = dragRef.current
    if (!start) return

    const delta = event.clientX - start.x + (event.clientY - start.y)
    setSize(clampSize(start.size + delta))
  }

  const handlePointerUp = () => {
    dragRef.current = null
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step =
      event.key === 'ArrowUp' || event.key === 'ArrowRight'
        ? KEY_STEP
        : event.key === 'ArrowDown' || event.key === 'ArrowLeft'
          ? -KEY_STEP
          : 0
    if (!step) return

    event.preventDefault()
    setSize(clampSize(currentSize() + step))
  }

  // 조상에 filter(drop-shadow 등)가 있으면 position: fixed가 화면이 아니라 그 요소에 갇힌다. 그래서 body에 바로 그린다
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="세션 참여 QR 코드"
      className="fixed inset-0 z-50 overflow-y-auto bg-white"
    >
      {/* 스크롤해도 항상 보이는 오른쪽 위 닫기 */}
      <button
        ref={closeButtonRef}
        type="button"
        aria-label="QR 닫기"
        onClick={onClose}
        className="text-ink-button hover:bg-canvas-subtle hover:text-ink fixed top-4 right-4 z-10 flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/90 transition"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="size-6"
        >
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {/* QR을 키워 화면보다 길어져도 위가 잘리지 않고 스크롤되게, 높이가 남을 때만 가운데에 둔다 */}
      <div className="flex min-h-full flex-col items-center justify-center gap-[3vmin] p-6">
        <p className="text-ink text-center text-[clamp(20px,4vmin,40px)] font-bold break-keep">
          카메라로 QR을 찍어 세션에 참여하세요
        </p>

        {/* 기본은 프로젝터처럼 멀리서 찍어도 인식되도록 화면에 맞춘 크기 */}
        <div
          ref={qrRef}
          style={size === null ? undefined : { width: size }}
          className="relative aspect-square w-[min(80vw,60vh)] shrink-0"
        >
          <QRCodeSVG
            value={joinLink}
            level="M"
            marginSize={2}
            className="block size-full"
            title={joinLink}
          />
          {/* 멀리 있는 사람도, 가까이 있는 사람도 찍을 수 있게 PC에서는 크기를 바꿀 수 있다 */}
          <button
            type="button"
            aria-label="QR 크기 조절 (방향키로도 조절, 두 번 누르면 원래 크기)"
            title="끌어서 크기 조절 · 두 번 클릭하면 원래 크기"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onKeyDown={handleKeyDown}
            onDoubleClick={() => setSize(null)}
            className="text-ink-muted hover:text-ink absolute -right-2 -bottom-2 hidden size-8 cursor-nwse-resize touch-none items-center justify-center transition-colors md:flex"
          >
            {/* 창 모서리의 크기 조절 표시처럼 대각선 두 줄 */}
            <svg
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              className="size-5"
            >
              <path
                d="M14 4L4 14M14 9L9 14"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-ink-sub text-[clamp(14px,2.2vmin,22px)]">
            입장 코드
          </span>
          <span className="text-brand text-[clamp(32px,7vmin,72px)] leading-none font-bold tracking-[0.12em]">
            {entryCode}
          </span>
          <span className="text-ink-muted mt-2 text-[clamp(13px,1.8vmin,18px)] break-all">
            {joinLink.replace(/^https?:\/\//, '')}
          </span>
        </div>
        {/* PC는 오른쪽 위 닫기로 충분하고, 모바일은 손이 닿기 쉬운 아래 버튼도 둔다 */}
        <button
          type="button"
          onClick={onClose}
          className="border-line text-ink-button hover:bg-canvas h-12 shrink-0 cursor-pointer rounded-lg border bg-white px-8 text-sm font-bold transition md:hidden"
        >
          닫기
        </button>
        <p className="text-ink-muted hidden text-xs md:block">
          QR 오른쪽 아래 모서리를 끌어 크기를 조절할 수 있어요
        </p>
      </div>
    </div>,
    document.body,
  )
}
