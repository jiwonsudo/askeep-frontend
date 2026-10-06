import { cn } from '@/utils/cn'

const dotColors = [
  'bg-[#4285f4]',
  'bg-[#ea4335]',
  'bg-[#fbbc04]',
  'bg-[#34a853]',
]

interface BrandEyebrowProps {
  className?: string
}

/** 제목 위에 붙는 구글 색 점 4개와 "GDGOC SMU" 문구 */
export default function BrandEyebrow({ className }: BrandEyebrowProps) {
  return (
    <div className={cn('text-ink-sub flex items-center gap-2', className)}>
      <span className="flex gap-1" aria-hidden="true">
        {dotColors.map((color) => (
          <i key={color} className={`size-2 rounded-full ${color}`} />
        ))}
      </span>
      <span className="text-xs font-medium">GDGOC SMU</span>
    </div>
  )
}
