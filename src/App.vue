<template>
  <div class="relative h-screen">
    <n-message-provider>
      <n-dialog-provider>
        <n-layout position="absolute">
          <n-layout-header position="absolute">
            <head-nav></head-nav>
          </n-layout-header>
          <n-layout-content position="absolute" style="top: 44px" has-sider>
            <MenuBar />
            <n-layout-content>
              <RouterView v-slot="{ Component }">
                <keep-alive exclude="EditPage">
                  <component :is="Component" />
                </keep-alive>
              </RouterView>
            </n-layout-content>
          </n-layout-content>
        </n-layout>
      </n-dialog-provider>
    </n-message-provider>
  </div>
</template>

<script setup lang="ts">
import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NMessageProvider,
  NDialogProvider,
} from 'naive-ui'
import MenuBar from '@/components/SideBar/menu.vue'
import HeadNav from '@/components/Header/HeadNav.vue'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const router = useRouter()

const userStore = useUserStore()

const toast = useToast({
  position: 'top-right',
  pauseOnHover: true,
})

userStore
  .restoreLoginState()
  .then(() => {
    router.push('/blogs/all-blogs')
  })
  .catch((err) => {
    console.warn('自动登录失败', err)
    toast.info('登录过期')
  })
</script>
