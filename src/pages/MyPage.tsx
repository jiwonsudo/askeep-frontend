import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'

import { getApiErrorMessage } from '@/api/client'
import PasswordInput from '@/components/auth/PasswordInput'
import BackLink from '@/components/common/BackLink'
import BrandEyebrow from '@/components/common/BrandEyebrow'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import Input from '@/components/common/Input'
import Modal from '@/components/common/Modal'
import PageLayout from '@/components/common/PageLayout'
import StateMessage from '@/components/common/StateMessage'
import {
  useChangePassword,
  useMe,
  useUpdateProfile,
  useWithdraw,
} from '@/hooks/useAuth'
import type { UserResponse } from '@/types/auth'
import { formatDate } from '@/utils/date'

const NAME_MAX_LENGTH = 30
const DEPARTMENT_MAX_LENGTH = 50
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 64

const cardClassName =
  'flex flex-col gap-4 p-6 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:p-[33px]'
const errorClassName = 'text-danger text-xs font-medium'
const successClassName = 'text-success text-xs font-medium'

function ProfileForm({ user }: { user: UserResponse }) {
  const update = useUpdateProfile()
  const [name, setName] = useState(user.name)
  const [department, setDepartment] = useState(user.department ?? '')

  const nameChanged = name.trim() !== user.name
  const departmentChanged = department.trim() !== (user.department ?? '')
  const canSubmit =
    name.trim().length > 0 &&
    department.trim().length > 0 &&
    (nameChanged || departmentChanged) &&
    !update.isPending

  const handleSubmit = (event: FormEvent<HTMLElement>) => {
    event.preventDefault()

    if (!canSubmit) return

    // 바꾼 항목만 보낸다
    update.mutate({
      name: nameChanged ? name.trim() : undefined,
      department: departmentChanged ? department.trim() : undefined,
    })
  }

  return (
    <Card as="form" onSubmit={handleSubmit} className={cardClassName}>
      <h2 className="text-ink text-xl font-bold">기본 정보</h2>
      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <dt className="text-ink text-sm font-bold">이메일</dt>
          <dd className="border-canvas-subtle bg-canvas-subtle text-ink-sub flex h-12 items-center truncate rounded-lg border px-[17px] text-sm font-medium">
            {user.email}
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-ink text-sm font-bold">가입일</dt>
          <dd className="border-canvas-subtle bg-canvas-subtle text-ink-sub flex h-12 items-center rounded-lg border px-[17px] text-sm font-medium">
            {formatDate(user.createdAt)}
          </dd>
        </div>
      </dl>
      <Input
        label="이름"
        required
        autoComplete="name"
        maxLength={NAME_MAX_LENGTH}
        value={name}
        onChange={(event) => {
          setName(event.target.value)
          update.reset()
        }}
      />
      <Input
        label="학과"
        required
        placeholder="예: 컴퓨터과학과"
        maxLength={DEPARTMENT_MAX_LENGTH}
        value={department}
        onChange={(event) => {
          setDepartment(event.target.value)
          update.reset()
        }}
      />
      {update.isError && (
        <p role="alert" className={errorClassName}>
          {getApiErrorMessage(update.error, '정보를 저장하지 못했어요.')}
        </p>
      )}
      {update.isSuccess && (
        <p role="status" className={successClassName}>
          저장했어요.
        </p>
      )}
      <Button type="submit" disabled={!canSubmit} className="sm:self-end">
        저장
      </Button>
    </Card>
  )
}

