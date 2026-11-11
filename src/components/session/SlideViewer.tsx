import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

import { isMissingOriginal } from '@/api/client'
import Icon from '@/components/common/Icon'
import {
  useMaterialPageImage,
  useMaterialPages,
  usePrefetchMaterialPageImage,
  useSessionMaterials,
} from '@/hooks/useSession'
import { cn } from '@/utils/cn'

/** 지금 보고 있는 자료와 페이지. 자료를 고르지 않았으면 처음 올린 자료를 보여준다 */
export interface SlidePosition {
  materialId?: number
  page: number
}

interface SlideViewerProps {
  sessionId: number
  position: SlidePosition
  onPositionChange: (position: SlidePosition) => void
}

interface SlideImageProps {
  blob: Blob
  alt: string
  className?: string
}

/** 받아 둔 이미지 데이터를 화면에 그린다. 화면에서 빠지면 임시 주소를 정리한다 */
function SlideImage({ blob, alt, className }: SlideImageProps) {
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const url = URL.createObjectURL(blob)
    ref.current.src = url

    return () => URL.revokeObjectURL(url)
  }, [blob])

  return <img ref={ref} alt={alt} draggable={false} className={className} />
}

const messageClassName = 'text-ink-muted text-xs font-medium'
const controlClassName =
  'cursor-pointer rounded p-1 disabled:cursor-not-allowed disabled:opacity-40'

/**
 * 발표 자료 뷰어. 발표자가 올린 PDF를 한 장씩 이미지로 받아 보여준다.
 * 발표자 화면과 연동하지 않고 청자가 각자 넘겨 본다.
 */
