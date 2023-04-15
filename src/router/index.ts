import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import MainPage from '@/pages/Main.vue'
import AllBlogsPage from '@/pages/AllBlogs/AllBlogs.vue'
import PublishBlogPage from '@/pages/PublishBlog/PublishBlog.vue'
import CreationPage from '@/pages/Creation/Creation.vue'
import PermissionManagement from '@/pages/PermissionManagement.vue'
import EditPage from '@/pages/EditPage.vue'
import UserPage from '@/pages/User/User.vue'
import Login from '@/pages/User/Login.vue'
import Register from '@/pages/User/Register.vue'

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
    path: '/blogs/creation',
    name: 'creation',
    component: CreationPage,
  },
  {
    path: '/blogs/edit-blog/:id',
    name: 'editBlog',
    component: EditPage,
  },
  {
    path: '/data-monitor',
    name: 'dataMonitor',
    component: () => import('@/pages/DataMonitor/DataMonitor.vue'),
  },
  {
    path: '/permission-management',
    name: 'permission-management',
    component: PermissionManagement,
  },
  {
    path: '/user',
    name: 'user',
    component: UserPage,
    children: [
      {
        path: '/user/login',
        name: 'login',
        component: Login,
      },
      {
        path: '/user/register',
        name: 'register',
        component: Register,
      },
    ],
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
