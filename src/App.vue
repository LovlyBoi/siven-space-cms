<template>
  <div class="relative h-screen">
    <n-message-provider>
      <n-dialog-provider>
        <n-layout position="absolute">
          <n-layout-header position="absolute">
            <div class="w-full bg-slate-300 h-11">Header</div>
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
</script>

<style lang="ts" scoped></style>
