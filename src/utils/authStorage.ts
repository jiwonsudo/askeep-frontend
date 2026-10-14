/**
 * 액세스 토큰을 이 브라우저에 저장하고, 만료 여부를 서버에 물어보지 않고도 알 수 있게 한다.
 * 서버가 토큰 갱신 API를 주지 않아서, 만료되면 다시 로그인해야 한다.
 */
const TOKEN_KEY = 'accessToken'
const EXPIRED_NOTICE_KEY = 'askeep.authExpired'

/** 토큰이 만료돼 로그아웃 처리됐음을 알리는 window 이벤트 이름 */
export const AUTH_EXPIRED_EVENT = 'askeep:auth-expired'

/** JWT payload의 exp(초)를 밀리초로 돌려준다. 읽을 수 없으면 null */
export const getTokenExpiresAt = (token: string): number | null => {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const { exp } = JSON.parse(json) as { exp?: unknown }

    return typeof exp === 'number' ? exp * 1000 : null
  } catch {
    return null
  }
}

/** 저장된 토큰을 그대로 돌려준다 (만료 여부는 보지 않는다) */
const readToken = () => localStorage.getItem(TOKEN_KEY)

export const saveAccessToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
  sessionStorage.removeItem(EXPIRED_NOTICE_KEY)
}

export const clearAccessToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

/** 토큰을 지우고 "세션이 만료됐다"는 안내를 남긴 뒤 앱에 알린다 */
export const expireAccessToken = () => {
  clearAccessToken()
  sessionStorage.setItem(EXPIRED_NOTICE_KEY, '1')
  window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
}

/** 유효한 토큰만 돌려준다. 만료됐으면 지우고 null */
export const getAccessToken = (): string | null => {
  const token = readToken()
  if (!token) return null

  const expiresAt = getTokenExpiresAt(token)
  if (expiresAt !== null && expiresAt <= Date.now()) {
    expireAccessToken()
    return null
  }

  return token
}

export const hasAccessToken = () => getAccessToken() !== null

/** 로그인 화면에서 만료 안내를 띄울지 여부 */
export const hasExpiredNotice = () =>
  sessionStorage.getItem(EXPIRED_NOTICE_KEY) === '1'

export const clearExpiredNotice = () => {
  sessionStorage.removeItem(EXPIRED_NOTICE_KEY)
}
