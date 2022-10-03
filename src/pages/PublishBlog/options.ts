import { ref } from 'vue'
import { BlogType } from '@/types'

export const typeOptions = ref([
  {
    label: '笔记',
    value: BlogType.note,
  },
  {
    label: '随笔',
    value: BlogType.essay,
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
