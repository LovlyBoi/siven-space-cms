<template>
  <div class="relative h-screen">
    <n-message-provider>
      <n-layout position="absolute">
        <n-layout-header position="absolute">
          <div class="w-full bg-slate-300 h-11">Header</div>
        </n-layout-header>
        <n-layout-content position="absolute" style="top: 44px" has-sider>
          <MenuBar />
          <n-layout-content>
            <RouterView />
          </n-layout-content>
        </n-layout-content>
      </n-layout>
    </n-message-provider>
  </div>
</template>

<script setup lang="ts">
import {
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NMessageProvider,
} from 'naive-ui'
import MenuBar from '@/components/SideBar/menu.vue'
</script>

<style lang="ts" scoped></style>
