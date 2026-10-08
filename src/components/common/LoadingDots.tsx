import { useEffect, useState } from 'react'

const MAX_DOTS = 3

/** 점이 1개, 2개, 3개로 늘어나며 반복해서 진행 중임을 보여준다. 자리는 고정해 글이 흔들리지 않게 한다 */
export default function LoadingDots() {
  const [count, setCount] = useState(1)

  useEffect(() => {
    const timer = setInterval(
      () => setCount((current) => (current % MAX_DOTS) + 1),
      500,
    )

    return () => clearInterval(timer)
  }, [])

  return (
    <span aria-hidden="true">
      {'.'.repeat(count)}
      <span className="invisible">{'.'.repeat(MAX_DOTS - count)}</span>
    </span>
  )
}
