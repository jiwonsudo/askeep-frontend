import { useState } from 'react'
import { useLocation } from 'react-router'

import { getApiErrorMessage } from '@/api/client'
import ArchiveSessionItem from '@/components/archive/ArchiveSessionItem'
import Chip from '@/components/common/Chip'
import Icon from '@/components/common/Icon'
import PageLayout from '@/components/common/PageLayout'
import DeleteSessionModal from '@/components/session/DeleteSessionModal'
import { useDeleteSession, useMySessions } from '@/hooks/useSession'
import { parseServerDate } from '@/utils/date'
import BrandEyebrow from '@/components/common/BrandEyebrow'
import StateMessage from '@/components/common/StateMessage'
import BackLink from '@/components/common/BackLink'
import type { MySession, Session } from '@/types/session'

const normalizeTag = (tag: string) => tag.replace(/^#/, '').trim()

type SortOrder = 'latest' | 'title'

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'title', label: '제목순' },
]

const endedTime = ({ session }: MySession) =>
  parseServerDate(session.endedAt ?? session.createdAt).getTime()

const compare: Record<SortOrder, (a: MySession, b: MySession) => number> = {
  // 최근에 끝난 세션부터
  latest: (a, b) => endedTime(b) - endedTime(a),
  title: (a, b) =>
    a.session.title.localeCompare(b.session.title, 'ko') ||
    endedTime(b) - endedTime(a),
}

export default function ArchivePage() {
  const mySessions = useMySessions()
  // 세션을 종료하고 넘어온 경우 방금 끝낸 세션을 펼쳐서 바로 보여준다
  const location = useLocation()
  const [expandedId, setExpandedId] = useState<number | undefined>(
    (location.state as { expandedId?: number } | null)?.expandedId,
  )
  const [selectedTag, setSelectedTag] = useState<string>()
  const [tagsOpen, setTagsOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest')
  const deleteSession = useDeleteSession()
  const [deleteTarget, setDeleteTarget] = useState<Session>()

  const closeDelete = () => {
    setDeleteTarget(undefined)
    deleteSession.reset()
  }

  // 종료된 세션만 아카이브에 보여준다
  const archived = (mySessions.data ?? [])
    .filter(({ session }) => session.status === 'ENDED')
    .sort(compare[sortOrder])

  // 태그 칩은 전체 목록에서 모아야 해서, 서버의 태그 필터 대신 받아 둔 목록에서 거른다
  const tagsOf = ({ tags }: MySession) => tags.map(normalizeTag).filter(Boolean)
  const allTags = [...new Set(archived.flatMap(tagsOf))]

  // 제목·설명·태그에서 찾는다. 대소문자는 구분하지 않는다
  const query = keyword.trim().toLowerCase()
  const matches = (item: MySession) =>
    [item.session.title, item.session.description ?? '', ...tagsOf(item)].some(
      (text) => text.toLowerCase().includes(query),
    )

  const visible = archived.filter(
    (item) =>
      (!selectedTag || tagsOf(item).includes(selectedTag)) &&
      (!query || matches(item)),
  )
  const filtering = Boolean(selectedTag || query)

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

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <input
              type="search"
              aria-label="세션 검색"
              placeholder="세션 제목·내용·태그로 검색"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className="border-line placeholder:text-ink-muted focus:border-brand-deep h-11 w-full min-w-0 rounded-lg border bg-white px-4 text-base font-medium outline-none sm:flex-1 sm:text-sm"
            />
            <div className="flex shrink-0 items-center justify-between gap-2.5">
              <select
                aria-label="정렬"
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as SortOrder)
                }
                className="border-line text-ink h-11 cursor-pointer rounded-lg border bg-white px-3 text-base font-medium sm:text-sm"
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {allTags.length > 0 && (
                <button
                  type="button"
                  aria-expanded={tagsOpen}
                  aria-controls="archive-tags"
                  onClick={() => setTagsOpen((open) => !open)}
                  className="border-line text-ink-button hover:bg-canvas-subtle flex h-11 cursor-pointer items-center gap-1 rounded-lg border bg-white pr-2 pl-3.5 text-sm font-medium transition"
                >
                  {selectedTag ? `태그: ${selectedTag}` : '태그로 보기'}
                  <Icon
                    name="chevron-down-gray"
                    className={`size-5 transition ${tagsOpen ? 'rotate-180' : ''}`}
                  />
                </button>
              )}
            </div>
          </div>

          {allTags.length > 0 && tagsOpen && (
            <div id="archive-tags" className="flex flex-wrap gap-2">
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
                {filtering
                  ? '조건에 맞는 세션이 없어요.'
                  : '아직 종료된 세션이 없어요.'}
              </StateMessage>
            )}
            {visible.map((item) => (
              <ArchiveSessionItem
                key={item.session.sessionId}
                item={item}
                tags={tagsOf(item)}
                expanded={expandedId === item.session.sessionId}
                onDelete={
                  item.myRole === 'PRESENTER'
                    ? () => setDeleteTarget(item.session)
                    : undefined
                }
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

      <DeleteSessionModal
        open={deleteTarget !== undefined}
        title={deleteTarget?.title}
        ended
        pending={deleteSession.isPending}
        error={deleteSession.error}
        onClose={closeDelete}
        onConfirm={() => {
          if (!deleteTarget) return

          deleteSession.mutate(deleteTarget.sessionId, {
            onSuccess: closeDelete,
          })
        }}
      />
    </PageLayout>
  )
}
