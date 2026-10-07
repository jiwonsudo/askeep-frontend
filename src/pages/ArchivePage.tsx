import { useQueries } from '@tanstack/react-query'
import { useState } from 'react'
import { useLocation } from 'react-router'

import { getSessionSummary } from '@/api/session'
import { getApiErrorMessage } from '@/api/client'
import ArchiveSessionItem from '@/components/archive/ArchiveSessionItem'
import Chip from '@/components/common/Chip'
import PageLayout from '@/components/common/PageLayout'
import { sessionKeys, useMySessions } from '@/hooks/useSession'
import { parseServerDate } from '@/utils/date'
import BrandEyebrow from '@/components/common/BrandEyebrow'
import StateMessage from '@/components/common/StateMessage'
import BackLink from '@/components/common/BackLink'

const normalizeTag = (tag: string) => tag.replace(/^#/, '').trim()

export default function ArchivePage() {
  const mySessions = useMySessions()
  // 세션을 종료하고 넘어온 경우 방금 끝낸 세션을 펼쳐서 바로 보여준다
  const location = useLocation()
  const [expandedId, setExpandedId] = useState<number | undefined>(
    (location.state as { expandedId?: number } | null)?.expandedId,
  )
  const [selectedTag, setSelectedTag] = useState<string>()

  // 종료된 세션만 아카이브에 보여주고, 최근에 끝난 순으로 정렬한다
  const archived = (mySessions.data ?? [])
    .filter(({ session }) => session.status === 'ENDED')
    .sort(
      (a, b) =>
        parseServerDate(b.session.endedAt ?? b.session.createdAt).getTime() -
        parseServerDate(a.session.endedAt ?? a.session.createdAt).getTime(),
    )

  // 태그는 요약 응답에만 있어서, 요약이 끝난 세션의 요약을 가져와 모은다
  const summarized = archived.filter(
    ({ summaryStatus }) => summaryStatus === 'COMPLETED',
  )
  const summaries = useQueries({
    queries: summarized.map(({ session }) => ({
      queryKey: sessionKeys.summary(session.sessionId),
      queryFn: () => getSessionSummary(session.sessionId),
    })),
  })

  const tagsBySession = new Map<number, string[]>()
  summarized.forEach(({ session }, index) => {
    const tags = summaries[index]?.data?.tags ?? []
    tagsBySession.set(session.sessionId, tags.map(normalizeTag).filter(Boolean))
  })

  const allTags = [...new Set([...tagsBySession.values()].flat())]
  const visible = selectedTag
    ? archived.filter(({ session }) =>
        tagsBySession.get(session.sessionId)?.includes(selectedTag),
      )
    : archived

  return (
    <PageLayout activeMenu="archive">
      <main className="flex w-full max-w-[1480px] flex-1 flex-col px-4 pb-12 md:px-10">
        <div className="mt-8 md:mt-12">
          <BackLink to="/">이전</BackLink>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:mt-9">
          <div className="flex flex-col gap-1.5">
            <BrandEyebrow />
            <div className="border-line flex flex-col gap-2 border-b pb-[25px]">
              <h1 className="text-ink text-2xl font-bold sm:text-[32px]">
                세션 아카이브
              </h1>
              <p className="text-ink-sub text-sm">
                함께 나눈 질문과 답변을 다시 살펴보세요.
              </p>
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              <Chip
                selected={selectedTag === undefined}
                onClick={() => setSelectedTag(undefined)}
              >
                전체
              </Chip>
              {allTags.map((name) => (
                <Chip
                  key={name}
                  selected={selectedTag === name}
                  onClick={() => setSelectedTag(name)}
                >
                  {name}
                </Chip>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-6">
            {mySessions.isPending && (
              <StateMessage className="py-10">
                세션을 불러오는 중이에요.
              </StateMessage>
            )}
            {mySessions.isError && (
              <StateMessage tone="error" className="py-10">
                {getApiErrorMessage(
                  mySessions.error,
                  '아카이브를 불러오지 못했어요.',
                )}
              </StateMessage>
            )}
            {mySessions.isSuccess && visible.length === 0 && (
              <StateMessage className="py-10">
                {selectedTag
                  ? '이 태그의 세션이 없어요.'
                  : '아직 종료된 세션이 없어요.'}
              </StateMessage>
            )}
            {visible.map((item) => (
              <ArchiveSessionItem
                key={item.session.sessionId}
                item={item}
                tags={tagsBySession.get(item.session.sessionId) ?? []}
                expanded={expandedId === item.session.sessionId}
                onToggle={() =>
                  setExpandedId((current) =>
                    current === item.session.sessionId
                      ? undefined
                      : item.session.sessionId,
                  )
                }
              />
            ))}
          </div>
        </div>
      </main>
    </PageLayout>
  )
}
