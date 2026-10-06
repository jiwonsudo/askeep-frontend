import { useState } from 'react'
import { Link } from 'react-router'

import footerLogo from '@/assets/footer-logo.svg'

import Icon from '@/components/common/Icon'
import Modal from '@/components/common/Modal'

const INSTAGRAM_URL = 'https://www.instagram.com/gdgoc.smu/'

const repositories = [
  {
    label: '백엔드',
    name: 'hyunI0326/ASKeep_Backend',
    href: 'https://github.com/hyunI0326/ASKeep_Backend/',
  },
  {
    label: '프론트엔드',
    name: 'jiwonsudo/askeep-frontend',
    href: 'https://github.com/jiwonsudo/askeep-frontend',
  },
]

export default function Footer() {
  const [githubOpen, setGithubOpen] = useState(false)

  return (
    <footer className="bg-nav w-full md:h-[117px]">
      <div className="mx-auto flex h-full max-w-[1400px] flex-col items-start gap-6 px-6 py-8 md:flex-row md:items-center md:gap-8 md:px-8 md:py-0">
        <div className="relative h-[37px] w-[61px] shrink-0">
          <img
            src={footerLogo}
            alt=""
            className="absolute top-0 left-[2.76px] h-[26.7px] w-[55.4px]"
          />
          <span className="absolute top-[35px] left-0 text-[7.4px] whitespace-nowrap text-white">
            GDGoC Sangmyung
          </span>
        </div>
        <div className="flex w-full flex-1 flex-col items-start gap-4 md:w-auto md:flex-row md:items-center md:justify-end">
          <div className="flex items-center gap-6">
            <div className="hidden h-8 w-px bg-[#595959] md:block" />
            <div className="flex flex-col">
              <Link
                to="/privacy"
                className="pb-1 text-base text-[#f5f5f5] hover:underline"
              >
                개인정보처리방침
              </Link>
              <span className="text-xs font-medium text-[#f5f5f5]">
                © 2026. ASKeep all rights reserved.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:-mr-[9px]">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GDGoC SMU Instagram"
              className="flex size-11 items-center justify-center rounded-lg"
            >
              <Icon name="instagram" className="size-5" />
            </a>
            <button
              type="button"
              aria-label="ASKeep GitHub"
              aria-haspopup="dialog"
              onClick={() => setGithubOpen(true)}
              className="flex size-11 cursor-pointer items-center justify-center rounded-lg"
            >
              <Icon name="github" className="size-5" />
            </button>
          </div>
        </div>
      </div>
      <Modal
        open={githubOpen}
        title="ASKeep GitHub"
        description="이동할 저장소를 선택해 주세요."
        onClose={() => setGithubOpen(false)}
      >
        <ul className="flex flex-col gap-2">
          {repositories.map(({ label, name, href }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setGithubOpen(false)}
                className="border-info-line bg-info-bg hover:bg-info-bg/60 flex items-center justify-between gap-3 rounded-lg border px-4 py-3 transition"
              >
                <span className="flex flex-col">
                  <span className="text-brand-deep text-sm font-bold">
                    {label}
                  </span>
                  <span className="text-ink-muted text-xs font-medium">
                    {name}
                  </span>
                </span>
                <Icon
                  name="arrow-left"
                  className="size-5 shrink-0 -scale-x-100"
                />
              </a>
            </li>
          ))}
        </ul>
      </Modal>
    </footer>
  )
}