function PasswordForm() {
  const change = useChangePassword()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  const newError =
    newPassword.length > 0 && newPassword.length < PASSWORD_MIN_LENGTH
      ? `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 해요.`
      : undefined
  const confirmError =
    confirm.length > 0 && confirm !== newPassword
      ? '비밀번호가 일치하지 않아요.'
      : undefined

  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length >= PASSWORD_MIN_LENGTH &&
    confirm === newPassword &&
    !change.isPending

  const handleSubmit = (event: FormEvent<HTMLElement>) => {
    event.preventDefault()

    if (!canSubmit) return

    change.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword('')
          setNewPassword('')
          setConfirm('')
        },
      },
    )
  }

  return (
    <Card as="form" onSubmit={handleSubmit} className={cardClassName}>
      <div className="flex flex-col gap-1">
        <h2 className="text-ink text-xl font-bold">비밀번호 변경</h2>
        <p className="text-ink-sub text-sm">
          변경하면 다른 기기에서는 다시 로그인해야 해요.
        </p>
      </div>
      <PasswordInput
        label="현재 비밀번호"
        required
        autoComplete="current-password"
        value={currentPassword}
        onChange={(event) => setCurrentPassword(event.target.value)}
      />
      <PasswordInput
        label="새 비밀번호"
        required
        autoComplete="new-password"
        maxLength={PASSWORD_MAX_LENGTH}
        value={newPassword}
        error={newError}
        onChange={(event) => setNewPassword(event.target.value)}
      />
      <PasswordInput
        label="새 비밀번호 확인"
        required
        autoComplete="new-password"
        maxLength={PASSWORD_MAX_LENGTH}
        value={confirm}
        error={confirmError}
        onChange={(event) => setConfirm(event.target.value)}
      />
      {change.isError && (
        <p role="alert" className={errorClassName}>
          {getApiErrorMessage(change.error, '비밀번호를 바꾸지 못했어요.')}
        </p>
      )}
      {change.isSuccess && (
        <p role="status" className={successClassName}>
          비밀번호를 바꿨어요.
        </p>
      )}
      <Button type="submit" disabled={!canSubmit} className="sm:self-end">
        비밀번호 변경
      </Button>
    </Card>
  )
}

function WithdrawSection() {
  const navigate = useNavigate()
  const withdraw = useWithdraw()
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')

  const close = () => {
    setOpen(false)
    setPassword('')
    withdraw.reset()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (password.length === 0 || withdraw.isPending) return

    withdraw.mutate(
      { password },
      { onSuccess: () => navigate('/login', { replace: true }) },
    )
  }

  return (
    <Card as="section" className={cardClassName}>
      <div className="flex flex-col gap-1">
        <h2 className="text-ink text-xl font-bold">회원 탈퇴</h2>
        <p className="text-ink-sub text-sm">
          탈퇴하면 이메일·이름·학과가 지워지고 다시 로그인할 수 없어요. 내가
          만든 세션과 남긴 질문은 다른 참여자의 기록이기도 해서 "탈퇴한
          사용자"로 남아요.
        </p>
      </div>
      <Button
        variant="danger"
        className="sm:self-end"
        onClick={() => setOpen(true)}
      >
        회원 탈퇴
      </Button>

      <Modal
        open={open}
        title="정말 탈퇴할까요?"
        description="본인 확인을 위해 현재 비밀번호를 입력해 주세요. 탈퇴는 되돌릴 수 없어요."
        onClose={close}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <PasswordInput
            label="현재 비밀번호"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {withdraw.isError && (
            <p role="alert" className={errorClassName}>
              {getApiErrorMessage(withdraw.error, '탈퇴하지 못했어요.')}
            </p>
          )}
          <Button
            type="submit"
            variant="danger"
            disabled={password.length === 0 || withdraw.isPending}
          >
            탈퇴하기
          </Button>
        </form>
      </Modal>
    </Card>
  )
}

export default function MyPage() {
  const me = useMe()

  return (
    <PageLayout activeMenu="me">
      <main className="mt-8 flex w-full max-w-[720px] flex-1 flex-col gap-6 px-4 pb-12 md:mt-12">
        <BackLink to="/">이전</BackLink>

        <header className="border-line flex flex-col gap-1.5 border-b pb-[25px]">
          <BrandEyebrow />
          <h1 className="text-ink text-2xl font-bold sm:text-[32px]">
            내 정보
          </h1>
          <p className="text-ink-sub text-sm">
            계정 정보를 확인하고 바꿀 수 있어요.
          </p>
        </header>

        {me.data ? (
          <>
            <ProfileForm user={me.data} />
            <PasswordForm />
            <WithdrawSection />
          </>
        ) : (
          <StateMessage tone={me.isError ? 'error' : 'muted'}>
            {me.isError
              ? getApiErrorMessage(me.error, '내 정보를 불러오지 못했어요.')
              : '내 정보를 불러오는 중이에요.'}
          </StateMessage>
        )}
      </main>
    </PageLayout>
  )
}
