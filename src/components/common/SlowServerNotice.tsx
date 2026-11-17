import { useEffect, useState } from 'react'

import Spinner from '@/components/common/Spinner'

/** 이 시간이 지나도 응답이 없으면 서버가 깨어나는 중이라고 안내한다 */
const SLOW_AFTER_MS = 4000

interface SlowServerNoticeProps {
  pending: boolean
}

/**
 * 시연용 서버(Render 무료)는 한동안 요청이 없으면 잠들어서, 첫 요청에 1분 가까이 걸릴 수 있다.
 * 그동안 아무 반응이 없으면 고장 난 것처럼 보이므로 기다리면 된다고 알려 준다.
 */
export default function SlowServerNotice({ pending }: SlowServerNoticeProps) {
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    if (!pending) return

    const timer = setTimeout(() => setSlow(true), SLOW_AFTER_MS)

    return () => {
      clearTimeout(timer)
      setSlow(false)
    }
  }, [pending])

  if (!pending || !slow) return null

  return (
    <p
      role="status"
      className="text-ink-muted flex items-center justify-center gap-2 text-xs font-medium break-keep"
    >
      <Spinner className="text-brand" />
      서버를 깨우는 중이에요. 처음엔 최대 1분 정도 걸릴 수 있어요.
    </p>
  )
}
