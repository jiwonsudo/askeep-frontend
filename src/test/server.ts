import { setupServer } from 'msw/node'

/** 테스트용 가짜 API 서버. 각 테스트에서 server.use(...)로 응답을 정한다 */
export const server = setupServer()

export const API_URL = 'http://localhost/api/v1'
