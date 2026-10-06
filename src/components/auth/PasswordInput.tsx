import type { ComponentProps } from 'react'
import { useState } from 'react'

import Icon from '@/components/common/Icon'
import Input from '@/components/common/Input'

type PasswordInputProps = Omit<
  ComponentProps<typeof Input>,
  'type' | 'endAdornment'
>

/** 눈 모양 버튼으로 비밀번호를 보였다 숨기는 입력창 */
export default function PasswordInput(props: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <Input
      {...props}
      type={visible ? 'text' : 'password'}
      endAdornment={
        <button
          type="button"
          aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
          className="cursor-pointer"
        >
          <Icon
            name={visible ? 'visibility-off' : 'visibility'}
            className="size-5"
          />
        </button>
      }
    />
  )
}
