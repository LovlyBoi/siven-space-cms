<template>
  <div class="p-4">
    <NCard>
      {{ dailyGreeting
      }}{{
        userStore.userInfo?.username && `，${userStore.userInfo?.username}`
      }}。
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NCard } from 'naive-ui'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

console.log(userStore.userInfo)

const dailyGreeting = computed(() => {
  const now = new Date()
  const timeOfDay = now.getHours()
  if (0 <= timeOfDay && timeOfDay <= 3) {
    return '晚上好'
  } else if (3 < timeOfDay && timeOfDay <= 12) {
    return '早上好'
  } else if (12 < timeOfDay && timeOfDay <= 13) {
    return '中午好'
  } else if (13 < timeOfDay && timeOfDay <= 19) {
    return '下午好'
  } else if (19 < timeOfDay && timeOfDay <= 23) {
    return '晚上好'
  } else {
    return '你好'
  }
})
</script>
