<template>
  <div class="p-4">
    <n-card title="晋升用户">
      <div class="flex flex-row-reverse mb-3">
        <n-input
          v-model:value="userIdOrName"
          style="width: 200px"
          type="text"
          placeholder="查找用户"
          clearable
        >
          <template #suffix>
            <SearchOutline @click="handleSearch" class="w-4 h-4" />
          </template>
        </n-input>
      </div>
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
        v-if="!loading && userList"
        :columns="columns"
        :data="userList"
        :bordered="false"
        :paginate-single-page="false"
        :pagination="{ pageSize: 8 }"
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
import { computed, h, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  NCard,
  NDataTable,
  NInput,
  NSkeleton,
  NEmpty,
  NImage,
  NSpace,
  NImageGroup,
  NPopover,
  NButton,
  useDialog,
  useMessage,
} from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { SearchOutline } from '@vicons/ionicons5'
import dayjs from '@/utils/day'
import { searchUser } from '@/api'
import type { UserInfoWithUnuse } from '@/types'

const router = useRouter()

const message = useMessage()
const dialog = useDialog()

const userIdOrName = ref('')

const userList = ref<UserInfoWithUnuse[]>()

const loading = ref(false)
const error = ref<Error | null>(null)

const handleSearch = () => {
  if (!userIdOrName.value) return
  loading.value = true
  searchUser(userIdOrName.value)
    .then((data) => {
      console.log(data)
      userList.value = data
    })
    .catch((err) => {
      console.log(err)
      error.value = err
    })
    .finally(() => {
      loading.value = false
    })
}

const createColumns = (): DataTableColumns<UserInfoWithUnuse> => {
  return [
    {
      title: 'ID',
      key: 'id',
    },
    {
      title: '用户名',
      key: 'userName',
    },
    {
      title: '头像',
      key: 'avatar',
    },
    {
      title: '身份',
      key: 'role',
      render(row) {
        let text: string
        switch (row.role) {
          case 1:
            text = '博主'
            break
          case 2:
            text = '管理员'
            break
          default:
            text = '其他'
        }
        return h('span', text)
      },
    },
    {
      title: '已注销',
      key: 'unuse',
      render(row) {
        let text: string
        switch (row.unuse) {
          case 0:
            text = '否'
            break
          case 1:
            text = '是'
            break
          default:
            text = '其他'
        }
        return h('span', text)
      },
    },
  ]
}

const columns = createColumns()
</script>
