/**
 * 로그인 화면의 "아이디 저장"을 켠 경우 이메일을 이 브라우저에 기억해 둔다.
 * 로그아웃해도 지우지 않고, 저장을 끄고 로그인하면 지운다.
 */
const STORAGE_KEY = 'askeep.savedEmail'

/** 저장된 이메일. 없거나 저장소를 쓸 수 없으면 빈 문자열 */
export const loadSavedEmail = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? ''
  } catch {
    return ''
  }
}

export const saveEmail = (email: string) => {
  try {
    localStorage.setItem(STORAGE_KEY, email)
  } catch {
    // 저장소를 쓸 수 없는 환경에서는 기억하지 않는다
  }
}

export const clearSavedEmail = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // 무시
  }
}
