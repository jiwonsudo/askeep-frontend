import AiAnswer from '@/components/question/AiAnswer'
import { formatRelativeTime } from '@/utils/date'
import type { Question } from '@/types/question'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'

interface QuestionCardProps {
  question: Question
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const authorName =
    question.anonymous || !question.author ? '익명' : question.author.username
  const presenterAnswers = question.answers.filter(
    (answer) => answer.type === 'PRESENTER',
  )

  return (
    <Card
      as="article"
      variant={question.mine ? 'selected' : 'default'}
      className="flex flex-col p-[21px]"
    >
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center">
          {question.mine ? (
            <span className="bg-brand-deep rounded px-2 py-0.5 text-[13px] font-bold text-white">
              내 질문
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="bg-canvas-subtle border-line-soft text-ink-sub flex size-6 items-center justify-center rounded-full border text-xs font-bold"
            >
              {authorName.charAt(0)}
            </span>
          )}
          <span className="text-ink-sub pl-2 text-xs font-medium">
            {authorName}
          </span>
          <time className="text-ink-time pl-2 text-xs font-medium">
            {formatRelativeTime(question.createdAt)}
          </time>
        </div>
        {/* 백엔드에 좋아요 API가 생기기 전까지는 누를 수 없게 둔다 */}
        <Button
          variant="secondary"
          className="text-ink h-11 shrink-0"
          disabled
          title="아직 지원하지 않는 기능이에요"
        >
          나도 궁금해요
        </Button>
      </header>

      <p className="text-ink pt-[13px] text-base leading-[25px] font-medium break-words whitespace-pre-wrap">
        {question.content}
      </p>

      <div className="flex flex-col gap-3 pt-3.5">
        {presenterAnswers.map((answer) => (
          <div
            key={answer.id}
            className="border-request-line bg-request-bg flex flex-col gap-1 rounded-lg border px-[17px] py-3"
          >
            <span className="text-request text-sm font-bold">발표자 답변</span>
            <p className="text-ink text-sm break-words whitespace-pre-wrap">
              {answer.content}
            </p>
          </div>
        ))}
        <AiAnswer question={question} />
      </div>
    </Card>
  )
}
