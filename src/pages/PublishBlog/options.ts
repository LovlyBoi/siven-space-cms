import { ref } from 'vue'
import { BlogType } from '@/types'

export const typeOptions = ref([
  {
    label: '肉菜',
    value: BlogType['meat-dish'],
  },
  {
    label: '素菜',
    value: BlogType['vegetable-dish'],
  },
  {
    label: '主食',
    value: BlogType['staple'],
  },
  {
    label: '甜点',
    value: BlogType['dessert'],
  },
  {
    label: '饮品',
    value: BlogType['drink'],
  },
  {
    label: '汤',
    value: BlogType['soup'],
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
