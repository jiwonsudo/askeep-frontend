import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router'

import { getApiErrorMessage } from '@/api/client'
import AuthCard from '@/components/auth/AuthCard'
import PasswordInput from '@/components/auth/PasswordInput'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import PageLayout from '@/components/common/PageLayout'
import {
  useConfirmPasswordReset,
  useRequestPasswordReset,
} from '@/hooks/useAuth'

const CODE_LENGTH = 6
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 64

const errorClassName = 'text-danger text-xs font-medium'

/** 메일로 받은 인증코드로 비밀번호를 다시 정한다. 이메일 입력 → 코드와 새 비밀번호 입력 두 단계 */
export default function PasswordResetPage() {
  const request = useRequestPasswordReset()
  const confirm = useConfirmPasswordReset()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const codeSent = request.isSuccess
  const done = confirm.isSuccess

  const passwordError =
    newPassword.length > 0 && newPassword.length < PASSWORD_MIN_LENGTH
      ? `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 해요.`
      : undefined
  const confirmError =
    passwordConfirm.length > 0 && passwordConfirm !== newPassword
      ? '비밀번호가 일치하지 않아요.'
      : undefined

  const canRequest = email.trim().length > 0 && !request.isPending
  const canConfirm =
    code.length === CODE_LENGTH &&
    newPassword.length >= PASSWORD_MIN_LENGTH &&
    passwordConfirm === newPassword &&
    !confirm.isPending

  const handleRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (canRequest) request.mutate({ email: email.trim() })
  }

  const handleConfirm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (canConfirm) {
      confirm.mutate({ email: email.trim(), code, newPassword })
    }
  }

  return (
    <PageLayout>
      <AuthCard
        title="비밀번호 재설정"
        description={
          done
            ? '새 비밀번호로 로그인해 주세요.'
            : codeSent
              ? '메일로 받은 6자리 인증코드와 새 비밀번호를 입력해 주세요.'
              : '가입한 이메일로 인증코드를 보내 드려요.'
        }
        footer={
          <p className="text-ink-sub flex items-center justify-center gap-1 pt-6 text-sm">
            비밀번호가 기억났나요?
            <Link to="/login" className="text-brand font-bold">
              로그인
            </Link>
          </p>
        }
      >
        {done ? (
          <div className="flex flex-col gap-4 pt-3">
            <p role="status" className="text-success text-sm font-medium">
              비밀번호를 바꿨어요.
            </p>
            <Link
              to="/login"
              className="bg-brand hover:bg-brand-deep flex h-12 items-center justify-center rounded-lg px-4 text-sm font-bold text-white transition"
            >
              로그인 바로가기
            </Link>
          </div>
        ) : codeSent ? (
          <form onSubmit={handleConfirm} className="flex flex-col gap-4 pt-3">
            <p className="text-ink-sub text-xs font-medium">
              {email.trim()}로 인증코드를 보냈어요. 가입하지 않은 이메일이면
              메일이 오지 않아요.
            </p>
            <Input
              label="인증코드"
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="6자리 숫자"
              maxLength={CODE_LENGTH}
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, ''))
              }
            />
            <PasswordInput
              label="새 비밀번호"
              required
              autoComplete="new-password"
              maxLength={PASSWORD_MAX_LENGTH}
              value={newPassword}
              error={passwordError}
              onChange={(event) => setNewPassword(event.target.value)}
            />
            <PasswordInput
              label="새 비밀번호 확인"
              required
              autoComplete="new-password"
              maxLength={PASSWORD_MAX_LENGTH}
              value={passwordConfirm}
              error={confirmError}
              onChange={(event) => setPasswordConfirm(event.target.value)}
            />
            {confirm.isError && (
              <p role="alert" className={errorClassName}>
                {getApiErrorMessage(
                  confirm.error,
                  '비밀번호를 바꾸지 못했어요. 인증코드를 다시 확인해 주세요.',
                )}
              </p>
            )}
            <Button type="submit" disabled={!canConfirm}>
              비밀번호 변경
            </Button>
            <button
              type="button"
              onClick={() => {
                request.reset()
                confirm.reset()
                setCode('')
              }}
              className="text-ink-sub cursor-pointer self-center text-sm underline underline-offset-2"
            >
              인증코드 다시 받기
            </button>
          </form>
        ) : (
          <form onSubmit={handleRequest} className="flex flex-col gap-4 pt-3">
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
            {request.isError && (
              <p role="alert" className={errorClassName}>
                {getApiErrorMessage(
                  request.error,
                  '인증코드를 보내지 못했어요. 잠시 후 다시 시도해 주세요.',
                )}
              </p>
            )}
            <Button type="submit" disabled={!canRequest}>
              인증코드 받기
            </Button>
          </form>
        )}
      </AuthCard>
    </PageLayout>
  )
}
