import { useRef, useState } from 'react'
import type { DragEvent } from 'react'
import Icon from '@/components/common/Icon'

const ACCEPTED_EXTENSIONS = ['pdf', 'pptx', 'txt']

const isAccepted = (file: File) =>
  ACCEPTED_EXTENSIONS.includes(file.name.split('.').pop()?.toLowerCase() ?? '')

interface MaterialDropzoneProps {
  uploading: boolean
  onFiles: (files: File[]) => void
  onRejected: (fileNames: string[]) => void
}

export default function MaterialDropzone({
  uploading,
  onFiles,
  onRejected,
}: MaterialDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (files: File[]) => {
    const accepted = files.filter(isAccepted)
    const rejected = files.filter((file) => !isAccepted(file))

    if (rejected.length > 0) onRejected(rejected.map((file) => file.name))
    if (accepted.length > 0) onFiles(accepted)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)

    if (!uploading) handleFiles([...event.dataTransfer.files])
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`border-ink-button flex flex-col items-center gap-3 rounded-xl border border-dashed p-6 text-center transition sm:p-[33px] ${
        dragging ? 'bg-info-bg border-brand' : 'bg-[#fafafa]'
      }`}
    >
      <span className="bg-info-bg flex size-12 items-center justify-center rounded-full">
        <Icon name="upload-cloud" className="h-[18.7px] w-[25.7px]" />
      </span>
      <p className="text-ink text-lg font-bold sm:text-xl">
        발표 자료를 여기에 끌어 놓거나 파일 선택을 눌러주세요
      </p>
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        accept=".pdf,.pptx,.txt"
        onChange={(event) => {
          handleFiles([...(event.target.files ?? [])])
          event.target.value = ''
        }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="border-ink-button text-ink-button hover:bg-canvas-subtle h-11 cursor-pointer rounded-lg border bg-white px-[17px] text-sm font-bold whitespace-pre transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? '업로드 중...' : '+  파일 선택'}
      </button>
      <p className="text-ink-button text-sm">
        발표 슬라이드(PDF, PPTX, TXT) 지원 / 업로드 즉시 AI 지식 인덱싱이
        시작됩니다.
      </p>
    </div>
  )
}
