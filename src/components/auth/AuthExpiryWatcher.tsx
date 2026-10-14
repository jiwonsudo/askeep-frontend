import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

import {
  AUTH_EXPIRED_EVENT,
  getAccessToken,
  getTokenExpiresAt,
} from '@/utils/authStorage'
import { clearEntryCodes } from '@/utils/entryCodeStorage'

// setTimeout은 약 24.8일(2^31ms)을 넘기면 바로 실행되므로 그 아래로 제한한다
const MAX_TIMEOUT = 2 ** 31 - 1

/**
 * 토큰이 만료되는 순간(또는 만료된 채로 앱을 다시 열었을 때) 로그인 화면으로 보낸다.
 * 서버에 요청을 보내기 전에도 만료를 알아챌 수 있도록 토큰의 만료 시각을 직접 확인한다.
 */
export default function AuthExpiryWatcher() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()

  // 만료 이벤트(타이머·401 응답·토큰 확인 중 발견)를 받으면 정리하고 로그인으로 보낸다
  useEffect(() => {
    const handleExpired = () => {
      clearEntryCodes()
      queryClient.clear()
      navigate('/login', { replace: true })
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired)

    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired)
  }, [navigate, queryClient])

  // 현재 토큰의 만료 시각에 맞춰 타이머를 건다. 로그인·이동 때마다 다시 확인한다
  useEffect(() => {
    // 이미 만료됐다면 여기서 이벤트가 발생한다
    const token = getAccessToken()
    if (!token) return

    const expiresAt = getTokenExpiresAt(token)
    if (expiresAt === null) return

    const timer = window.setTimeout(
      getAccessToken,
      Math.min(expiresAt - Date.now() + 100, MAX_TIMEOUT),
    )
    // 절전·백그라운드에서 타이머가 늦어질 수 있어서, 탭으로 돌아오면 바로 확인한다
    const handleVisible = () => {
      if (document.visibilityState === 'visible') getAccessToken()
    }
    document.addEventListener('visibilitychange', handleVisible)

    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', handleVisible)
    }
  }, [location.key])

  return null
}
