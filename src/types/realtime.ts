import type { Question } from '@/types/question'
import type { SessionStatus } from '@/types/session'

export type RealtimeEventType =
  | 'SESSION_STATUS_CHANGED'
  | 'QUESTION_CREATED'
  | 'QUESTION_UPDATED'
  | 'QUESTION_DELETED'

interface BaseEvent<Type extends RealtimeEventType, Data> {
  eventId: string
  type: Type
  sessionId: number
  occurredAt: string
  data: Data
}

export type SessionStatusChangedEvent = BaseEvent<
  'SESSION_STATUS_CHANGED',
  { status: SessionStatus }
>

export type QuestionCreatedEvent = BaseEvent<'QUESTION_CREATED', Question>

export type QuestionUpdatedEvent = BaseEvent<'QUESTION_UPDATED', Question>

export type QuestionDeletedEvent = BaseEvent<
  'QUESTION_DELETED',
  { questionId: number }
>

export type SessionTopicEvent =
  | SessionStatusChangedEvent
  | QuestionCreatedEvent
  | QuestionUpdatedEvent
  | QuestionDeletedEvent
