import { Card, TagColor, BlogType } from '@/types'

export const BlogType2Ch: {
  note: '笔记'
  essay: '随笔'
} = {
  note: '笔记',
  essay: '随笔',
}

export type Blog = {
  id: string
  title: string
  author: string
  type: string
  tagName: string
  tagColor: TagColor
  publishDate: string
  updateDate: string
  pictures: string[]
}

export const handleCards = (cards: Card[]): Blog[] => {
  return cards.map((card) => {
    return {
      id: card.id,
      title: card.title,
      author: card.author,
      type: BlogType[card.type],
      tagName: card.tag.name,
      tagColor: card.tag.color,
      publishDate: card.publishDate,
      updateDate: card.updateDate,
      pictures: card.pictures,
    }
  })
}
