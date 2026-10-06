import { twMerge } from 'tailwind-merge'

/**
 * Tailwind 클래스를 합칠 때 같은 속성이 겹치면 뒤에 온 클래스가 이기도록 정리한다.
 * (그냥 문자열로 이어 붙이면 어느 쪽이 적용될지 CSS 순서에 달려 있다)
 */
export const cn = (...classes: (string | false | null | undefined)[]) =>
  twMerge(classes.filter(Boolean).join(' '))
