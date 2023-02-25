<template>
  <header class="w-full border-b h-11 head-nav">
    <div class="flex justify-between h-full p-4">
      <div class="flex items-center left-nav">
        <img :src="ViteLogo" alt="vite" />
      </div>
      <div class="flex items-center right-nav">
        <a class="text-center cursor-pointer login-btn">log in</a>
        <div
          class="px-2 ml-4 text-green-600 border border-green-600 rounded cursor-pointer setup-btn leading-11 hover:text-green-500 hover:border-green-500"
        >
          <a href="">set up for free</a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import ViteLogo from '/public/vite.svg'
import { useMainStore } from '/src/store'

const mainStore = useMainStore()

// console.log(mainStore.isLogin)
</script>

<style lang="less" scoped></style>
