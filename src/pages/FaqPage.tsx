import BackLink from '@/components/common/BackLink'
import BrandEyebrow from '@/components/common/BrandEyebrow'
import Callout from '@/components/common/Callout'
import Card from '@/components/common/Card'
import Icon from '@/components/common/Icon'
import PageLayout from '@/components/common/PageLayout'
import FaqItem from '@/components/faq/FaqItem'
import { faqGroups, faqIntro } from '@/content/faq'
import { PRIVACY_CONTACT } from '@/content/privacyPolicy'

export default function FaqPage() {
  return (
    <PageLayout activeMenu="faq">
      <main className="mt-8 flex w-full max-w-[800px] flex-1 flex-col gap-8 px-4 pb-12 md:mt-12">
        <BackLink to="/">홈으로</BackLink>

        <header className="border-line flex flex-col gap-1.5 border-b pb-6">
          <BrandEyebrow />
          <h1 className="text-ink text-2xl font-bold sm:text-[32px]">
            자주 묻는 질문
          </h1>
          <p className="text-ink-sub text-sm">{faqIntro}</p>
        </header>

        {faqGroups.map((group) => (
          <section key={group.title} className="flex flex-col gap-3">
            <h2 className="text-ink text-xl font-bold">{group.title}</h2>
            <Card
              as="ul"
              className="divide-line flex flex-col divide-y overflow-hidden"
            >
              {group.entries.map((entry) => (
                <FaqItem key={entry.question} {...entry} />
              ))}
            </Card>
          </section>
        ))}

        <Callout
          icon={<Icon name="info" className="mt-0.5 size-4 shrink-0" />}
          title="원하는 답을 찾지 못하셨나요?"
        >
          <a
            href={PRIVACY_CONTACT.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-deep font-bold underline"
          >
            {PRIVACY_CONTACT.label}
          </a>
          로 문의해 주세요.
        </Callout>
      </main>
    </PageLayout>
  )
}
