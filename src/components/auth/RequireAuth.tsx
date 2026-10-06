import { Navigate, Outlet, useLocation } from 'react-router'

import { useMe } from '@/hooks/useAuth'

/** 로그인한 사람만 들어갈 수 있는 화면을 감싼다 */
export default function RequireAuth() {
  const location = useLocation()
  // 토큰이 만료돼 401이 나면 인터셉터가 토큰을 지우고, 이 컴포넌트가 다시 그려지면서 로그인으로 보낸다
  useMe()

  if (!localStorage.getItem('accessToken')) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
