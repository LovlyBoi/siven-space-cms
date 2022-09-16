import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import MainPage from '@/pages/Main.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'main',
    component: MainPage,
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
