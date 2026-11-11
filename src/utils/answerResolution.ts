import type { Question } from '@/types/question'

/**
 * 발표자가 질문을 어떻게 마무리했는지.
 * 서버에는 완료 여부만 있어서 답변 구성으로 판단한다. AI 답변이 있는 질문은 직접 답변을 쓸 때 내용을 꼭 받으므로,
 * 완료됐는데 발표자 답변이 없으면 AI 답변으로 마무리한 것이다.
 * - NONE: 아직 완료 전
 * - PRESENTER: 발표자가 직접 답변을 남김
 * - AI: AI 답변으로 마무리
 * - VERBAL: AI 답변 없이 현장에서 말로 답하고 완료만 표시
 */
export type AnswerResolution = 'NONE' | 'PRESENTER' | 'AI' | 'VERBAL'

export const getAnswerResolution = (question: Question): AnswerResolution => {
  if (!question.answered) return 'NONE'
  if (question.answers.some(({ type }) => type === 'PRESENTER')) {
    return 'PRESENTER'
  }

  return question.answers.some(({ type }) => type === 'AI') ? 'AI' : 'VERBAL'
}

/** 완료된 질문에 붙이는 태그 문구 */
export const resolutionLabel: Record<
  Exclude<AnswerResolution, 'NONE'>,
  string
> = {
  PRESENTER: '발표자 답변 완료',
  AI: 'AI 답변으로 완료',
  VERBAL: '현장에서 답변 완료',
}
