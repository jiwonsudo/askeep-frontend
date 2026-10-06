import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'

import { getApiErrorMessage } from '@/api/client'
import PasswordInput from '@/components/auth/PasswordInput'
import SignupCompleteModal from '@/components/auth/SignupCompleteModal'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import AuthCard from '@/components/auth/AuthCard'
import PageLayout from '@/components/common/PageLayout'
import { useSignup } from '@/hooks/useAuth'

const NAME_MAX_LENGTH = 30
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 64

export default function SignupPage() {
  const signup = useSignup()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [completeOpen, setCompleteOpen] = useState(false)

  const passwordError =
    password.length > 0 && password.length < PASSWORD_MIN_LENGTH
      ? `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 해요.`
      : undefined
  const confirmError =
    passwordConfirm.length > 0 && passwordConfirm !== password
      ? '비밀번호가 일치하지 않아요.'
      : undefined

  const canSubmit =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= PASSWORD_MIN_LENGTH &&
    passwordConfirm === password &&
    !signup.isPending

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!canSubmit) return

    signup.mutate(
      { name: name.trim(), email: email.trim(), password },
      { onSuccess: () => setCompleteOpen(true) },
    )
  }

  const handleClose = () => {
    setCompleteOpen(false)
    setName('')
    setEmail('')
    setPassword('')
    setPasswordConfirm('')
    signup.reset()
  }

  return (
    <PageLayout>
      <AuthCard
        title="회원가입"
        description="ASKeep를 이용하기 위한 기본 정보를 입력해주세요."
        footer={
          <p className="text-ink-sub flex items-center justify-center gap-1 pt-6 text-sm">
            이미 계정이 있으신가요?
            <Link to="/login" className="text-brand font-bold">
              로그인
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-3">
          <Input
            label="이름"
            required
            autoComplete="name"
            placeholder="이름을 입력해주세요."
            maxLength={NAME_MAX_LENGTH}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <Input
            label="이메일"
            required
            type="email"
            autoComplete="email"
            placeholder="#########@sangmyung.kr"
            maxLength={100}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <PasswordInput
            label="비밀번호"
            required
            autoComplete="new-password"
            placeholder="비밀번호를 입력해주세요."
            maxLength={PASSWORD_MAX_LENGTH}
            value={password}
            error={passwordError}
            onChange={(event) => setPassword(event.target.value)}
          />
          <PasswordInput
            label="비밀번호 확인"
            required
            autoComplete="new-password"
            placeholder="비밀번호를 한 번 더 입력해주세요."
            maxLength={PASSWORD_MAX_LENGTH}
            value={passwordConfirm}
            error={confirmError}
            onChange={(event) => setPasswordConfirm(event.target.value)}
          />
          {signup.isError && (
            <p role="alert" className="text-danger text-xs font-medium">
              {getApiErrorMessage(
                signup.error,
                '회원가입하지 못했어요. 잠시 후 다시 시도해 주세요.',
              )}
            </p>
          )}
          <Button type="submit" disabled={!canSubmit}>
            회원가입
          </Button>
        </form>
      </AuthCard>

      <SignupCompleteModal open={completeOpen} onClose={handleClose} />
    </PageLayout>
  )
}
