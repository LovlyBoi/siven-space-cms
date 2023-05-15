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
import { h, ref } from 'vue'
import {
  NCard,
  NDataTable,
  NInput,
  NSkeleton,
  NEmpty,
  NSpace,
  NButton,
  useDialog,
  useMessage,
} from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { SearchOutline } from '@vicons/ionicons5'
import { searchUser, updateUserRole } from '@/api'
import { useUserStore } from '@/store/user'
import type { UserInfoWithUnuse } from '@/types'

const userStore = useUserStore()

const dialog = useDialog()

const message = useMessage()

const userIdOrName = ref('')

const userList = ref<UserInfoWithUnuse[]>()

const roleList = ['Lv.0', '用户', '管理员', '超管', 'Lv.4']

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
          case 3:
            text = '超管'
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
    {
      title: '操作',
      key: 'action',
      render: (row) => {
        return h(
          NSpace,
          {},
          {
            default: () => [
              h(
                NButton,
                {
                  text: true,
                  onClick: () => {
                    handleUpgradeConfirm(row, 1)
                  },
                  disabled:
                    row.role >= 3 ||
                    !checkPermission(row.role, (row.role + 1) as 2 | 3),
                },
                {
                  default: () => {
                    if (row.role >= 3) return '已有最高权限'
                    const toRole = row.role + 1
                    return `晋升为${roleList[toRole]}`
                  },
                }
              ),
              h(
                NButton,
                {
                  text: true,
                  onClick: () => {
                    handleUpgradeConfirm(row, -1)
                  },
                  disabled:
                    row.role <= 1 ||
                    !checkPermission(row.role, (row.role - 1) as 1 | 2),
                },
                {
                  default: () => {
                    if (row.role <= 1) return '已为普通用户'
                    const toRole = row.role - 1
                    return `降级为${roleList[toRole]}`
                  },
                }
              ),
            ],
          }
        )
      },
    },
  ]
}

const checkPermission = (oldRole: 1 | 2 | 3, newRole: 1 | 2 | 3) => {
  const role = userStore.userInfo?.role
  if (role === 2) {
    // 当前用户是管理员，只能把普通用户晋升为管理员
    if (oldRole === 1 && newRole === 2) {
      return true
    }
    return false
  } else if (role === 3) {
    // 当前用户是超管，什么都可以做
    return true
  } else {
    return false
  }
}

const handleUpgradeConfirm = (row: UserInfoWithUnuse, action: 1 | -1) => {
  const oldRole = row.role
  const newRole = (row.role + action) as 0 | 1 | 2 | 3 | 4
  if (oldRole <= 1 && action === -1) {
    return message.error('当前用户已经是普通用户了')
  } else if (oldRole >= 3 && action === 1) {
    return message.error('当前用户已经是超管了')
  }
  dialog.warning({
    title: '警告',
    content: `确定要将用户「${row.userName}」晋升为「${roleList[newRole]}」吗？`,
    action: () =>
      h(
        NSpace,
        {
          align: 'center',
        },
        {
          default: () => [
            h(
              NButton,
              {
                text: true,
                size: 'tiny',
                onClick: () => dialog.destroyAll(),
              },
              {
                default: () => '别，我想想',
              }
            ),
            h(
              NButton,
              {
                quaternary: true,
                type: 'warning',
                onClick: () => {
                  if (!checkPermission(oldRole, newRole as 1 | 2 | 3)) {
                    return message.error('您没有对应权限')
                  }
                  updateRole(row.id, oldRole, newRole as 1 | 2 | 3)
                  dialog.destroyAll()
                },
              },
              {
                default: () => '确定',
              }
            ),
          ],
        }
      ),
  })
}

const updateRole = (userId: string, oldRole: 1 | 2 | 3, newRole: 1 | 2 | 3) => {
  updateUserRole(userId, oldRole, newRole)
    .then(() => {
      message.success('修改成功')
      handleSearch()
    })
    .catch((err) => {
      console.log(err)
      message.error('修改失败')
    })
}

const columns = createColumns()
</script>
