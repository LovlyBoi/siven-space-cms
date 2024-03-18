<template>
  <div class="p-4">
    <n-card title="所有文章">
      <div v-if="loading">
        <n-skeleton
          style="margin-bottom: 10px"
          height="40px"
          width="100%"
          :sharp="false"
          :repeat="5"
        />
      </div>
      <n-watermark
        content="⚠️核心机密⚠️"
        cross
        selectable
        :font-size="18"
        :line-height="18"
        :width="500"
        :height="300"
        :x-offset="12"
        :y-offset="28"
        :rotate="-15"
      >
        <n-data-table
          v-if="!loading && !error"
          :columns="columns"
          :data="cards"
          :bordered="false"
          :paginate-single-page="false"
          :pagination="{ pageSize: 8 }"
        />
      </n-watermark>
      <n-empty v-if="!loading && error" description="数据加载失败">
        <template #extra>
          <n-button @click="$router.replace('/')" size="small">
            看看别的
          </n-button>
        </template>
      </n-empty>
    </n-card>
    <edit-modal
      v-model="showModal"
      :data="rowBlogForEditModal"
      @update="handleEditModalUpdate"
    />
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
  NWatermark,
  useDialog,
  useMessage,
} from 'naive-ui'
import EditModal from './EditModal.vue'
import type { DataTableColumns } from 'naive-ui'
import { BlogType2Ch } from '@/utils/blogTypeToCh'
import { mapColor, CardWithAudit } from '@/types'
import dayjs from '@/utils/day'
import { getBlogsByAuthor, deleteBlog } from '@/api'
import { useUserStore } from '@/store/user'

const cards = ref<CardWithAudit[]>()

const router = useRouter()

const showModal = ref(false)

const message = useMessage()
const dialog = useDialog()

const userStore = useUserStore()

const rowBlogForEditModal = ref<CardWithAudit | null>(null)

const mapAuditState = ['已通过', '审核中', '未通过审核']

const createColumns = (): DataTableColumns<CardWithAudit> => {
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
      render({ id, title }) {
        return h(
          'a',
          { href: `${import.meta.env.VITE_APP_LOCATION}/article/${id}` },
          title
        )
      },
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
      title: '状态',
      key: 'audit',
      render({ audit, auditMsg }) {
        return audit === 2
          ? h(
              NPopover,
              {
                trigger: 'hover',
              },
              {
                default: () => h('span', {}, auditMsg),
                trigger: () =>
                  h(
                    'span',
                    {
                      class: 'text-red-500',
                    },
                    [mapAuditState[audit]]
                  ),
              }
            )
          : h(
              'span',
              {
                class: {
                  'text-green-600': audit === 0,
                  'text-yellow-500': audit === 1,
                },
              },
              [mapAuditState[audit]]
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
        console.log(pictures)
        return pictures.length > 0
          ? h(
              NImageGroup,
              {},
              {
                default: () =>
                  h(
                    NSpace,
                    {},
                    {
                      default: () => {
                        const picturesUrl = pictures.map((url) => {
                          let baseUrl = import.meta.env.VITE_AXIOS_BASEURL
                          if (baseUrl?.endsWith('/')) {
                            baseUrl = baseUrl.slice(0, -1)
                          }
                          return `${baseUrl}/image/${url}`
                        })

                        return picturesUrl.map((pic) => {
                          return h(NImage, {
                            src: pic + '?w=70',
                            previewSrc: pic,
                            width: '50',
                            height: '50',
                            objectFit: 'cover',
                          })
                        })
                      },
                    }
                  ),
              }
            )
          : h('span', { class: 'text-gray-400' }, '暂无封面')
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

const handleRemoveConfirm = (row: CardWithAudit) => {
  dialog.warning({
    title: '删除',
    content: `你确定删除 [${row.title}] 这篇博客？`,
    maskClosable: false,
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

const handleRemove = async ({ id }: CardWithAudit) => {
  console.log(id, 'delete')
  await deleteBlog(id)
  message.success('删除成功')
  getData()
}

let loading = ref(true)
let error = ref(false)

function getData() {
  if (!userStore.userInfo) return

  loading.value = true
  getBlogsByAuthor(userStore.userInfo?.id || '')
    .then(({ cards: data }) => {
      console.log(data)
      cards.value = data
    })
    .catch((err) => {
      error.value = true
      cards.value = []
      console.log(err)
    })
    .finally(() => {
      loading.value = false
    })
}

getData()

const handleEditModalUpdate = () => {
  console.log('handleEditModalUpdate')
  getData()
}

const columns = createColumns()
</script>
