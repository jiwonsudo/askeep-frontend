/**
 * 홈의 "참여 중인 세션"에서 숨긴 세션을 이 브라우저에 계정별로 기억한다.
 * 서버에 참여 취소 API가 없어서 목록에서만 빼고, 참여 기록은 그대로 남는다.
 */
const STORAGE_KEY = 'askeep.hiddenSessions'

/** 사용자 ID → 숨긴 세션 ID 목록 */
type Store = Record<string, number[]>

const read = (): Store => {
  try {
    const parsed: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? '{}',
    )

    return typeof parsed === 'object' && parsed !== null
      ? (parsed as Store)
      : {}
  } catch {
    return {}
  }
}

const write = (userId: number, sessionIds: number[]) => {
  try {
    const store = read()
    store[userId] = sessionIds
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // 저장소를 쓸 수 없는 환경에서는 기억하지 않는다
  }
}

export const loadHiddenSessions = (userId: number): number[] => {
  const ids = read()[userId]

  return Array.isArray(ids) ? ids : []
}

export const hideSession = (userId: number, sessionId: number) => {
  const ids = loadHiddenSessions(userId)

  if (!ids.includes(sessionId)) write(userId, [...ids, sessionId])
}

/** 입장 코드로 다시 들어오면 목록에 다시 보이게 한다 */
export const unhideSession = (userId: number, sessionId: number) => {
  const ids = loadHiddenSessions(userId)

  if (ids.includes(sessionId)) {
    write(
      userId,
      ids.filter((id) => id !== sessionId),
    )
  }
}
