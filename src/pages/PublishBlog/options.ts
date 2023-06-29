import { ref } from 'vue'
import { BlogType } from '@/types'

export const typeOptions = ref([
  {
    label: '前端技术',
    value: BlogType['front-end-tec'],
  },
  {
    label: 'Node',
    value: BlogType['node'],
  },
  {
    label: '数学',
    value: BlogType['math'],
  },
  {
    label: '生活随笔',
    value: BlogType['life'],
  },
  {
    label: '后端技术',
    value: BlogType['back-end-tec'],
  },
  {
    label: '其他技术',
    value: BlogType['other-tec'],
  },
])

export const tagColorOptions = ref([
  {
    label: '黄色',
    value: 'yellow',
  },
  {
    label: '粉色',
    value: 'pink',
  },
  {
    label: '绿色',
    value: 'green',
  },
  {
    label: '紫色',
    value: 'indigo',
  },
])
