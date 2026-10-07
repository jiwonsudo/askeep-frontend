import { useEffect, useId, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'

import Button from '@/components/common/Button'
import NavbarLogo from '@/components/common/NavbarLogo'
import { useLogout, useMe } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'

export type NavMenu = 'join' | 'archive' | 'faq'

const menus: { key: NavMenu; label: string; to?: string }[] = [
  { key: 'archive', label: '아카이브', to: '/archive' },
  { key: 'faq', label: 'FAQ', to: '/faq' },
]

const itemClassName =
  'block w-full cursor-pointer rounded-lg px-4 py-3 text-left text-base text-white'

interface NavbarProps {
  activeMenu?: NavMenu
}

export default function Navbar({ activeMenu }: NavbarProps) {
  const navigate = useNavigate()
  // 로그인·로그아웃으로 사용자 정보가 바뀌면 이 Navbar도 다시 그려지도록 구독해 둔다
  useMe()
  const logout = useLogout()
  const loggedIn = Boolean(localStorage.getItem('accessToken'))

  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const close = () => setOpen(false)

  // 로그인이 필요한 화면들은 로그아웃 상태에서 누르면 다시 로그인으로 돌아오므로 FAQ만 보여준다
  const visibleMenus = menus.filter(({ key }) => loggedIn || key === 'faq')

  return (
    <header
      ref={containerRef}
      className="bg-nav relative z-40 flex h-[72px] w-full max-w-[1400px] items-center justify-between rounded-2xl px-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.08)] md:px-6"
    >
      <Link to="/" aria-label="ASKeep 홈">
        <NavbarLogo />
      </Link>

      <button
        type="button"
        aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="hover:bg-nav-selected -mr-2.5 flex size-10 cursor-pointer items-center justify-center rounded-full text-white"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M5 5l10 10M15 5L5 15" />
          ) : (
            <path d="M3 5h14M3 10h14M3 15h14" />
          )}
        </svg>
      </button>

      {open && (
        <nav
          id={menuId}
          aria-label="메뉴"
          className="bg-nav absolute top-full right-0 mt-2 flex w-64 max-w-full flex-col gap-1 rounded-2xl p-2 shadow-[0_8px_24px_rgba(0,0,0,0.2)]"
        >
          {visibleMenus.map(({ key, label, to }) => {
            const className = cn(
              itemClassName,
              key === activeMenu ? 'bg-nav-selected' : 'opacity-80',
            )

            return to ? (
              <Link
                key={key}
                to={to}
                aria-current={key === activeMenu ? 'page' : undefined}
                onClick={close}
                className={cn(className, 'hover:opacity-100')}
              >
                {label}
              </Link>
            ) : (
              <button
                key={key}
                type="button"
                onClick={close}
                className={className}
              >
                {label}
              </button>
            )
          })}

          {loggedIn ? (
            <>
              <button
                type="button"
                disabled={logout.isPending}
                onClick={() => {
                  close()
                  logout.mutate(undefined, {
                    onSettled: () => navigate('/login', { replace: true }),
                  })
                }}
                className={cn(itemClassName, 'opacity-80 hover:opacity-100')}
              >
                로그아웃
              </button>

              <div className="border-nav-selected mt-1 flex flex-col gap-2 border-t pt-3">
                <Button
                  variant="ai"
                  className="h-[39px] w-full"
                  aria-current={activeMenu === 'join' ? 'page' : undefined}
                  onClick={() => {
                    close()
                    navigate('/')
                  }}
                >
                  세션 참여
                </Button>
                <Button
                  className="h-[39px] w-full gap-0"
                  leftIcon={<span className="text-[15px] font-bold">+</span>}
                  onClick={() => {
                    close()
                    navigate('/sessions/new')
                  }}
                >
                  세션 만들기
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={close}
                className={cn(itemClassName, 'opacity-80 hover:opacity-100')}
              >
                로그인
              </Link>
              <Link
                to="/signup"
                onClick={close}
                className={cn(itemClassName, 'opacity-80 hover:opacity-100')}
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  )
}
