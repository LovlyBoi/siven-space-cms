<template>
  <div class="p-4">
    <n-card title="所有博客">
      <div v-if="loading">
        <n-skeleton
          style="margin-bottom: 10px"
          height="40px"
          width="100%"
          :sharp="false"
          :repeat="5"
        />
      </div>
      <n-data-table
        v-if="!loading && !error"
        :columns="columns"
        :data="cards"
        :bordered="false"
        :pagination="{}"
      />
      <n-empty v-if="!loading && error" description="数据加载失败">
        <template #extra>
          <n-button @click="$router.replace('/')" size="small">
            看看别的
          </n-button>
        </template>
      </n-empty>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NDataTable, NSkeleton, NButton, NEmpty } from 'naive-ui'
import { createColumns, handleCards, Blog } from './Columns'
import { getNotes } from '@/api'

let cards = ref<Blog[]>()

let loading = ref(true)
let error = ref(false)

getNotes()
  .then((data) => {
    cards.value = handleCards(data)
    loading.value = false
  })
  .catch((err) => {
    loading.value = false
    error.value = true
    cards.value = []
    console.log(err)
  })

const columns = createColumns()
</script>

<style scoped></style>
