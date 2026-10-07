import type { ReactNode } from 'react'

import Card from '@/components/common/Card'
import StatusTag from '@/components/common/StatusTag'
import { cn } from '@/utils/cn'

interface AuthCardProps {
  title: string
  description: string
  /** 입력 폼 등 카드의 본문 */
  children: ReactNode
  /** 카드 맨 아래 안내 (예: "계정이 없으신가요?") */
  footer: ReactNode
  /** 카드 바깥 아래쪽에 붙이는 내용 (예: 내 세션 목록) */
  after?: ReactNode
  /** 바깥 `main`에 덧붙이는 클래스 */
  className?: string
}

/** 로그인·회원가입·세션 참여처럼 화면 가운데 놓이는 폼 카드 */
export default function AuthCard({
  title,
  description,
  children,
  footer,
  after,
  className,
}: AuthCardProps) {
  return (
    <main
      className={cn(
        'flex w-full flex-1 justify-center px-4 py-10 md:pt-[72px]',
        className,
      )}
    >
      <div className="flex h-fit w-full max-w-[432px] flex-col gap-6">
        <Card
          as="section"
          className="flex h-fit w-full max-w-[432px] flex-col gap-4 p-6 drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.04)] sm:p-[33px]"
        >
          <div>
            <StatusTag>GDGoC SMU 실시간 세션</StatusTag>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <h1 className="text-ink text-2xl font-bold sm:text-[32px]">
              {title}
            </h1>
            <p className="text-ink-sub text-sm">{description}</p>
          </div>

          {children}
          {footer}
        </Card>
        {after}
      </div>
    </main>
  )
}
