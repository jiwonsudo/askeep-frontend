const HAS_TIMEZONE = /(Z|[+-]\d{2}:?\d{2})$/

/** 서버 날짜에 시간대가 없으면 한국 시간으로 보고 +09:00을 붙여 해석한다 */
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

const dateTimeFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

/** 한국 시간 기준 연·월·일·시·분을 두 자리 문자열로 돌려준다 */
const toKstParts = (value: string) =>
  Object.fromEntries(
    dateTimeFormatter
      .formatToParts(parseServerDate(value))
      .map(({ type, value }) => [type, value]),
  )

/** 2026. 09. 11 형태로 표시 */
export const formatDate = (value: string) => {
  const parts = toKstParts(value)

  return `${parts.year}. ${parts.month}. ${parts.day}`
}

/** 2026. 09. 11 14:00 형태로 표시 */
export const formatDateTime = (value: string) => {
  const parts = toKstParts(value)

  return `${formatDate(value)} ${parts.hour}:${parts.minute}`
}

/** 시작~종료 시각. 같은 날 끝나면 종료는 시각만 보여준다 */
export const formatTimeRange = (start: string | null, end: string | null) => {
  if (!start) return end ? `~ ${formatDateTime(end)}` : ''
  if (!end) return formatDateTime(start)

  const endParts = toKstParts(end)
  const endText =
    formatDate(start) === formatDate(end)
      ? `${endParts.hour}:${endParts.minute}`
      : formatDateTime(end)

  return `${formatDateTime(start)} ~ ${endText}`
}
