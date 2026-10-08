import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { cn } from '@/utils/cn'

// 글자 크기와 색은 바깥에서 정한 값을 그대로 이어받는다
const components: Components = {
  h1: ({ children }) => (
    <h3 className="text-ink mt-4 mb-1.5 font-bold first:mt-0">{children}</h3>
  ),
  h2: ({ children }) => (
    <h3 className="text-ink mt-4 mb-1.5 font-bold first:mt-0">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="text-brand-deep mt-4 mb-1.5 font-bold first:mt-0">
      {children}
    </h4>
  ),
  h4: ({ children }) => (
    <h4 className="text-brand-deep mt-3 mb-1 font-bold first:mt-0">
      {children}
    </h4>
  ),
  p: ({ children }) => <p className="my-2 leading-relaxed first:mt-0 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  ul: ({ children }) => (
    <ul className="my-2 list-disc space-y-1 pl-5 marker:text-ink-muted">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-ink-muted">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed [&>ul]:my-1 [&>ol]:my-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-info-line text-ink-sub my-2 border-l-4 pl-3">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-brand-deep underline underline-offset-2"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="border-info-line my-3" />,
  code: ({ className, children }) =>
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="bg-info-line/50 rounded px-1 py-0.5 font-mono text-[0.9em]">
        {children}
      </code>
    ),
  pre: ({ children }) => (
    <pre className="bg-canvas border-line my-2 overflow-x-auto rounded-lg border p-3 font-mono text-[0.9em] leading-relaxed">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-2 overflow-x-auto">
      <table className="border-line w-full border-collapse border text-left">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-line bg-canvas border px-2.5 py-1.5 font-bold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-line border px-2.5 py-1.5">{children}</td>
  ),
}

interface MarkdownProps {
  children: string
  className?: string
}

/** AI가 마크다운으로 준 글을 읽기 좋게 보여준다. HTML은 렌더링하지 않는다 */
export default function Markdown({ children, className }: MarkdownProps) {
  return (
    <div className={cn('break-words', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
