import { useNavigate } from 'react-router'

import bracketLeft from '@/assets/landing-bracket-left.svg'
import bracketRight from '@/assets/landing-bracket-right.svg'
import mascot from '@/assets/landing-mascot.png'
import Button from '@/components/common/Button'
import Icon from '@/components/common/Icon'
import PageLayout from '@/components/common/PageLayout'

const blobs = [
  // 왼쪽 위 노랑, 오른쪽 위 파랑, 왼쪽 아래 초록, 오른쪽 아래 빨강
  'left-[8%] top-[18%] bg-brand-yellow/20',
  'right-[10%] top-[10%] bg-brand-blue/20',
  'left-[10%] top-[48%] bg-brand-green/20',
  'right-[6%] top-[42%] bg-brand-red/15',
]

const titleClassName =
  'text-ink text-[clamp(36px,12vw,128px)] leading-none tracking-[-0.07em] mr-[0.1em]'

/** 로그인하지 않은 사람이 처음 만나는 소개 화면 */
export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <PageLayout>
      <main className="relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden px-4 py-16 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          {blobs.map((blob) => (
            <div
              key={blob}
              className={`absolute h-[380px] w-[388px] max-w-[60vw] rounded-full blur-[110px] ${blob}`}
            />
          ))}
        </div>

        <div className="relative flex flex-col items-center gap-6 text-center">
          <p className="text-ink max-w-[min(100%,666px)] text-base leading-[25px] font-medium break-keep">
            질문은 자유롭게, 지식은 계속 쌓이도록.
            <br />
            발표 중 궁금한 점을 질문하고, 그 답변을 학습 자산으로 남겨보세요.
          </p>

          <h1 className="flex flex-col items-center gap-2 md:gap-4">
            <span className="flex items-center gap-2 md:gap-[2em]">
              <span className={titleClassName}>GDGoC</span>
              <span
                aria-hidden="true"
                className="flex shrink-0 items-center gap-[0.04em] text-[clamp(36px,12vw,128px)] md:gap-[0.12em]"
              >
                <img
                  src={bracketLeft}
                  alt=""
                  className="h-[0.7em] w-auto max-w-none shrink-0"
                />
                <img
                  src={bracketRight}
                  alt=""
                  className="h-[0.7em] w-auto max-w-none shrink-0"
                />
              </span>
              <span className={titleClassName}>SMU</span>
            </span>
            <span
              className={`${titleClassName} font-brand flex tracking-[-0.07em]`}
            >
              <span className="relative font-extrabold">
                <img
                  src={mascot}
                  alt=""
                  className="absolute bottom-[70%] left-1/2 w-[0.42em] -translate-x-1/2"
                />
                A
              </span>
              <span className="font-extrabold">SK</span>
              <span className="font-light">eep</span>
            </span>
          </h1>

          <Button
            className="mt-8"
            rightIcon={
              <Icon name="arrow-right" className="size-5 -scale-x-100" />
            }
            onClick={() => navigate('/login')}
          >
            세션 참여하기
          </Button>
        </div>
      </main>
    </PageLayout>
  )
}
