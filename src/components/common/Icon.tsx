import type { ImgHTMLAttributes } from 'react'

import iconAiCallout from '@/assets/icon-ai-callout.svg'
import iconAiSummary from '@/assets/icon-ai-summary.svg'
import iconArrowLeftSmall from '@/assets/icon-arrow-left-small.svg'
import iconArrowLeft from '@/assets/icon-arrow-left.svg'
import iconArrowRightSmall from '@/assets/icon-arrow-right-small.svg'
import iconArrowRight from '@/assets/icon-arrow-right.svg'
import iconBookOpen from '@/assets/icon-book-open.svg'
import iconCalloutInfo from '@/assets/icon-callout-info.svg'
import iconCheckboxChecked from '@/assets/icon-checkbox-checked.svg'
import iconChevronDownBlue from '@/assets/icon-chevron-down-blue.svg'
import iconChevronDownGray from '@/assets/icon-chevron-down-gray.svg'
import iconChevronLeft from '@/assets/icon-chevron-left.svg'
import iconChevronRight from '@/assets/icon-chevron-right.svg'
import iconChevronUp from '@/assets/icon-chevron-up.svg'
import iconCopy from '@/assets/icon-copy.svg'
import iconExit from '@/assets/icon-exit.svg'
import iconFullscreen from '@/assets/icon-fullscreen.svg'
import iconGithub from '@/assets/icon-github.svg'
import iconInfo from '@/assets/icon-info.svg'
import iconInstagram from '@/assets/icon-instagram.svg'
import iconKey from '@/assets/icon-key.svg'
import iconLoading from '@/assets/icon-loading.svg'
import iconPowerExit from '@/assets/icon-power-exit.svg'
import iconSend from '@/assets/icon-send.svg'
import iconSparklesBlue from '@/assets/icon-sparkles-blue.svg'
import iconSparklesGray from '@/assets/icon-sparkles-gray.svg'
import iconSparkles from '@/assets/icon-sparkles.svg'
import iconSpeechFilled from '@/assets/icon-speech-filled.svg'
import iconSpeech from '@/assets/icon-speech.svg'
import iconStepArrow from '@/assets/icon-step-arrow.svg'
import iconTrash from '@/assets/icon-trash.svg'
import iconUploadCloud from '@/assets/icon-upload-cloud.svg'
import iconVisibilityOff from '@/assets/icon-visibility-off.svg'
import iconVisibility from '@/assets/icon-visibility.svg'

/** 디자인 시스템의 아이콘 모음. 색은 에셋에 이미 들어 있어서 이름에 색이 붙은 것도 있다 */
const icons = {
  'ai-callout': iconAiCallout,
  'ai-summary': iconAiSummary,
  'arrow-left-small': iconArrowLeftSmall,
  'arrow-left': iconArrowLeft,
  'arrow-right-small': iconArrowRightSmall,
  'arrow-right': iconArrowRight,
  'book-open': iconBookOpen,
  'callout-info': iconCalloutInfo,
  'checkbox-checked': iconCheckboxChecked,
  'chevron-down-blue': iconChevronDownBlue,
  'chevron-down-gray': iconChevronDownGray,
  'chevron-left': iconChevronLeft,
  'chevron-right': iconChevronRight,
  'chevron-up': iconChevronUp,
  copy: iconCopy,
  exit: iconExit,
  fullscreen: iconFullscreen,
  github: iconGithub,
  info: iconInfo,
  instagram: iconInstagram,
  key: iconKey,
  loading: iconLoading,
  'power-exit': iconPowerExit,
  send: iconSend,
  'sparkles-blue': iconSparklesBlue,
  'sparkles-gray': iconSparklesGray,
  sparkles: iconSparkles,
  'speech-filled': iconSpeechFilled,
  speech: iconSpeech,
  'step-arrow': iconStepArrow,
  trash: iconTrash,
  'upload-cloud': iconUploadCloud,
  'visibility-off': iconVisibilityOff,
  visibility: iconVisibility,
} as const

export type IconName = keyof typeof icons

interface IconProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'alt'
> {
  name: IconName
  /** 의미가 있는 아이콘이면 설명을 준다. 장식용이면 비워 둔다 */
  label?: string
}

export default function Icon({ name, label, ...props }: IconProps) {
  return <img src={icons[name]} alt={label ?? ''} {...props} />
}
