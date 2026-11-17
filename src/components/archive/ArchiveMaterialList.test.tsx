import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import ArchiveMaterialList from '@/components/archive/ArchiveMaterialList'
import { renderWithQuery } from '@/test/render'
import { API_URL, server } from '@/test/server'
import type { SessionMaterial } from '@/types/session'

const material = (
  overrides: Partial<SessionMaterial> = {},
): SessionMaterial => ({
  id: 7,
  sessionId: 1,
  fileName: '1주차 발표자료.pdf',
  contentType: 'application/pdf',
  fileSize: 2048,
  status: 'COMPLETED',
  createdAt: '2026-11-17T10:00:00+09:00',
  updatedAt: '2026-11-17T10:00:00+09:00',
  pageCount: 12,
  ...overrides,
})

const listResponse = (items: SessionMaterial[]) =>
  HttpResponse.json({
    success: true,
    data: {
      items,
      page: 0,
      size: 20,
      totalElements: items.length,
      totalPages: 1,
    },
  })

describe('ArchiveMaterialList', () => {
  let click: ReturnType<typeof vi.spyOn>
  let downloadName: string | undefined

  beforeEach(() => {
    downloadName = undefined
    // jsdom에는 Blob URL과 실제 다운로드가 없어서 저장 직전 단계까지만 확인한다
    URL.createObjectURL = vi.fn(() => 'blob:test')
    URL.revokeObjectURL = vi.fn()
    click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(function (this: HTMLAnchorElement) {
        downloadName = this.download
      })
  })

  afterEach(() => {
    click.mockRestore()
  })

  it('자료 이름·용량·쪽수를 보여준다', async () => {
    server.use(
      http.get(`${API_URL}/sessions/1/materials`, () =>
        listResponse([material()]),
      ),
    )

    renderWithQuery(<ArchiveMaterialList sessionId={1} />)

    expect(await screen.findByText('1주차 발표자료.pdf')).toBeInTheDocument()
    expect(screen.getByText('2.0 KB • 12쪽')).toBeInTheDocument()
    expect(screen.getByText('총 1개')).toBeInTheDocument()
  })

  it('자료가 없으면 안내 문구를 보여준다', async () => {
    server.use(
      http.get(`${API_URL}/sessions/1/materials`, () => listResponse([])),
    )

    renderWithQuery(<ArchiveMaterialList sessionId={1} />)

    expect(await screen.findByText('등록된 자료가 없어요.')).toBeInTheDocument()
  })

  it('내려받기를 누르면 서버가 준 파일명으로 저장한다', async () => {
    server.use(
      http.get(`${API_URL}/sessions/1/materials`, () =>
        listResponse([material()]),
      ),
      http.get(
        `${API_URL}/materials/7/download`,
        () =>
          new HttpResponse('%PDF-1.7', {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent('서버 파일명.pdf')}`,
            },
          }),
      ),
    )

    renderWithQuery(<ArchiveMaterialList sessionId={1} />)
    await userEvent.click(
      await screen.findByRole('button', {
        name: '1주차 발표자료.pdf 내려받기',
      }),
    )

    await vi.waitFor(() => expect(click).toHaveBeenCalledOnce())
    expect(downloadName).toBe('서버 파일명.pdf')
    expect(URL.createObjectURL).toHaveBeenCalledOnce()
  })

  it('원본이 서버에 없으면(410) 그 자료에 안내를 띄운다', async () => {
    server.use(
      http.get(`${API_URL}/sessions/1/materials`, () =>
        listResponse([
          material(),
          material({ id: 8, fileName: '다른 자료.pdf' }),
        ]),
      ),
      http.get(`${API_URL}/materials/7/download`, () =>
        HttpResponse.json(
          { success: false, error: { message: '원본 PDF가 없습니다.' } },
          { status: 410 },
        ),
      ),
    )

    renderWithQuery(<ArchiveMaterialList sessionId={1} />)
    await userEvent.click(
      await screen.findByRole('button', {
        name: '1주차 발표자료.pdf 내려받기',
      }),
    )

    const alerts = await screen.findAllByRole('alert')
    expect(alerts).toHaveLength(1)
    expect(alerts[0]).toHaveTextContent('서버에 원본 파일이 남아 있지 않아요.')
    expect(click).not.toHaveBeenCalled()
  })
})
