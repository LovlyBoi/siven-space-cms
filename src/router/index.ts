import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import MainPage from '@/pages/Main.vue'
import AllBlogsPage from '@/pages/AllBlogs/AllBlogs.vue'
import PublishBlogPage from '@/pages/PublishBlog/PublishBlog.vue'
import DataMonitorPage from '@/pages/DataMonitor.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'main',
    component: MainPage,
  },
  {
    path: '/blogs/all-blogs',
    name: 'allBlogs',
    component: AllBlogsPage,
  },
  {
    path: '/blogs/publish-blog',
    name: 'publishBlog',
    component: PublishBlogPage,
  },
  {
    path: '/data-monitor',
    name: 'dataMonitor',
    component: DataMonitorPage,
  },
  {
    path: '/permission-management',
    name: 'permission-management',
    component: DataMonitorPage,
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
