import { getApiErrorMessage, isMissingOriginal } from '@/api/client'
import Button from '@/components/common/Button'
import Icon from '@/components/common/Icon'
import { useDownloadMaterial, useSessionMaterials } from '@/hooks/useSession'
import { formatFileSize } from '@/utils/format'

interface ArchiveMaterialListProps {
  sessionId: number
}

/** 종료된 세션의 발표자료 목록. 원본 PDF를 내려받을 수 있다 */
export default function ArchiveMaterialList({
  sessionId,
}: ArchiveMaterialListProps) {
  const { data, isPending, isError } = useSessionMaterials(sessionId)
  const download = useDownloadMaterial()
  const items = data?.items ?? []

  const downloadError = (id: number) => {
    if (!download.isError || download.variables?.id !== id) return undefined

    return isMissingOriginal(download.error)
      ? '서버에 원본 파일이 남아 있지 않아요.'
      : getApiErrorMessage(download.error, '자료를 내려받지 못했어요.')
  }

  return (
    <section className="flex flex-col gap-4">
      <header className="border-line flex items-center justify-between border-b pb-[13px]">
        <h3 className="text-ink flex items-center gap-2.5 text-xl font-bold">
          <Icon name="book-open" className="size-5" />
          발표 자료
        </h3>
        <span className="text-ink-muted text-xs font-medium">
          총 {data?.totalElements ?? 0}개
        </span>
      </header>

      {isPending && (
        <p className="text-ink-muted text-sm">자료를 불러오는 중이에요.</p>
      )}
      {isError && (
        <p role="alert" className="text-danger text-sm">
          자료를 불러오지 못했어요.
        </p>
      )}
      {data && items.length === 0 && (
        <p className="text-ink-muted text-sm">등록된 자료가 없어요.</p>
      )}

      {items.length > 0 && (
        <ul className="flex flex-col gap-3">
          {items.map((material) => {
            const downloading =
              download.isPending && download.variables?.id === material.id
            const error = downloadError(material.id)

            return (
              <li
                key={material.id}
                className="border-line flex flex-col gap-2 rounded-lg border bg-white p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-ink truncate text-base">
                      {material.fileName}
                    </span>
                    <span className="text-ink-muted text-xs font-medium">
                      {formatFileSize(material.fileSize)}
                      {material.pageCount !== null &&
                        ` • ${material.pageCount}쪽`}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="h-9 shrink-0"
                    aria-label={`${material.fileName} 내려받기`}
                    disabled={downloading}
                    onClick={() =>
                      download.mutate({
                        id: material.id,
                        fileName: material.fileName,
                      })
                    }
                  >
                    {downloading ? '받는 중' : '내려받기'}
                  </Button>
                </div>
                {error && (
                  <p role="alert" className="text-danger text-sm">
                    {error}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
