import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { downloadMaterial } from '@/api/session'
import { getApiErrorMessage } from '@/api/client'
import { API_URL, server } from '@/test/server'

const PDF = '%PDF-1.7 test'

const pdfResponse = (headers: Record<string, string> = {}) =>
  new HttpResponse(PDF, {
    headers: { 'Content-Type': 'application/pdf', ...headers },
  })

describe('downloadMaterial', () => {
  it('한글 파일명은 filename*=UTF-8 쪽에서 꺼낸다', async () => {
    server.use(
      http.get(`${API_URL}/materials/7/download`, () =>
        pdfResponse({
          'Content-Disposition': `attachment; filename="=?UTF-8?Q?x?="; filename*=UTF-8''${encodeURIComponent('1주차 발표자료.pdf')}`,
        }),
      ),
    )

    const { blob, fileName } = await downloadMaterial(7, 'fallback.pdf')

    expect(fileName).toBe('1주차 발표자료.pdf')
    expect(await blob.text()).toBe(PDF)
  })

  it('filename*가 없으면 일반 filename을 쓴다', async () => {
    server.use(
      http.get(`${API_URL}/materials/7/download`, () =>
        pdfResponse({
          'Content-Disposition': 'attachment; filename="slides.pdf"',
        }),
      ),
    )

    const { fileName } = await downloadMaterial(7, 'fallback.pdf')

    expect(fileName).toBe('slides.pdf')
  })

  it('헤더가 없으면 넘겨준 이름을 쓴다', async () => {
    server.use(http.get(`${API_URL}/materials/7/download`, () => pdfResponse()))

    const { fileName } = await downloadMaterial(7, 'fallback.pdf')

    expect(fileName).toBe('fallback.pdf')
  })

  it('로그인 토큰을 Authorization 헤더로 보낸다', async () => {
    localStorage.setItem('accessToken', 'token-123')
    let authorization: string | null = null
    server.use(
      http.get(`${API_URL}/materials/7/download`, ({ request }) => {
        authorization = request.headers.get('Authorization')
        return pdfResponse()
      }),
    )

    await downloadMaterial(7, 'fallback.pdf')

    expect(authorization).toBe('Bearer token-123')
  })

  it('실패 응답의 서버 에러 문구를 읽을 수 있게 바꿔 둔다', async () => {
    server.use(
      http.get(`${API_URL}/materials/7/download`, () =>
        HttpResponse.json(
          {
            success: false,
            error: {
              message:
                '종료되지 않은 세션은 host 또는 참여자만 요청할 수 있습니다.',
            },
          },
          { status: 403 },
        ),
      ),
    )

    const error = await downloadMaterial(7, 'fallback.pdf').catch((e) => e)

    expect(getApiErrorMessage(error, '기본 문구')).toBe(
      '종료되지 않은 세션은 host 또는 참여자만 요청할 수 있습니다.',
    )
  })
})
