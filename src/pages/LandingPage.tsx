import { useNavigate } from 'react-router'

import bracketLeft from '@/assets/landing-bracket-left.svg'
import bracketRight from '@/assets/landing-bracket-right.svg'
import mascot from '@/assets/landing-mascot.png'
import Button from '@/components/common/Button'
import Icon from '@/components/common/Icon'
import PageLayout from '@/components/common/PageLayout'
import LandingFeatures from '@/components/landing/LandingFeatures'

const blobs = [
  // 왼쪽 위 노랑, 오른쪽 위 파랑, 왼쪽 아래 초록, 오른쪽 아래 빨강. 서로 다른 박자로 천천히 떠다닌다
  'left-[8%] top-[18%] bg-brand-yellow/20',
  'right-[10%] top-[10%] bg-brand-blue/20 [animation-delay:-4s] [animation-duration:19s]',
  'left-[10%] top-[48%] bg-brand-green/20 [animation-delay:-9s] [animation-duration:22s]',
  'right-[6%] top-[42%] bg-brand-red/15 [animation-delay:-2s] [animation-duration:17s]',
]

/** GDGoC <> SMU는 소속 표시라 작게, ASKeep은 서비스 이름이라 크게 */
const orgFontSize = 'text-[clamp(22px,6.5vw,60px)]'
const orgClassName = `text-ink ${orgFontSize} leading-none tracking-[-0.06em]`
const brandClassName =
  'text-ink text-[clamp(72px,22vw,208px)] leading-none tracking-[-0.07em] mr-[0.1em]'

/** 순서대로 아래에서 떠오르게 한다. 움직임 줄이기 설정이면 애니메이션 없이 바로 보인다 */
const fadeUp = 'motion-safe:animate-fade-up'

/** 로그인하지 않은 사람이 처음 만나는 소개 화면 */
export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <PageLayout activeMenu="intro">
      {/* 헤더(모바일 72px, PC는 위 여백 포함 96px)와 합쳐 첫 화면을 꽉 채우고, 푸터는 스크롤해야 보이게 한다 */}
      <main className="relative flex min-h-[calc(100svh-72px)] w-full flex-1 flex-col items-center overflow-hidden px-4 pt-12 pb-6 md:min-h-[calc(100svh-96px)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          {blobs.map((blob) => (
            <div
              key={blob}
              className={`motion-safe:animate-drift absolute h-[380px] w-[388px] max-w-[60vw] rounded-full blur-[110px] ${blob}`}
            />
          ))}
        </div>

        {/* 남는 높이의 가운데에 두고, 아래 안내는 흐름에 따라 그 밑에 붙여 화면이 낮아도 겹치지 않게 한다 */}
        <div className="relative my-auto flex flex-col items-center gap-6 text-center">
          <p
            className={`text-ink max-w-[min(100%,666px)] text-base leading-[25px] font-medium break-keep ${fadeUp}`}
          >
            프레젠테이션 질문 종합 &amp; 지식 자산화 서비스
            <br />
            <span className="font-brand">Ask freely, Keep forever</span>
          </p>

          <h1 className="flex flex-col items-center">
            <span className="flex items-center gap-3 md:gap-6">
              <span
                className={`${orgClassName} ${fadeUp} [animation-delay:150ms]`}
              >
                GDGoC
              </span>
              <span
                aria-hidden="true"
                className={`flex shrink-0 items-center gap-[0.08em] ${orgFontSize}`}
              >
                <img
                  src={bracketLeft}
                  alt=""
                  className="motion-safe:animate-slide-in-left h-[0.7em] w-auto max-w-none shrink-0 [animation-delay:300ms]"
                />
                <img
                  src={bracketRight}
                  alt=""
                  className="motion-safe:animate-slide-in-right h-[0.7em] w-auto max-w-none shrink-0 [animation-delay:300ms]"
                />
              </span>
              <span
                className={`${orgClassName} ${fadeUp} [animation-delay:150ms]`}
              >
                SMU
              </span>
            </span>
            <span
              className={`${brandClassName} font-brand mt-[0.32em] flex ${fadeUp} [animation-delay:450ms]`}
            >
              <span className="relative font-extrabold">
                {/* 글자가 다 나온 뒤 마스코트가 튀어나오고, 이후 계속 살짝 들썩인다 */}
                <span className="absolute bottom-[70%] left-1/2 w-[0.42em] -translate-x-1/2">
                  <span className="motion-safe:animate-pop-in block origin-bottom [animation-delay:900ms]">
                    <img
                      src={mascot}
                      alt=""
                      className="motion-safe:animate-bob block w-full [animation-delay:1.6s]"
                    />
                  </span>
                </span>
                A
              </span>
              <span className="font-extrabold">SK</span>
              <span className="font-light">eep</span>
            </span>
          </h1>

          <div className={`mt-8 ${fadeUp} [animation-delay:700ms]`}>
            <Button
              className="group"
              rightIcon={
                <Icon
                  name="arrow-right"
                  className="size-5 -scale-x-100 transition-transform group-hover:translate-x-1"
                />
              }
              onClick={() => navigate('/login')}
            >
              세션 참여하기
            </Button>
          </div>
        </div>
        {/* 아래에 기능 소개가 있다는 걸 알려 주는 표시 */}
        <a
          href="#features-title"
          aria-label="기능 소개 보기"
          className="text-ink-muted motion-safe:animate-fade-up relative mt-10 flex shrink-0 flex-col items-center gap-1 text-xs font-medium [animation-delay:1.2s]"
        >
          기능 살펴보기
          <Icon
            name="chevron-down-gray"
            className="size-5 motion-safe:animate-bounce"
          />
        </a>
      </main>
      <LandingFeatures />
    </PageLayout>
  )
}
