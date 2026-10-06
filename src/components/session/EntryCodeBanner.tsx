import { useState } from 'react'

import Icon from '@/components/common/Icon'

interface EntryCodeBannerProps {
  /** 세션 정보가 아직 없으면 undefined */
  entryCode?: string
}

/** 발표자가 참여자에게 공유할 입장 코드를 보여주고 복사할 수 있는 배너 */
export default function EntryCodeBanner({ entryCode }: EntryCodeBannerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!entryCode) return

    try {
      await navigator.clipboard.writeText(entryCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 클립보드를 쓸 수 없는 환경에서는 복사 표시를 하지 않는다
    }
  }

  return (
    <div className="border-info-line bg-info-bg flex flex-wrap items-center justify-between gap-3 rounded-lg border px-[17px] py-[13px]">
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-md bg-white">
          <Icon name="key" className="size-[18px]" />
        </span>
        <span className="text-ink-button text-base">세션 입장 코드</span>
        <span className="text-brand text-xl font-bold">
          {entryCode ?? '------'}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-ink-button hidden text-sm sm:inline">
          참여자에게 이 코드를 공유해 주세요
        </span>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!entryCode}
          className="border-info-line text-brand-deep flex h-11 cursor-pointer items-center gap-1.5 rounded-lg border bg-white px-[17px] text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="copy" className="size-4" />
          {copied ? '복사됨' : '코드 복사'}
        </button>
      </div>
    </div>
  )
}