export default function SlideViewer({
  sessionId,
  position,
  onPositionChange,
}: SlideViewerProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [fullscreen, setFullscreen] = useState(false)
  const prefetch = usePrefetchMaterialPageImage()

  const materials = useSessionMaterials(sessionId)
  // 올린 순서대로 보여준다
  const items = [...(materials.data?.items ?? [])].sort((a, b) => a.id - b.id)
  const material =
    items.find(({ id }) => id === position.materialId) ?? items.at(0)

  // 목록에 페이지 수가 아직 없는 자료만 따로 물어본다
  const pages = useMaterialPages(
    material && material.pageCount === null ? material.id : undefined,
  )
  const pageCount = material?.pageCount ?? pages.data?.pageCount
  const page = Math.min(Math.max(position.page, 1), pageCount ?? position.page)
  const image = useMaterialPageImage(material?.id, page)

  const materialId = material?.id
  const hasNext = pageCount !== undefined && page < pageCount
  // 지금 장을 받은 뒤에만 다음 장을 미리 받는다 (원본이 없으면 다음 장도 어차피 실패한다)
  const loaded = image.isSuccess && !image.isPlaceholderData

  useEffect(() => {
    if (materialId !== undefined && hasNext && loaded) {
      prefetch(materialId, page + 1)
    }
    // prefetch는 렌더링마다 새로 만들어지지만 하는 일은 같다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materialId, page, hasNext, loaded])

  useEffect(() => {
    const handleChange = () =>
      setFullscreen(document.fullscreenElement === sectionRef.current)

    document.addEventListener('fullscreenchange', handleChange)

    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [])

  const goTo = (next: number) => {
    if (materialId === undefined || next < 1) return
    if (pageCount !== undefined && next > pageCount) return

    onPositionChange({ materialId, page: next })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.target instanceof HTMLSelectElement) return

    if (event.key === 'ArrowLeft') goTo(page - 1)
    if (event.key === 'ArrowRight') goTo(page + 1)
  }

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined)
    } else {
      sectionRef.current?.requestFullscreen().catch(() => undefined)
    }
  }

  // 넘긴 장을 못 받았으면 보던 장이 남아 있어도 실패로 보여준다
  const failed = image.isError || (pages.isError && !image.data)
  const missingOriginal = isMissingOriginal(image.error)

  return (
    <section
      ref={sectionRef}
      id="slide-viewer"
      aria-label="발표 자료"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="border-line-soft focus-visible:outline-brand-deep flex scroll-mt-4 flex-col overflow-hidden rounded-xl border bg-white [&:fullscreen]:rounded-none [&:fullscreen]:border-0"
    >
      <div className="bg-line relative flex aspect-video w-full items-center justify-center [:fullscreen>&]:aspect-auto [:fullscreen>&]:min-h-0 [:fullscreen>&]:flex-1 [:fullscreen>&]:bg-black">
        {materials.isError && !materials.data ? (
          <p role="alert" className={messageClassName}>
            발표 자료를 불러오지 못했어요.
          </p>
        ) : materials.isPending ? (
          <div className="flex flex-col items-center gap-1">
            <Icon name="loading" className="h-[13px] w-[27.8px]" />
            <p className={messageClassName}>발표 자료 로딩 중</p>
          </div>
        ) : !material ? (
          <p className={messageClassName}>등록된 발표 자료가 없어요.</p>
        ) : failed && missingOriginal ? (
          <p
            role="alert"
            className={cn(messageClassName, 'px-6 text-center break-keep')}
          >
            서버에 발표 자료 원본이 없어 슬라이드를 볼 수 없어요.
            <br />
            발표자에게 자료를 다시 올려 달라고 알려 주세요.
          </p>
        ) : failed ? (
          <div className="flex flex-col items-center gap-2">
            <p role="alert" className={messageClassName}>
              슬라이드를 불러오지 못했어요.
            </p>
            <button
              type="button"
              onClick={() => {
                if (pages.isError) pages.refetch()
                image.refetch()
              }}
              className="text-brand-deep cursor-pointer text-xs font-bold underline underline-offset-2"
            >
              다시 시도
            </button>
          </div>
        ) : image.data ? (
          <>
            <SlideImage
              blob={image.data}
              alt={`${material.fileName} ${page}쪽`}
              className={cn(
                'size-full object-contain transition-opacity',
                image.isPlaceholderData && 'opacity-50',
              )}
            />
            {image.isPlaceholderData && (
              <Icon
                name="loading"
                label="슬라이드 로딩 중"
                className="absolute h-[13px] w-[27.8px]"
              />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Icon name="loading" className="h-[13px] w-[27.8px]" />
            <p className={messageClassName}>슬라이드 로딩 중</p>
          </div>
        )}
      </div>

      <div className="border-line-soft flex items-center justify-between gap-2 border-t px-5 pt-[13px] pb-3">
        {items.length > 1 ? (
          <select
            aria-label="발표 자료 선택"
            value={material?.id}
            onChange={(event) =>
              onPositionChange({
                materialId: Number(event.target.value),
                page: 1,
              })
            }
            className="border-line text-ink h-8 max-w-[50%] min-w-0 cursor-pointer truncate rounded-lg border bg-white px-2 text-xs font-medium"
          >
            {items.map(({ id, fileName }) => (
              <option key={id} value={id}>
                {fileName}
              </option>
            ))}
          </select>
        ) : (
          <p className="flex min-w-0 items-center text-xs font-medium">
            <span className="bg-brand size-2 shrink-0 rounded-full" />
            <span className="text-ink pl-2">청자 개별 열람 모드</span>
            <span className="text-ink-sub hidden pl-2 sm:inline">
              (발표자 화면과 독립적으로 탐색)
            </span>
          </p>
        )}
        <div className="flex shrink-0 items-center">
          <div className="border-line bg-canvas-subtle flex items-center rounded-lg border p-[5px]">
            <button
              type="button"
              disabled={!material || page <= 1}
              aria-label="이전 슬라이드"
              onClick={() => goTo(page - 1)}
              className={controlClassName}
            >
              <Icon name="chevron-left" className="size-4" />
            </button>
            <span className="text-ink pr-2 pl-3.5 text-xs font-medium">
              {material ? page : '-'} / {pageCount ?? '-'}
            </span>
            <button
              type="button"
              disabled={!material || !hasNext}
              aria-label="다음 슬라이드"
              onClick={() => goTo(page + 1)}
              className={cn(controlClassName, 'pr-1 pl-2.5')}
            >
              <Icon name="chevron-right" className="size-4" />
            </button>
          </div>
          {/* 아이폰 사파리처럼 전체화면을 지원하지 않는 브라우저에서는 버튼을 숨긴다 */}
          {document.fullscreenEnabled && (
            <>
              <div className="bg-line-soft mx-3 h-4 w-px" />
              <button
                type="button"
                disabled={!material}
                aria-label={fullscreen ? '전체화면 닫기' : '전체화면'}
                aria-pressed={fullscreen}
                onClick={toggleFullscreen}
                className={cn(controlClassName, 'p-1.5')}
              >
                <Icon name="fullscreen" className="size-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
