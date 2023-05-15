import { h, Component, effect, ref } from 'vue'
import { useUserStore } from '@/store/user'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'

import {
  PodiumOutline as PodiumIcon,
  FilterOutline as FilterOutlineIcon,
  DocumentTextOutline as DocumentTextIcon,
  FileTrayStackedOutline as FileTrayStackedIcon,
  AddCircleOutline as AddCircleIcon,
  FingerPrintOutline as FingerPrintIcon,
  PaperPlane as PaperPlaneIcon,
} from '@vicons/ionicons5'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

function renderChildOption(to: string, title: string, icon: Component) {
  return {
    label: () =>
      h(
        RouterLink,
        {
          to,
        },
        { default: () => title }
      ),
    key: to,
    icon: renderIcon(icon),
  }
}

export const getMenuOptions = () => {
  const menu = ref<MenuOption[]>()
  const userStore = useUserStore()
  effect(() => {
    if (userStore.userInfo?.role === 1) {
      // 博主
      menu.value = bloggerMenuOptions
    } else if (
      userStore.userInfo?.role === 2 ||
      userStore.userInfo?.role === 3
    ) {
      // 管理员
      menu.value = managerMenuOptions
    }
  })
  return menu
}

const managerMenuOptions: MenuOption[] = [
  {
    label: '文章',
    key: '/blogs',
    icon: renderIcon(FileTrayStackedIcon),
    children: [
      renderChildOption('/blogs/audit-blogs', '审核文章', FilterOutlineIcon),
      renderChildOption('/blogs/all-blogs', '所有文章', DocumentTextIcon),
      renderChildOption('/blogs/publish-blog', '上传文章', AddCircleIcon),
      renderChildOption('/blogs/creation', '在线创作', PaperPlaneIcon),
    ],
  },
  renderChildOption('/data-monitor', '数据监控', PodiumIcon),
  renderChildOption('/permission-management', '权限管理', FingerPrintIcon),
]

const bloggerMenuOptions: MenuOption[] = [
  {
    label: '文章',
    key: '/blogs',
    icon: renderIcon(FileTrayStackedIcon),
    children: [
      renderChildOption('/blogs/all-blogs', '所有文章', DocumentTextIcon),
      renderChildOption('/blogs/publish-blog', '上传文章', AddCircleIcon),
      renderChildOption('/blogs/creation', '在线创作', PaperPlaneIcon),
    ],
  },
]
