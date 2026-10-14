import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'

import { getApiErrorMessage } from '@/api/client'
import PasswordInput from '@/components/auth/PasswordInput'
import Button from '@/components/common/Button'
import Callout from '@/components/common/Callout'
import Icon from '@/components/common/Icon'
import Input from '@/components/common/Input'
import AuthCard from '@/components/auth/AuthCard'
import PageLayout from '@/components/common/PageLayout'
import { useLogin } from '@/hooks/useAuth'
import {
  clearExpiredNotice,
  hasAccessToken,
  hasExpiredNotice,
} from '@/utils/authStorage'

interface LocationState {
  from?: { pathname: string; search?: string }
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // 로그인이 만료돼 넘어온 경우에만 안내를 보여준다 (새로고침해도 한 번은 남도록 화면을 떠날 때 지운다)
  const [expired] = useState(hasExpiredNotice)

  useEffect(() => clearExpiredNotice, [])

  const from = (location.state as LocationState | null)?.from
  const canSubmit =
    email.trim().length > 0 && password.length > 0 && !login.isPending

  // 이미 로그인한 상태로 들어오면 로그인 화면을 건너뛴다 (방금 로그인한 경우는 아래에서 이동)
  if (hasAccessToken() && !login.isPending) {
    return (
      <Navigate to={from ? from.pathname + (from.search ?? '') : '/'} replace />
    )
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit) return

    login.mutate(
      { email: email.trim(), password },
      {
        onSuccess: () =>
          navigate(from ? from.pathname + (from.search ?? '') : '/', {
            replace: true,
          }),
      },
    )
  }

  return (
    <PageLayout>
      <AuthCard
        title="로그인"
        description="ASKeep에 로그인하고 실시간 세션 기능을 이용해보세요."
        footer={
          <p className="text-ink-sub flex items-center justify-center gap-1 pt-6 text-sm">
            아직 계정이 없으신가요?
            <Link to="/signup" className="text-brand font-bold">
              회원가입
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-3">
          {expired && (
            <div role="alert">
              <Callout
                icon={<Icon name="info" className="mt-0.5 size-4 shrink-0" />}
                title="로그인이 만료되었어요."
              >
                보안을 위해 일정 시간이 지나면 자동으로 로그아웃돼요. 다시
                로그인해 주세요.
              </Callout>
            </div>
          )}
          <Input
            label="이메일"
            required
            type="email"
            autoComplete="email"
            placeholder="#########@sangmyung.kr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <PasswordInput
            label="비밀번호"
            required
            autoComplete="current-password"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {login.isError && (
            <p role="alert" className="text-danger text-xs font-medium">
              {getApiErrorMessage(
                login.error,
                '로그인하지 못했어요. 이메일과 비밀번호를 확인해 주세요.',
              )}
            </p>
          )}
          <Button type="submit" disabled={!canSubmit}>
            로그인
          </Button>
        </form>
      </AuthCard>
    </PageLayout>
  )
}
