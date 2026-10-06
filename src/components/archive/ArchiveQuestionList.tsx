import Icon from '@/components/common/Icon'
import ArchiveQuestionItem from '@/components/archive/ArchiveQuestionItem'
import { useQuestions } from '@/hooks/useQuestion'

interface ArchiveQuestionListProps {
  sessionId: number
}

export default function ArchiveQuestionList({
  sessionId,
}: ArchiveQuestionListProps) {
  const { data, isPending, isError } = useQuestions(sessionId)

  // 오래된 질문부터 Q1, Q2 순서로 보여준다
  const items = [...(data?.items ?? [])].sort((a, b) => a.id - b.id)

  return (
    <section className="flex flex-col gap-4">
      <header className="border-line flex items-center justify-between border-b pb-[13px]">
        <h3 className="text-ink flex items-center gap-2.5 text-xl font-bold">
          <Icon name="speech-filled" className="h-[19px] w-5" />
          질문과 답변
        </h3>
        <span className="text-ink-muted text-xs font-medium">
          총 {data?.totalElements ?? 0}개 질의응답
        </span>
      </header>

      {isPending && (
        <p className="text-ink-muted text-sm">질문을 불러오는 중이에요.</p>
      )}
      {isError && (
        <p role="alert" className="text-danger text-sm">
          질문을 불러오지 못했어요.
        </p>
      )}
      {data && items.length === 0 && (
        <p className="text-ink-muted text-sm">기록된 질문이 없어요.</p>
      )}

      <ul className="flex flex-col gap-3">
        {items.map((question, index) => (
          <ArchiveQuestionItem
            key={question.id}
            question={question}
            order={index + 1}
            defaultExpanded={index === 0}
          />
        ))}
      </ul>
    </section>
  )
}
