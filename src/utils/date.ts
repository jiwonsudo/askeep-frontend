const HAS_TIMEZONE = /(Z|[+-]\d{2}:?\d{2})$/

/** 서버 날짜는 타임존 표기 없는 한국 시간이라 +09:00을 붙여 해석한다 */
export const parseServerDate = (value: string) =>
  new Date(HAS_TIMEZONE.test(value) ? value : `${value}+09:00`)

export const formatRelativeTime = (value: string, now = Date.now()) => {
  const diffSeconds = Math.max(
    0,
    Math.floor((now - parseServerDate(value).getTime()) / 1000),
  )

  if (diffSeconds < 60) return '방금 전'

  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) return `${diffMinutes}분 전`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours}시간 전`

  return `${Math.floor(diffHours / 24)}일 전`
}

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** 2026. 09. 11 형태로 표시 */
export const formatDate = (value: string) => {
  const parts = Object.fromEntries(
    dateFormatter
      .formatToParts(parseServerDate(value))
      .map(({ type, value }) => [type, value]),
  )

  return `${parts.year}. ${parts.month}. ${parts.day}`
}
