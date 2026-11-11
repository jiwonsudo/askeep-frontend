import { getApiErrorMessage } from '@/api/client'
import AiAnswer from '@/components/question/AiAnswer'
import {
  useSetPresenterRequested,
  useSetQuestionLiked,
} from '@/hooks/useQuestion'
import { formatRelativeTime } from '@/utils/date'
import type { AnswerSource, Question } from '@/types/question'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import StatusTag from '@/components/common/StatusTag'
import { getAnswerResolution, resolutionLabel } from '@/utils/answerResolution'
import { formatAuthorName } from '@/utils/format'

interface QuestionCardProps {
  question: Question
  /** 세션이 진행 중인지. 발표자에게 직접 묻기는 진행 중에만 요청할 수 있다 */
  live: boolean
  onSourceSelect?: (source: AnswerSource) => void
}

export default function QuestionCard({
  question,
  live,
  onSourceSelect,
}: QuestionCardProps) {
  const like = useSetQuestionLiked(question.sessionId, question.id)
  const presenterRequest = useSetPresenterRequested(question.id)
  const error = like.error ?? presenterRequest.error

  const authorName = formatAuthorName(question)
  const resolution = getAnswerResolution(question)
  const presenterAnswers = question.answers.filter(
    (answer) => answer.type === 'PRESENTER',
  )
  // 내 질문이고 아직 답변 전일 때만 발표자에게 직접 물을 수 있다
  const canRequest = Boolean(question.mine) && live && !question.answered

  return (
    <Card
      as="article"
      variant={question.mine ? 'selected' : 'default'}
      className="flex flex-col p-[21px]"
    >
      <header className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center">
          {question.mine ? (
            <span className="bg-brand-deep shrink-0 rounded px-2 py-0.5 text-[13px] font-bold text-white">
              내 질문
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="bg-canvas-subtle border-line-soft text-ink-sub flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
            >
              {authorName.charAt(0)}
            </span>
          )}
          <span className="text-ink-sub truncate pl-2 text-xs font-medium">
            {authorName}
          </span>
          <time className="text-ink-time shrink-0 pl-2 text-xs font-medium">
            {formatRelativeTime(question.createdAt)}
          </time>
        </div>
        {/* 내 질문에는 누를 수 없게 하고 받은 공감 수만 보여 준다 */}
        {question.mine ? (
          question.likeCount > 0 && (
            <span className="text-ink-sub shrink-0 text-xs font-medium">
              나도 궁금해요 {question.likeCount}
            </span>
          )
        ) : (
          <Button
            variant={question.likedByMe ? 'outline' : 'secondary'}
            className={`h-11 shrink-0 ${question.likedByMe ? '' : 'text-ink'}`}
            aria-pressed={Boolean(question.likedByMe)}
            disabled={like.isPending}
            onClick={() => like.mutate(!question.likedByMe)}
          >
            나도 궁금해요
            {question.likeCount > 0 && ` ${question.likeCount}`}
          </Button>
        )}
      </header>

      <p className="text-ink pt-[13px] text-base leading-[25px] font-medium break-words whitespace-pre-wrap">
        {question.content}
      </p>

      {(question.answered || question.presenterRequested || canRequest) && (
        <div className="flex flex-wrap items-center gap-2 pt-3">
          {resolution !== 'NONE' && (
            <StatusTag variant={resolution === 'AI' ? 'info' : 'success'}>
              {resolutionLabel[resolution]}
            </StatusTag>
          )}
          {question.presenterRequested && !question.answered && (
            <StatusTag variant="request">발표자에게 직접 질문</StatusTag>
          )}
          {canRequest && (
            <button
              type="button"
              disabled={presenterRequest.isPending}
              onClick={() =>
                presenterRequest.mutate(!question.presenterRequested)
              }
              className="text-request cursor-pointer text-xs font-bold underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {question.presenterRequested
                ? '요청 취소'
                : '발표자에게 직접 묻기'}
            </button>
          )}
        </div>
      )}

      {error != null && (
        <p role="alert" className="text-danger pt-2 text-xs font-medium">
          {getApiErrorMessage(error, '요청을 처리하지 못했어요.')}
        </p>
      )}

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
        <AiAnswer question={question} onSourceSelect={onSourceSelect} />
      </div>
    </Card>
  )
}
