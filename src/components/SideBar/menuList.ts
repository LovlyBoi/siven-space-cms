import { h, Component } from 'vue'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'

import {
  PodiumOutline as PodiumIcon,
  DocumentTextOutline as DocumentTextIcon,
  FileTrayStackedOutline as FileTrayStackedIcon,
  AddCircleOutline as AddCircleIcon,
  FingerPrintOutline as FingerPrintIcon,
  PaperPlane as PaperPlaneIcon,
} from '@vicons/ionicons5'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

export const menuOptions: MenuOption[] = [
  {
    label: '文章',
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
            { default: () => '所有文章' }
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
            { default: () => '上传文章' }
          ),
        key: '/blogs/publish-blog',
        icon: renderIcon(AddCircleIcon),
      },
      {
        label: () =>
          h(
            RouterLink,
            {
              to: '/blogs/creation',
            },
            { default: () => '在线创作' }
          ),
        key: '/blogs/creation',
        icon: renderIcon(PaperPlaneIcon),
      },
    ],
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: '/data-monitor',
        },
        { default: () => '数据监控' }
      ),
    key: '/data-monitor',
    icon: renderIcon(PodiumIcon),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: '/permission-management',
        },
        { default: () => '权限管理' }
      ),
    key: '/permission-management',
    icon: renderIcon(FingerPrintIcon),
  },
]
