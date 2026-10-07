import { useId, useState } from 'react'

import Icon from '@/components/common/Icon'
import { cn } from '@/utils/cn'
import type { FaqEntry } from '@/content/faq'

/** 질문을 누르면 답변이 펼쳐지는 FAQ 한 줄 */
export default function FaqItem({ question, answer }: FaqEntry) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <li>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className={cn(
            'hover:bg-canvas flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition',
            // 펼치면 아래 여백은 답변 영역이 가져가서, 질문과 답변 사이 간격은 그대로 둔다
            open && 'pb-1',
          )}
        >
          <span className="text-ink text-base font-bold">{question}</span>
          <Icon
            name="chevron-down-gray"
            className={cn('size-5 shrink-0 transition', open && 'rotate-180')}
          />
        </button>
      </h3>
      {open && (
        <div
          id={panelId}
          className="text-ink-sub flex flex-col justify-center gap-2 px-5 py-3 text-sm leading-6"
        >
          {answer.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      )}
    </li>
  )
}
