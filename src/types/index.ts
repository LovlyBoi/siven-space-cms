interface Card {
  id: string
  title: string
  author: string
  type: BlogType
  tag: { name: string; color: TagColor }
  publishDate: string
  updateDate: string
  pictures: string[]
}

interface CardWithAudit extends Card {
  audit: 0 | 1 | 2
  auditMsg?: string
}

type BlogToPost = Omit<Card, 'publishDate' | 'updateDate'>

type TagColor = 'yellow' | 'pink' | 'green' | 'indigo'

// enum BlogType {
//   'note' = 1,
//   'essay' = 2,
// }

enum BlogType {
  'front-end-tec' = 1,
  'node',
  'math',
  'life',
  'back-end-tec',
  'other-tec',
}

interface OutlineItem {
  anchor: string
  depth: number
  title: string
}

// 大纲
type Outline = OutlineItem[]

interface ParsedHtml {
  outline: Outline
  html: string
}

interface Blog extends Card {
  parsed: ParsedHtml
}

const mapColor: { [k in TagColor]: string } = {
  yellow: 'bg-yellow-400',
  pink: 'bg-pink-400',
  indigo: 'bg-indigo-400',
  green: 'bg-green-400',
}

export interface PvRecords {
  date: string
  pv: number
}

export interface TopNBlog extends Card {
  readingVolume: number
}

export interface Tokens {
  accessToken: string
  refreshToken: string
}

export interface UserInfo {
  id: string
  userName: string
  role: 1 | 2 | 3
  avatar: string
}

export type UserInfoWithUnuse = UserInfo & { unuse: 0 | 1 }

export { BlogType, mapColor }
export type {
  Card,
  CardWithAudit,
  BlogToPost,
  TagColor,
  OutlineItem,
  Outline,
  ParsedHtml,
  Blog,
}
