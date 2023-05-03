<template>
  <n-layout-sider
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :collapsed="collapsed"
    show-trigger
    @collapse="collapsed = true"
    @expand="collapsed = false"
  >
    <n-menu
      :value="activeKey"
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
      accordion
    />
  </n-layout-sider>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NLayoutSider, NMenu } from 'naive-ui'
import { getMenuOptions } from './menuList'
import { useRoute } from 'vue-router'

const route = useRoute()

const currRoutePath = computed(() => route.path)

const activeKey = currRoutePath

const collapsed = ref(false)

const menuOptions = getMenuOptions()
</script>
