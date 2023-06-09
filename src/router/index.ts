import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import { useUserStore } from '@/store/user'
// import { useToast } from 'vue-toast-notification'

import MainPage from '@/pages/Main.vue'
import AllBlogsPage from '@/pages/AllBlogs/AllBlogs.vue'
import AuditBlogsPage from '@/pages/AuditBlogs/AuditBlogs.vue'
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
    props: () => {
      const userStore = useUserStore()
      return {
        key: userStore.userInfo?.id,
      }
    },
  },
  {
    path: '/blogs/audit-blogs',
    name: 'auditBlogs',
    component: AuditBlogsPage,
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
    component: () =>
      import(/*@vitejs/preload*/ '@/pages/DataMonitor/DataMonitor.vue'),
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

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  const userStore = useUserStore()
  if (to.fullPath === '/user/login' || to.fullPath === '/user/register') {
    if (userStore.isLogin) {
      return '/blogs/all-blogs'
    }
  } else if (/^\/blogs/.test(to.fullPath)) {
    if (!userStore.isLogin) {
      if (userStore.isRestoring) return
      window.$message.info('请先登录')
      return '/user/login'
    }
  }
})

export default router
