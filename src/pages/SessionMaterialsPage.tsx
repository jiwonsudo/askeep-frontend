import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'

import { getApiErrorMessage } from '@/api/client'
import Button from '@/components/common/Button'
import Callout from '@/components/common/Callout'
import PageLayout from '@/components/common/PageLayout'
import SessionNavbar from '@/components/common/SessionNavbar'
import EndSessionModal from '@/components/presenter/EndSessionModal'
import EntryCodeBanner from '@/components/session/EntryCodeBanner'
import MaterialDropzone from '@/components/session/MaterialDropzone'
import MaterialItem from '@/components/session/MaterialItem'
import SessionStepHeader from '@/components/session/SessionStepHeader'
import { useMe } from '@/hooks/useAuth'
import {
  useDeleteMaterial,
  useEndSession,
  useRetryMaterial,
  useSession,
  useSessionMaterials,
  useStartSession,
  useUploadSessionMaterial,
} from '@/hooks/useSession'
import Icon from '@/components/common/Icon'
import BrandEyebrow from '@/components/common/BrandEyebrow'
import Card from '@/components/common/Card'

function SessionMaterialsContent({ sessionId }: { sessionId: number }) {
  const navigate = useNavigate()
  const me = useMe()
  const session = useSession(sessionId)
  const materials = useSessionMaterials(sessionId)
  const upload = useUploadSessionMaterial(sessionId)
  const deleteMaterial = useDeleteMaterial(sessionId)
  const retryMaterial = useRetryMaterial(sessionId)
  const start = useStartSession(sessionId)
  const end = useEndSession(sessionId)

  const [uploading, setUploading] = useState(false)
  const [uploadErrors, setUploadErrors] = useState<string[]>([])
  const [endOpen, setEndOpen] = useState(false)

  if (session.data && me.data && session.data.presenterId !== me.data.userId) {
    return <Navigate to="/" replace />
  }

  const items = materials.data?.items ?? []
  const status = session.data?.status
  const busy = deleteMaterial.isPending || retryMaterial.isPending

  const handleFiles = async (files: File[]) => {
    setUploading(true)
    setUploadErrors([])

    // 서버가 파일 하나씩 받으므로 순서대로 올린다
    for (const file of files) {
      try {
        await upload.mutateAsync(file)
      } catch (error) {
        setUploadErrors((errors) => [
          ...errors,
          `${file.name}: ${getApiErrorMessage(error, '업로드하지 못했어요.')}`,
        ])
      }
    }

    setUploading(false)
  }

  const handleStart = () => {
    if (status && status !== 'READY') {
      navigate(`/sessions/${sessionId}/present`)
      return
    }

    start.mutate(undefined, {
      onSuccess: () => navigate(`/sessions/${sessionId}/present`),
    })
  }

  return (
    <PageLayout
      navbar={
        <SessionNavbar
          onExit={() => navigate('/')}
          onEndSession={() => setEndOpen(true)}
          endDisabled={status !== 'ONGOING' && status !== 'ACTIVE'}
        />
      }
    >
      <main className="mt-8 flex w-full max-w-[720px] flex-1 flex-col gap-6 px-4 pb-12 md:mt-12">
        <SessionStepHeader step={2} />

        <Card
          as="section"
          className="flex flex-col gap-6 p-6 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:p-[33px]"
        >
          <header className="border-line-soft flex flex-col gap-1.5 border-b pb-[25px]">
            <BrandEyebrow className="text-ink-button" />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="text-ink text-2xl font-bold sm:text-[32px]">
                발표 자료 등록
              </h1>
              {session.data && (
                <span className="bg-line text-ink-button max-w-full truncate rounded-full px-[13px] py-[5px] text-[13px]">
                  # 세션: {session.data.title}
                </span>
              )}
            </div>
            <p className="text-ink-sub text-sm">
              AI가 질문에 답할 때 참고할 자료를 올려주세요.
            </p>
          </header>

          <EntryCodeBanner entryCode={session.data?.entryCode} />

          <MaterialDropzone
            uploading={uploading}
            onFiles={handleFiles}
            onRejected={(names) =>
              setUploadErrors((errors) => [
                ...errors,
                ...names.map(
                  (name) => `${name}: PDF, PPTX, TXT 파일만 올릴 수 있어요.`,
                ),
              ])
            }
          />

          {uploadErrors.length > 0 && (
            <ul
              role="alert"
              className="text-danger flex flex-col gap-1 text-xs font-medium"
            >
              {uploadErrors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          )}

          <section className="flex flex-col gap-3.5 pt-2">
            <div className="flex items-center gap-2">
              <h2 className="text-ink text-xl font-bold">등록된 파일</h2>
              <span className="bg-line text-ink-button rounded-full px-2 py-0.5 text-[13px] font-semibold">
                {materials.data?.totalElements ?? 0}
              </span>
            </div>
            {materials.isError && !materials.data && (
              <p role="alert" className="text-danger text-sm">
                {getApiErrorMessage(
                  materials.error,
                  '등록된 파일을 불러오지 못했어요.',
                )}
              </p>
            )}
            {materials.isSuccess && items.length === 0 && (
              <p className="text-ink-muted text-sm">
                아직 등록된 파일이 없어요.
              </p>
            )}
            <ul className="flex flex-col gap-3">
              {items.map((material) => (
                <MaterialItem
                  key={material.id}
                  material={material}
                  busy={busy}
                  onDelete={() => deleteMaterial.mutate(material.id)}
                  onRetry={() => retryMaterial.mutate(material.id)}
                />
              ))}
            </ul>
          </section>

          <Callout
            icon={<Icon name="ai-callout" className="h-[22px] w-5 shrink-0" />}
            title="등록된 자료에 명확한 근거가 있는 질문에만 AI가 답해요."
          >
            자료 외의 심층 질문이나 주관적 의견은 발표자 직접 답변 대기 목록으로
            자동 전달됩니다.
          </Callout>

          {start.isError && (
            <p role="alert" className="text-danger text-xs font-medium">
              {getApiErrorMessage(start.error, '세션을 시작하지 못했어요.')}
            </p>
          )}

          <div className="border-line flex items-center justify-between gap-3 border-t pt-[33px]">
            <Link
              to={`/sessions/${sessionId}/edit`}
              className="text-ink-button flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-base"
            >
              <Icon name="arrow-left-small" className="size-3" />
              이전 단계
            </Link>
            <Button
              disabled={start.isPending || !session.data}
              onClick={handleStart}
            >
              세션 시작하기
            </Button>
          </div>
        </Card>
      </main>

      <EndSessionModal
        open={endOpen}
        pending={end.isPending}
        error={end.error}
        onClose={() => setEndOpen(false)}
        onConfirm={() =>
          end.mutate(undefined, { onSuccess: () => navigate('/archive') })
        }
      />
    </PageLayout>
  )
}

export default function SessionMaterialsPage() {
  const { sessionId } = useParams()
  const id = Number(sessionId)

  if (!Number.isInteger(id) || id <= 0) {
    return <Navigate to="/" replace />
  }

  return <SessionMaterialsContent sessionId={id} />
}
