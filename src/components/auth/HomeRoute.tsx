import { useMe } from '@/hooks/useAuth'
import LandingPage from '@/pages/LandingPage'
import SessionJoinPage from '@/pages/SessionJoinPage'

/** 로그인했으면 입장코드 입력 화면을, 아니면 소개 화면을 보여준다 */
export default function HomeRoute() {
  // 토큰이 만료돼 401이 나면 인터셉터가 토큰을 지우고, 다시 그려지면서 소개 화면으로 돌아간다
  useMe()

  return localStorage.getItem('accessToken') ? (
    <SessionJoinPage />
  ) : (
    <LandingPage />
  )
}
