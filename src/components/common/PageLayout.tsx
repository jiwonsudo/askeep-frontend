import type { ReactNode } from 'react'

import Footer from '@/components/common/Footer'
import Navbar from '@/components/common/Navbar'
import type { NavMenu } from '@/components/common/Navbar'

interface PageLayoutProps {
  activeMenu?: NavMenu
  /** 기본 Navbar 대신 쓸 Navbar (예: 세션 진행용) */
  navbar?: ReactNode
  children: ReactNode
}

export default function PageLayout({
  activeMenu,
  navbar,
  children,
}: PageLayoutProps) {
  return (
    <div className="bg-canvas flex min-h-screen flex-col items-center">
      {/* 스크롤바가 폭을 차지하는 환경에서는 왼쪽 여백이 오른쪽보다 좁아 보이므로, 스크롤바 폭만큼 왼쪽을 띄워 헤더와 본문이 창 가운데에 오게 한다 */}
      <div className="flex w-full flex-1 flex-col items-center pl-[calc(100vw_-_100%)]">
        <div className="flex w-full justify-center px-4 pt-4 md:px-10 md:pt-6">
          {navbar ?? <Navbar activeMenu={activeMenu} />}
        </div>
        {children}
      </div>
      <Footer />
    </div>
  )
}
