import Icon from '@/components/common/Icon'

/**
 * 발표 자료 뷰어. 백엔드에 슬라이드 이미지를 내려주는 API가 아직 없어서
 * 로딩 상태 화면과 비활성 컨트롤만 보여준다.
 */
export default function SlideViewer() {
  return (
    <section
      aria-label="발표 자료"
      className="border-line-soft overflow-hidden rounded-xl bg-white"
    >
      <div className="bg-line flex h-[235px] flex-col items-center justify-center gap-1 p-8">
        <Icon name="loading" className="h-[13px] w-[27.8px]" />
        <p className="text-ink-muted text-xs font-medium">발표 자료 로딩 중</p>
      </div>
      <div className="border-line-soft flex items-center justify-between gap-2 border-t px-5 pt-[13px] pb-3">
        <p className="flex min-w-0 items-center text-xs font-medium">
          <span className="bg-brand size-2 shrink-0 rounded-full" />
          <span className="text-ink pl-2">청자 개별 열람 모드</span>
          <span className="text-ink-sub hidden pl-2 sm:inline">
            (발표자 화면과 독립적으로 탐색)
          </span>
        </p>
        <div className="flex shrink-0 items-center">
          <div className="border-line bg-canvas-subtle flex items-center rounded-lg border p-[5px]">
            <button
              type="button"
              disabled
              aria-label="이전 슬라이드"
              className="rounded p-1 disabled:cursor-not-allowed"
            >
              <Icon name="chevron-left" className="size-4" />
            </button>
            <span className="text-ink pr-2 pl-3.5 text-xs font-medium">
              - / -
            </span>
            <button
              type="button"
              disabled
              aria-label="다음 슬라이드"
              className="rounded p-1 pr-1 pl-2.5 disabled:cursor-not-allowed"
            >
              <Icon name="chevron-right" className="size-4" />
            </button>
          </div>
          <div className="bg-line-soft mx-3 h-4 w-px" />
          <button
            type="button"
            disabled
            aria-label="전체화면"
            className="p-1.5 disabled:cursor-not-allowed"
          >
            <Icon name="fullscreen" className="size-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
