const UNITS = ['B', 'KB', 'MB', 'GB']

export const formatFileSize = (bytes: number) => {
  let size = bytes
  let unit = 0

  while (size >= 1024 && unit < UNITS.length - 1) {
    size /= 1024
    unit += 1
  }

  return `${unit === 0 ? size : size.toFixed(1)} ${UNITS[unit]}`
}

interface AuthorInfo {
  anonymous: boolean
  author: { username: string } | null
}

/**
 * 질문 작성자 표시 이름. 익명 질문의 작성자는 발표자와 본인에게만 내려와서,
 * 그때는 "이름(익명으로 게시함)"으로 보여주고 나머지 사람에게는 "익명"으로 보여준다.
 */
export const formatAuthorName = ({ anonymous, author }: AuthorInfo) => {
  if (!author) return '익명'

  return anonymous ? `${author.username}(익명으로 게시함)` : author.username
}
