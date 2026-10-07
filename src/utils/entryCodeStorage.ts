/**
 * 청자가 입장할 때 직접 입력한 입장 코드를 이 브라우저에만 기억해 둔다.
 * 서버는 입장 코드를 발표자에게만 내려줘서, 청자 화면에 코드를 보여주려면 이렇게 해야 한다.
 * 계정별로 나눠 저장하고, 로그아웃하면 지운다.
 */
const STORAGE_KEY = 'askeep.entryCodes'

/** 사용자 ID → (세션 ID → 입장 코드) */
type Store = Record<string, Record<string, string>>

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

export const saveEntryCode = (
  userId: number,
  sessionId: number,
  entryCode: string,
) => {
  try {
    const store = read()
    store[userId] = { ...store[userId], [sessionId]: entryCode }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // 저장소를 쓸 수 없는 환경에서는 코드를 기억하지 않는다
  }
}

export const loadEntryCode = (userId: number, sessionId: number) =>
  read()[userId]?.[sessionId]

export const clearEntryCodes = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // 무시
  }
}
