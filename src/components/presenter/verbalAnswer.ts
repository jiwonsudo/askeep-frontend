import type { Answer } from '@/types/question'

/**
 * 백엔드에 "답변 완료" 표시 전용 API가 없어서, 말로 답변했다는 표시는
 * 이 고정 문구의 발표자 답변을 하나 남기는 것으로 대신한다.
 */
export const VERBAL_ANSWER_CONTENT = '발표자가 현장에서 구두로 답변했어요.'

/** 직접 쓴 답변이 아니라 "말로 답변했음" 표시용으로 남긴 답변인지 */
export const isVerbalAnswer = (answer: Answer) =>
  answer.content === VERBAL_ANSWER_CONTENT
