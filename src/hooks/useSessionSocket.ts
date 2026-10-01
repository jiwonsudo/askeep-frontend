import { Client } from '@stomp/stompjs'
import { useEffect, useRef } from 'react'

import type { SessionTopicEvent } from '@/types/realtime'

/**
 * 세션 토픽(/topic/sessions/{sessionId})을 구독한다. 받기 전용이라
 * 클라이언트에서 메시지를 보내는 기능은 없다.
 */
export const useSessionSocket = (
  sessionId: number | undefined,
  onEvent: (event: SessionTopicEvent) => void,
) => {
  const onEventRef = useRef(onEvent)

  useEffect(() => {
    onEventRef.current = onEvent
  }, [onEvent])

  useEffect(() => {
    if (!sessionId) return

    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) return

    const client = new Client({
      brokerURL: import.meta.env.VITE_WS_BASE_URL,
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/sessions/${sessionId}`, (message) => {
          const event = JSON.parse(message.body) as SessionTopicEvent
          onEventRef.current(event)
        })
      },
    })

    client.activate()

    return () => {
      void client.deactivate()
    }
  }, [sessionId])
}
