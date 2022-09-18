import { h, Component } from 'vue'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'

import {
  // BookOutline as BookIcon,
  // PersonOutline as PersonIcon,
  // WineOutline as WineIcon,
  PodiumOutline as PodiumIcon,
  DocumentTextOutline as DocumentTextIcon,
  FileTrayStackedOutline as FileTrayStackedIcon,
  AddCircleOutline as AddCircleIcon,
  FingerPrintOutline as FingerPrintIcon,
} from '@vicons/ionicons5'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

export const menuOptions: MenuOption[] = [
  {
    label: '博客',
    key: '/blogs',
    icon: renderIcon(FileTrayStackedIcon),
    children: [
      {
        label: () =>
          h(
            RouterLink,
            {
              to: '/blogs/all-blogs',
            },
            { default: () => '所有博客' }
          ),
        key: '/blogs/all-blogs',
        icon: renderIcon(DocumentTextIcon),
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: '/blogs/publish-blog',
            },
            { default: () => '发布博客' }
          ),
        key: '/blogs/publish-blog',
        icon: renderIcon(AddCircleIcon),
      },
    ],
  },
  // {
  //   label: '舞，舞，舞',
  //   key: 'dance-dance-dance',
  //   icon: renderIcon(BookIcon),
  //   children: [
  //     {
  //       type: 'group',
  //       label: '人物',
  //       key: 'people',
  //       children: [
  //         {
  //           label: '叙事者',
  //           key: 'narrator',
  //           icon: renderIcon(PersonIcon)
  //         },
  //         {
  //           label: '羊男',
  //           key: 'sheep-man',
  //           icon: renderIcon(PersonIcon)
  //         }
  //       ]
  //     },
  //     {
  //       label: '饮品',
  //       key: 'beverage',
  //       icon: renderIcon(WineIcon),
  //       children: [
  //         {
  //           label: '威士忌',
  //           key: 'whisky'
  //         }
  //       ]
  //     },
  //     {
  //       label: '食物',
  //       key: 'food',
  //       children: [
  //         {
  //           label: '三明治',
  //           key: 'sandwich'
  //         }
  //       ]
  //     },
  //     {
  //       label: '过去增多，未来减少',
  //       key: 'the-past-increases-the-future-recedes'
  //     }
  //   ]
  // },
  {
    label: '数据监控',
    key: '/data-monitor',
    icon: renderIcon(PodiumIcon),
  },
  {
    label: '权限管理',
    key: '/permission-management',
    icon: renderIcon(FingerPrintIcon),
  },
]
