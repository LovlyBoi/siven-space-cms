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

type BlogToPost = Omit<Card, 'publishDate' | 'updateDate'>

type TagColor = 'yellow' | 'pink' | 'green' | 'indigo'

enum BlogType {
  'note' = 1,
  'essay' = 2,
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

export { BlogType, mapColor }
export type {
  Card,
  BlogToPost,
  TagColor,
  OutlineItem,
  Outline,
  ParsedHtml,
  Blog,
}
