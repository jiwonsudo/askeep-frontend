import { Client } from '@stomp/stompjs'
import { useEffect, useRef } from 'react'

import type { SessionTopicEvent } from '@/types/realtime'
import { getAccessToken } from '@/utils/authStorage'

/**
 * 환경 변수가 `/ws`처럼 경로만 있으면(개발 서버 프록시를 쓸 때) 지금 접속한 주소에 붙여서 완전한 웹소켓 주소로 만든다.
 */
const resolveBrokerUrl = (url: string) => {
  if (!url.startsWith('/')) return url

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'

  return `${protocol}://${window.location.host}${url}`
}

/** 연결 요청에 서버가 이 시간 안에 답하지 않으면 끊고 다시 연결한다 */
const CONNECTION_TIMEOUT_MS = 10000

/**
 * 세션 토픽(/topic/sessions/{sessionId})을 구독한다. 받기 전용이라
 * 클라이언트에서 메시지를 보내는 기능은 없다.
 * `onConnect`는 (다시) 연결돼 구독을 마칠 때마다 불린다. 연결이 없던 동안 놓친 알림을 메울 때 쓴다.
 */
export const useSessionSocket = (
  sessionId: number | undefined,
  onEvent: (event: SessionTopicEvent) => void,
  onConnect?: () => void,
) => {
  const onEventRef = useRef(onEvent)
  const onConnectRef = useRef(onConnect)

  useEffect(() => {
    onEventRef.current = onEvent
    onConnectRef.current = onConnect
  }, [onEvent, onConnect])

  useEffect(() => {
    if (!sessionId) return

    const accessToken = getAccessToken()
    if (!accessToken) return

    const client = new Client({
      brokerURL: resolveBrokerUrl(import.meta.env.VITE_WS_BASE_URL),
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      reconnectDelay: 5000,
      // 서버가 CONNECTED를 보내지 않으면 기다리기만 하고 다시 연결하지 않으므로 시간 제한을 둔다
      connectionTimeout: CONNECTION_TIMEOUT_MS,
      onConnect: () => {
        client.subscribe(`/topic/sessions/${sessionId}`, (message) => {
          const event = JSON.parse(message.body) as SessionTopicEvent
          onEventRef.current(event)
        })
        onConnectRef.current?.()
      },
    })

    client.activate()

    return () => {
      void client.deactivate()
    }
  }, [sessionId])
}
