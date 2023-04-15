<template>
  <header class="w-full border-b h-11 head-nav">
    <div class="flex justify-between h-full p-4">
      <div class="flex items-center left-nav">
        <img :src="ViteLogo" alt="vite" />
        <h1 class="ml-6 text-lg">How To Cook 管理平台</h1>
      </div>
      <div class="flex items-center right-nav">
        <router-link
          class="text-center cursor-pointer login-btn"
          to="/user/login"
          >log in</router-link
        >
        <div
          class="px-2 ml-4 text-green-600 border border-green-600 rounded cursor-pointer setup-btn leading-11 hover:text-green-500 hover:border-green-500"
        >
          <router-link to="/user/register">set up for free</router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import ViteLogo from '/public/vite.svg'
import { useMainStore } from '@/store'

const mainStore = useMainStore()

// console.log(mainStore.isLogin)
</script>

<style lang="less" scoped></style>
