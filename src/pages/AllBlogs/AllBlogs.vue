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
        :paginate-single-page="false"
        :pagination="{ pageSize: 5 }"
      />
      <n-empty v-if="!loading && error" description="数据加载失败">
        <template #extra>
          <n-button @click="$router.replace('/')" size="small">
            看看别的
          </n-button>
        </template>
      </n-empty>
    </n-card>
    <edit-modal v-model="showModal" :data="rowBlogForEditModal" />
  </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  NCard,
  NDataTable,
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
import EditModal from './EditModal.vue'
import type { DataTableColumns } from 'naive-ui'
import { BlogType2Ch } from './utils'
import { mapColor, Card } from '@/types'
import dayjs from '@/utils/day'
import { getNotes, deleteBlog } from '@/api'

let cards = ref<Card[]>()

const router = useRouter()

const showModal = ref(false)

const message = useMessage()
const dialog = useDialog()

const rowBlogForEditModal = ref<Card | null>(null)

const createColumns = (): DataTableColumns<Card> => {
  return [
    {
      title: 'ID',
      key: 'id',
      render({ id }) {
        return h(
          NPopover,
          {
            trigger: 'hover',
          },
          {
            trigger: () => h('span', {}, id.slice(0, 6) + '...'),
            default: () => h('span', {}, id),
          }
        )
      },
    },
    {
      title: '标题',
      key: 'title',
    },
    {
      title: '作者',
      key: 'author',
    },
    {
      title: '类型',
      key: 'type',
      render({ type }) {
        return h('span', {}, BlogType2Ch[type])
      },
    },
    {
      title: 'tag',
      key: 'tag',
      render({ tag: { color, name } }) {
        return h(
          'div',
          {
            class:
              mapColor[color] + ' text-xs font-light text-white inline-block',
            style: 'padding: 1px 6px; border-radius: 4px',
          },
          name
        )
      },
    },
    {
      title: '发布日期',
      key: 'publishDate',
      render({ publishDate }) {
        return h(
          NPopover,
          {
            trigger: 'hover',
          },
          {
            trigger: () => h('span', {}, dayjs(publishDate).format('YY/M/D')),
            default: () =>
              h('span', {}, dayjs(publishDate).format('YYYY年M月D日 HH:mm:ss')),
          }
        )
      },
    },
    {
      title: '更新日期',
      key: 'updateDate',
      render({ updateDate }) {
        return h(
          NPopover,
          {
            trigger: 'hover',
          },
          {
            trigger: () => h('span', {}, dayjs(updateDate).format('YY/M/D')),
            default: () =>
              h('span', {}, dayjs(updateDate).format('YYYY年M月D日 HH:mm:ss')),
          }
        )
      },
    },
    {
      title: '封面',
      key: 'cover',
      render: ({ pictures }) => {
        return h(
          NImageGroup,
          {},
          {
            default: () =>
              h(
                NSpace,
                {},
                {
                  default: () =>
                    pictures.map((pic) => {
                      return h(NImage, {
                        src: pic + '?w=70',
                        previewSrc: pic,
                        width: '50',
                        height: '50',
                        objectFit: 'cover',
                        lazy: true,
                      })
                    }),
                }
              ),
          }
        )
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
                    router.push(`/blogs/edit-blog/${row.id}`)
                  },
                },
                {
                  default: () => '在线修改',
                }
              ),
              h(
                NButton,
                {
                  text: true,
                  onClick: () => {
                    rowBlogForEditModal.value = row
                    showModal.value = true
                  },
                  // onClick: () => {
                  //   router.push(`/blogs/edit-blog/${row.id}`)
                  // },
                },
                {
                  default: () => '编辑',
                }
              ),
              h(
                NButton,
                {
                  text: true,
                  onClick: () => {
                    handleRemoveConfirm(row)
                  },
                },
                {
                  default: () => '删除',
                }
              ),
            ],
          }
        )
      },
    },
  ]
}

const handleRemoveConfirm = (row: Card) => {
  dialog.warning({
    title: '删除',
    content: `你确定删除 [${row.title}] 这篇博客？`,
    maskClosable: false,
    onEsc: () => {
      message.success('通过 esc 关闭')
    },
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
                onClick: () => (handleRemove(row), dialog.destroyAll()),
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

const handleRemove = async ({ id }: Card) => {
  console.log(id, 'delete')
  await deleteBlog(id)
  message.success('删除成功')
  initData()
}

let loading = ref(true)
let error = ref(false)

function initData() {
  getNotes()
    .then((data) => {
      cards.value = data
      loading.value = false
    })
    .catch((err) => {
      loading.value = false
      error.value = true
      cards.value = []
      console.log(err)
    })
}

initData()

const columns = createColumns()
</script>
