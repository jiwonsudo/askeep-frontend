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
    <header className="bg-nav flex min-h-[72px] w-full max-w-[1400px] items-center justify-between gap-3 rounded-2xl px-4 py-3 drop-shadow-[0_4px_10px_rgba(0,0,0,0.08)] md:px-6 md:py-0">
      <NavbarLogo />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onExit}
          className="flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-base text-white opacity-80 hover:opacity-100"
        >
          <Icon name="exit" className="size-[18px]" />
          나가기
        </button>
        <button
          type="button"
          onClick={onEndSession}
          disabled={endDisabled}
          className="border-danger bg-danger-line-strong text-danger flex h-[39px] cursor-pointer items-center gap-1.5 rounded-lg border px-[17px] text-sm font-bold opacity-80 transition hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Icon name="power-exit" className="size-[18px]" />
          세션 종료
        </button>
      </div>
    </header>
  )
}
