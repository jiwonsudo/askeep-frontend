import { useState } from 'react'

import Icon from '@/components/common/Icon'
import JoinQrOverlay from '@/components/session/JoinQrOverlay'

interface EntryCodeBannerProps {
  /** 세션 정보가 아직 없으면 undefined */
  entryCode?: string
  /** 코드 오른쪽에 보여주는 안내 문구 */
  hint?: string
}

type Copied = 'code' | 'link' | null

/** 누르면 입장 코드 입력 없이 바로 세션에 참여하는 링크 */
const getJoinLink = (entryCode: string) =>
  `${window.location.origin}/join/${entryCode}`

const buttonClassName =
  'border-info-line text-brand-deep flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-lg border bg-white px-2 text-sm font-bold whitespace-nowrap sm:px-[17px] disabled:cursor-not-allowed disabled:opacity-50'

/** 발표자가 참여자에게 공유할 입장 코드를 보여주고, 코드나 참여 링크를 공유할 수 있는 배너 */
export default function EntryCodeBanner({
  entryCode,
  hint = '참여자에게 이 코드를 공유해 주세요',
}: EntryCodeBannerProps) {
  const [copied, setCopied] = useState<Copied>(null)
  const [qrOpen, setQrOpen] = useState(false)

  const copy = async (text: string, kind: Exclude<Copied, null>) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(kind)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // 클립보드를 쓸 수 없는 환경에서는 복사 표시를 하지 않는다
    }
  }

  const handleShareLink = async () => {
    if (!entryCode) return
    const url = getJoinLink(entryCode)

    // 모바일에서는 공유 시트로 카카오톡 등에 바로 보낼 수 있게 하고, 없으면 링크를 복사한다
    if (navigator.share) {
      try {
        await navigator.share({ title: 'ASKeep 세션 참여', url })
        return
      } catch (error) {
        // 사용자가 공유 시트를 닫은 경우엔 아무것도 하지 않는다
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }
    await copy(url, 'link')
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
      {/* 모바일에서는 버튼 세 개를 한 줄에 같은 폭으로 나눈다 */}
      <div className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto sm:items-center sm:gap-3">
        <span className="text-ink-button hidden text-sm sm:inline">{hint}</span>
        <button
          type="button"
          onClick={() => entryCode && copy(entryCode, 'code')}
          disabled={!entryCode}
          className={buttonClassName}
        >
          <Icon name="copy" className="size-4" />
          {copied === 'code' ? '복사됨' : '코드 복사'}
        </button>
        <button
          type="button"
          onClick={handleShareLink}
          disabled={!entryCode}
          className={buttonClassName}
        >
          <Icon name="link" className="size-4" />
          {copied === 'link' ? '링크 복사됨' : '링크 공유'}
        </button>
        <button
          type="button"
          onClick={() => setQrOpen(true)}
          disabled={!entryCode}
          className={buttonClassName}
        >
          <Icon name="qr" className="size-4" />
          QR 띄우기
        </button>
      </div>
      {qrOpen && entryCode && (
        <JoinQrOverlay
          entryCode={entryCode}
          joinLink={getJoinLink(entryCode)}
          onClose={() => setQrOpen(false)}
        />
      )}
    </div>
  )
}
