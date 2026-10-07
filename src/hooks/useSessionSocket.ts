import { Client } from '@stomp/stompjs'
import { useEffect, useRef } from 'react'

import type { SessionTopicEvent } from '@/types/realtime'

/**
 * 환경 변수가 `/ws`처럼 경로만 있으면(개발 서버 프록시를 쓸 때) 지금 접속한 주소에 붙여서 완전한 웹소켓 주소로 만든다.
 */
const resolveBrokerUrl = (url: string) => {
  if (!url.startsWith('/')) return url

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'

  return `${protocol}://${window.location.host}${url}`
}

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
      brokerURL: resolveBrokerUrl(import.meta.env.VITE_WS_BASE_URL),
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
