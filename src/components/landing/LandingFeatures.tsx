import { QRCodeSVG } from 'qrcode.react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'

import featureAi from '@/assets/landing/feature-ai.webp'
import featureArchive from '@/assets/landing/feature-archive.webp'
import featureAsk from '@/assets/landing/feature-ask.webp'
import featurePresenter from '@/assets/landing/feature-presenter.webp'
import BrandEyebrow from '@/components/common/BrandEyebrow'
import Button from '@/components/common/Button'
import Icon from '@/components/common/Icon'
import Reveal from '@/components/landing/Reveal'
import { cn } from '@/utils/cn'

/** 스크린샷은 실제 화면을 2배 크기로 찍어 둔 것이다 (가로·세로는 레이아웃이 밀리지 않게 미리 알려 준다) */
interface Shot {
  src: string
  width: number
  height: number
  alt: string
  /** 화면 일부만 잘라 찍은 경우 아래를 흐리게 끝낸다 */
  fade?: boolean
}

interface Feature {
  /** 짧은 분류 이름 */
  label: string
  title: string
  description: string
  visual: ReactNode
  /** 가로로 긴 화면은 글 아래에 넓게 보여 준다 */
  wide?: boolean
}

function Screenshot({ src, width, height, alt, fade }: Shot) {
  return (
    <div className="border-line overflow-hidden rounded-2xl border bg-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.25)]">
      <img
        src={src}
        width={width}
        height={height}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn(
          'block h-auto w-full',
          fade &&
            '[mask-image:linear-gradient(to_bottom,black_75%,transparent)]',
        )}
      />
    </div>
  )
}

/** 발표 화면에 띄우는 QR을 작게 재현한다. 찍으면 실제로 ASKeep에 들어온다 */
function QrVisual() {
  return (
    <div className="border-line relative flex flex-col items-center gap-5 rounded-2xl border bg-white px-6 pt-12 pb-8 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.25)]">
      {/* 실제 세션 QR로 착각하지 않게 예시라고 밝혀 둔다 */}
      <span className="bg-canvas-subtle text-ink-sub absolute top-4 left-4 rounded-full px-2.5 py-1 text-xs font-bold">
        예시 화면
      </span>
      <p className="text-ink text-lg font-bold break-keep">
        카메라로 QR을 찍어 세션에 참여하세요
      </p>
      <QRCodeSVG
        value="https://askeep.vercel.app"
        level="M"
        marginSize={1}
        className="size-44"
        title="ASKeep 바로가기 QR"
      />
      <div className="flex flex-col items-center gap-1">
        <span className="text-ink-sub text-xs">입장 코드</span>
        <span className="text-brand text-3xl leading-none font-bold tracking-[0.12em]">
          RSC824
        </span>
      </div>
      <p className="text-ink-muted text-center text-xs break-keep">
        참고용 예시라 찍으면 ASKeep 첫 화면으로 이동해요. 실제 QR은 세션을
        만들면 발표 화면에서 띄울 수 있어요.
      </p>
    </div>
  )
}

const features: Feature[] = [
  {
    label: '입장',
    title: 'QR 찍고 바로 입장',
    description:
      '발표 화면에 QR을 띄우면 청중은 카메라로 찍어서 들어와요. 입장 코드나 공유 링크로도 들어올 수 있어요.',
    visual: <QrVisual />,
  },
  {
    label: '질문',
    title: '슬라이드 보면서 질문하기',
    description:
      '발표 자료를 각자 화면에서 넘겨 보면서 질문을 남겨요. 이름을 밝히기 어려우면 익명으로 질문해도 돼요.',
    visual: (
      <Screenshot
        src={featureAsk}
        width={1176}
        height={1364}
        alt="슬라이드 뷰어와 질문 입력창이 있는 청중 화면"
      />
    ),
  },
  {
    label: 'AI 답변',
    title: '자료에 있는 내용은 AI가 먼저 답변',
    description:
      '등록한 발표 자료를 근거로 AI가 답을 달고, 근거가 된 슬라이드 페이지도 함께 보여줘요.',
    visual: (
      <Screenshot
        src={featureAi}
        width={1176}
        height={1514}
        alt="AI가 슬라이드를 근거로 단 답변이 펼쳐진 질문 목록"
        fade
      />
    ),
  },
  {
    label: '발표자 화면',
    title: '많이 궁금해하는 질문부터',
    description:
      '‘나도 궁금해요’를 많이 받은 질문이 위로 올라와요. 답변한 질문은 완료로 표시해 정리할 수 있어요.',
    visual: (
      <Screenshot
        src={featurePresenter}
        width={2400}
        height={1280}
        alt="공감 순위대로 정렬된 발표자 질문 목록"
        fade
      />
    ),
    wide: true,
  },
  {
    label: '아카이브',
    title: '끝난 세션은 아카이브에',
    description:
      '세션이 끝나면 AI 요약과 질문·답변이 아카이브에 남아요. 태그나 키워드로 언제든 다시 찾아볼 수 있어요.',
    visual: (
      <Screenshot
        src={featureArchive}
        width={2400}
        height={1640}
        alt="AI 세션 요약과 질문·답변이 정리된 아카이브"
        fade
      />
    ),
    wide: true,
  },
]

function FeatureText({ label, title, description }: Feature) {
  return (
    <div className="flex flex-col items-start gap-3">
      <span className="bg-info-bg text-brand-deep rounded-full px-3 py-1 text-sm font-bold">
        {label}
      </span>
      <h3 className="text-ink text-2xl leading-snug font-bold break-keep md:text-[30px]">
        {title}
      </h3>
      <p className="text-ink-sub text-base leading-relaxed break-keep">
        {description}
      </p>
    </div>
  )
}

/** 랜딩 첫 화면 아래에서 실제 화면으로 기능을 하나씩 소개한다 */
export default function LandingFeatures() {
  const navigate = useNavigate()

  return (
    <section
      aria-labelledby="features-title"
      className="flex w-full flex-col items-center px-4 pt-8 pb-24 md:px-10 md:pb-32"
    >
      <Reveal className="flex flex-col items-center gap-3 text-center">
        <BrandEyebrow />
        <h2
          id="features-title"
          className="text-ink text-[28px] leading-tight font-bold break-keep md:text-[40px]"
        >
          발표부터 아카이브까지
        </h2>
      </Reveal>

      <div className="mt-16 flex w-full max-w-[1120px] flex-col gap-24 md:mt-24 md:gap-36">
        {features.map((feature, index) =>
          feature.wide ? (
            <div key={feature.label} className="flex flex-col gap-10">
              <Reveal className="max-w-[560px]">
                <FeatureText {...feature} />
              </Reveal>
              <Reveal delay={150}>{feature.visual}</Reveal>
            </div>
          ) : (
            <div
              key={feature.label}
              className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16"
            >
              <Reveal className={cn(index % 2 === 1 && 'md:order-2')}>
                <FeatureText {...feature} />
              </Reveal>
              <Reveal delay={150} className="mx-auto w-full max-w-[460px]">
                {feature.visual}
              </Reveal>
            </div>
          ),
        )}
      </div>

      <Reveal className="mt-24 flex flex-col items-center gap-5 text-center md:mt-36">
        <h2 className="text-ink text-[24px] leading-tight font-bold break-keep md:text-[32px]">
          다음 발표에서 써 보세요
        </h2>
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
          시작하기
        </Button>
      </Reveal>
    </section>
  )
}
