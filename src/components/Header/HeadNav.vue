<template>
  <header class="w-full border-b h-11 head-nav">
    <div class="flex justify-between h-full p-4">
      <div class="flex items-center left-nav">
        <img :src="ViteLogo" alt="vite" />
        <h1 class="ml-6 text-lg">Siven Space 管理平台</h1>
      </div>
      <div class="flex items-center right-nav" v-if="!userStore.isLogin">
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
      <div class="flex items-center pr-8" v-else>
        <NDropdown :options="dropdownOptions">
          <NAvatar>{{ userStore.userInfo?.username }}</NAvatar>
        </NDropdown>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { h } from 'vue'
import type { Component } from 'vue'
import { NAvatar, NDropdown, NIcon } from 'naive-ui'
import ViteLogo from '/public/vite.svg'
import {
  PersonCircleOutline as UserIcon,
  Pencil as EditIcon,
  LogOutOutline as LogoutIcon,
} from '@vicons/ionicons5'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const handleLogout = () => {
  userStore.logout()
}

const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    })
  }
}

const dropdownOptions = [
  {
    label: '用户资料',
    key: 'profile',
    icon: renderIcon(UserIcon),
  },
  {
    label: '编辑用户资料',
    key: 'editProfile',
    icon: renderIcon(EditIcon),
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(LogoutIcon),
    props: {
      onClick: handleLogout,
    },
  },
]
</script>

<style lang="less" scoped></style>
