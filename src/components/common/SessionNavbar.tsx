import Icon from '@/components/common/Icon'
import NavbarLogo from '@/components/common/NavbarLogo'

interface SessionNavbarProps {
  onExit: () => void
  onEndSession: () => void
  /** 세션을 종료할 수 없는 상태(시작 전·이미 종료)에서 비활성화한다 */
  endDisabled?: boolean
}

/** 세션 진행 중(발표자)에 쓰는 Navbar. 나가기와 세션 종료만 보여준다 */
export default function SessionNavbar({
  onExit,
  onEndSession,
  endDisabled,
}: SessionNavbarProps) {
  return (
    <header className="bg-nav flex min-h-[72px] w-full max-w-[1400px] items-center justify-between gap-3 px-4 py-3 drop-shadow-[0_4px_10px_rgba(0,0,0,0.08)] md:rounded-2xl md:px-6 md:py-0">
      <NavbarLogo />
      <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        <button
          type="button"
          onClick={onExit}
          aria-label="나가기"
          className="flex h-11 cursor-pointer items-center gap-2 rounded-full px-3 text-base whitespace-nowrap text-white opacity-80 hover:opacity-100 sm:px-4"
        >
          <Icon name="exit" className="size-[18px]" />
          <span className="hidden sm:inline">나가기</span>
        </button>
        <button
          type="button"
          onClick={onEndSession}
          disabled={endDisabled}
          className="border-danger bg-danger-line-strong text-danger flex h-[39px] cursor-pointer items-center gap-1.5 rounded-lg border px-3 text-sm font-bold whitespace-nowrap opacity-80 transition hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-[17px]"
        >
          <Icon name="power-exit" className="size-[18px]" />
          세션 종료
        </button>
      </div>
    </header>
  )
}
