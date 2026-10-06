import PageLayout from '@/components/common/PageLayout'
import {
  PRIVACY_CONTACT,
  PRIVACY_EFFECTIVE_DATE,
  PRIVACY_OFFICER,
  privacyIntro,
  privacySections,
} from '@/content/privacyPolicy'
import BackLink from '@/components/common/BackLink'
import Card from '@/components/common/Card'

export default function PrivacyPolicyPage() {
  return (
    <PageLayout>
      <main className="mt-8 flex w-full max-w-[800px] flex-1 flex-col gap-6 px-4 pb-12 md:mt-12">
        <div>
          <BackLink to="/">홈으로</BackLink>
        </div>

        <Card
          as="article"
          className="flex flex-col gap-8 p-6 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] sm:p-[33px]"
        >
          <header className="border-line flex flex-col gap-2 border-b pb-6">
            <h1 className="text-ink text-2xl font-bold sm:text-[32px]">
              개인정보처리방침
            </h1>
            <p className="text-ink-sub text-sm leading-6">{privacyIntro}</p>
            <p className="text-ink-muted text-xs font-medium">
              시행일 {PRIVACY_EFFECTIVE_DATE}
            </p>
          </header>

          {privacySections.map((section) => (
            <section key={section.title} className="flex flex-col gap-3">
              <h2 className="text-ink text-xl font-bold">{section.title}</h2>

              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="text-ink-sub text-sm leading-6">
                  {paragraph}
                </p>
              ))}

              {section.table && (
                <div className="border-line overflow-x-auto rounded-lg border">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead className="bg-canvas-subtle text-ink">
                      <tr>
                        {section.table.head.map((cell) => (
                          <th key={cell} className="px-4 py-3 font-bold">
                            {cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr key={row[0]} className="border-line border-t">
                          {row.map((cell, index) => (
                            <td
                              key={index}
                              className={`px-4 py-3 align-top leading-6 ${
                                index === 0
                                  ? 'text-ink font-medium whitespace-nowrap'
                                  : 'text-ink-sub'
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {section.items && (
                <ul className="text-ink-sub flex list-disc flex-col gap-1.5 pl-5 text-sm leading-6">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <footer className="bg-info-bg border-info-line flex flex-col gap-1 rounded-lg border p-4">
            <p className="text-ink text-sm font-bold">문의 채널</p>
            <p className="text-ink-button text-sm">
              {PRIVACY_OFFICER} ·{' '}
              <a
                href={PRIVACY_CONTACT.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-deep font-bold underline"
              >
                {PRIVACY_CONTACT.label}
              </a>
            </p>
          </footer>
        </Card>
      </main>
    </PageLayout>
  )
}
