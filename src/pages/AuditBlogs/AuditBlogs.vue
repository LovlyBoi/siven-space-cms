<template>
  <div class="p-4">
    <n-card title="待审核文章">
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
    <NModal v-model:show="showPreview">
      <Preview :blog-id="currBlogId" @close="() => (showPreview = false)" />
    </NModal>
  </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue'
import {
  NCard,
  NDataTable,
  NSkeleton,
  NEmpty,
  NImage,
  NSpace,
  NImageGroup,
  NInput,
  NPopover,
  NButton,
  NWatermark,
  useDialog,
  useMessage,
  NModal,
} from 'naive-ui'
// import EditModal from './EditModal.vue'
import type { DataTableColumns } from 'naive-ui'
import Preview from '../../components/Preview.vue'
import { BlogType2Ch } from '@/utils/blogTypeToCh'
import { mapColor, CardWithAudit } from '@/types'
import dayjs from '@/utils/day'
import { useUserStore } from '@/store/user'
import { getBlogsToBeAudit, auditBlog } from '@/api'

const cards = ref<CardWithAudit[]>()

const userStore = useUserStore()

const dialog = useDialog()

const currBlogId = ref('')

const showPreview = ref(false)

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
          {
            href: 'javascript:;',
            onClick: () => {
              showPreviewModal(id)
            },
          },
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
      render({ audit }) {
        return h(
          'span',
          {
            class: {
              'text-green-600': audit === 0,
              'text-yellow-500': audit === 1,
              'text-red-500': audit === 2,
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
        return pictures.length > 0
          ? h(
              NImageGroup,
              {},
              {
                default: () => {
                  const picturesUrl = pictures.map((url) => {
                    const { pathname } = new URL(url)
                    let baseUrl = import.meta.env.VITE_AXIOS_BASEURL
                    if (baseUrl?.endsWith('/')) {
                      baseUrl = baseUrl.slice(0, -1)
                    }
                    return baseUrl + pathname
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
                  type: 'primary',
                  onClick: () => {
                    handleConfirmAccessAudit(row)
                  },
                },
                {
                  default: () => '通过',
                }
              ),
              h(
                NButton,
                {
                  text: true,
                  type: 'warning',
                  onClick: () => {
                    handleNoAccessAuditConfirm(row)
                  },
                },
                {
                  default: () => '不通过',
                }
              ),
            ],
          }
        )
      },
    },
  ]
}

const handleConfirmAccessAudit = (row: CardWithAudit) => {
  dialog.info({
    title: '确认审核通过',
    content: '确定通过该文章的审核吗？',
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
                default: () => '取消',
              }
            ),
            h(
              NButton,
              {
                quaternary: true,
                type: 'warning',
                onClick: () => {
                  accessAudit(row.id)
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

const accessAudit = (blogId: string) => {
  auditBlog(blogId, 0).then(() => {
    getData()
  })
}

const noAccessAudit = (blogId: string, msg: string) => {
  auditBlog(blogId, 2, msg).then(() => {
    getData()
  })
}

const showPreviewModal = (blogId: string) => {
  currBlogId.value = blogId
  showPreview.value = true
}

const noAccessReason = ref('由于xxx原因，导致您的文章审核未通过。')

const handleNoAccessAuditConfirm = (row: CardWithAudit) => {
  dialog.info({
    title: '不通过原因',
    content: () => {
      return h('div', {}, [
        h('p', { class: 'my-3' }, '请输入该文章不通过的原因'),
        h(NInput, {
          type: 'textarea',
          autosize: {
            minRows: 3,
            maxRows: 5,
          },
          value: noAccessReason.value,
          onInput: (v) => (noAccessReason.value = v),
        }),
      ])
    },
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
                default: () => '取消',
              }
            ),
            h(
              NButton,
              {
                quaternary: true,
                type: 'warning',
                onClick: () => {
                  noAccessAudit(row.id, noAccessReason.value)
                  dialog.destroyAll()
                  noAccessReason.value = ''
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

let loading = ref(true)
let error = ref(false)

function getData() {
  loading.value = true
  getBlogsToBeAudit()
    .then(({ cards: data }) => {
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

const columns = createColumns()
</script>
