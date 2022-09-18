import { h } from 'vue'
import dayjs from '@/utils/day'
import { Card, TagColor, BlogType, mapColor } from '@/types'
import {
  DataTableColumns,
  NImage,
  NSpace,
  NImageGroup,
  NPopover,
} from 'naive-ui'

const BlogType2Ch: {
  note: '笔记'
  essay: '随笔'
  [k: string]: string
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

export const createColumns = (): DataTableColumns<Blog> => {
  return [
    {
      title: 'ID',
      key: 'id',
      render({ id }) {
        return h(
          NPopover,
          {
            trigger: 'hover',
          },
          {
            trigger: () => h('span', {}, id.slice(0, 6) + '...'),
            default: () => h('span', {}, id),
          }
        )
      },
    },
    {
      title: '标题',
      key: 'title',
    },
    {
      title: '作者',
      key: 'author',
    },
    {
      title: '类型',
      key: 'type',
      render({ type }) {
        return h('span', {}, BlogType2Ch[type] || type)
      },
    },
    {
      title: 'tag',
      key: 'tag',
      render({ tagColor, tagName }) {
        return h(
          'div',
          {
            class:
              mapColor[tagColor] +
              ' text-xs font-light text-white inline-block',
            style: 'padding: 1px 6px; border-radius: 4px',
          },
          tagName
        )
      },
    },
    {
      title: '发布日期',
      key: 'publishDate',
      render({ publishDate }) {
        return h(
          NPopover,
          {
            trigger: 'hover',
          },
          {
            trigger: () => h('span', {}, dayjs(publishDate).format('YY/M/D')),
            default: () =>
              h('span', {}, dayjs(publishDate).format('YYYY年M月D日 HH:mm:ss')),
          }
        )
      },
    },
    {
      title: '更新日期',
      key: 'updateDate',
      render({ updateDate }) {
        return h(
          NPopover,
          {
            trigger: 'hover',
          },
          {
            trigger: () => h('span', {}, dayjs(updateDate).format('YY/M/D')),
            default: () =>
              h('span', {}, dayjs(updateDate).format('YYYY年M月D日 HH:mm:ss')),
          }
        )
      },
    },
    {
      title: '封面',
      key: 'cover',
      render: ({ pictures }) => {
        return h(
          NImageGroup,
          {},
          {
            default: () =>
              h(
                NSpace,
                {},
                {
                  default: () =>
                    pictures.map((pic) => {
                      return h(NImage, {
                        src: pic,
                        width: '50',
                        height: '50',
                        objectFit: 'cover',
                        lazy: true,
                      })
                    }),
                }
              ),
          }
        )
      },
    },
  ]
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
      // publishDate: dayjs(card.publishDate).format('YYYY年M月D日 HH:mm:ss'),
      // updateDate: dayjs(card.updateDate).format('YYYY年M月D日 HH:mm:ss'),
      pictures: card.pictures,
    }
  })
}
