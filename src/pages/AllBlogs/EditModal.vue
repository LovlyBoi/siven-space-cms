<template>
  <n-modal v-model:show="showModal">
    <n-card
      style="width: 600px"
      title="修改"
      :bordered="false"
      size="huge"
      role="dialog"
      closable
      @close="handleClose"
      aria-modal="true"
    >
      <n-form ref="formRef" :label-width="80" :model="formValue">
        <!-- <n-form-item label="作者">
          <n-input
            placeholder="author"
            :maxlength="15"
            v-model:value="formValue.author"
            @blur="formValue.author = formValue.author.trim()"
            clearable
            show-count
            style="width: 300px"
          />
        </n-form-item> -->
        <n-form-item label="标题">
          <n-input
            placeholder="title"
            :maxlength="40"
            v-model:value="formValue.title"
            @blur="formValue.title = formValue.title.trim()"
            type="textarea"
            show-count
            style="width: 400px"
          />
        </n-form-item>
        <n-form-item label="文章类型">
          <n-select
            v-model:value="formValue.type"
            :options="typeOptions"
            style="width: 300px"
          />
        </n-form-item>
        <n-form-item label="tag 颜色">
          <n-select
            v-model:value="formValue.tag.color"
            :options="tagColorOptions"
            style="width: 200px"
          />
        </n-form-item>
        <n-form-item label="tag 名">
          <n-input
            placeholder="tag color"
            :maxlength="15"
            v-model:value="formValue.tag.name"
            @blur="formValue.tag.name = formValue.tag.name.trim()"
            clearable
            show-count
            style="width: 300px"
          />
        </n-form-item>
        <n-form-item label="文章">
          这是一篇已经发布的文章，您可以选择
          <router-link
            class="mx-1 text-green-700 underline hover:text-green-600"
            @click="handleClose"
            :to="`/blogs/edit-blog/${formValue.id || 'empty-id'}`"
          >
            在线修改
          </router-link>
          或
          <n-upload
            abstract
            :action="`${baseUrl}/upload/markdown/reupload/${data?.id || ''}`"
            @finish="handleReUploadFinish"
          >
            <n-upload-trigger #="{ handleClick }" abstract>
              <span
                class="mx-1 text-green-700 underline cursor-pointer hover:text-green-600"
                @click="handleClick"
              >
                重新上传
              </span>
            </n-upload-trigger>
          </n-upload>
          。
        </n-form-item>
      </n-form>
      <template #footer>
        <div class="float-right">
          <n-button
            text
            size="tiny"
            style="margin-right: 10px"
            @click="handleClose"
          >
            算了
          </n-button>
          <n-button tertiary type="primary" @click="handleSubmitEdit">
            修改！
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, PropType, toRaw } from 'vue'
import {
  NModal,
  NCard,
  NButton,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NUpload,
  NUploadTrigger,
  useMessage,
} from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'
import { BlogToPost, BlogType, Card } from '@/types'
import { useUserStore } from '@/store/user'
import { typeOptions, tagColorOptions } from '../PublishBlog/options'
import { omit } from 'lodash-es'
import { editBlogInfo } from '@/api'

const userStore = useUserStore()

const emit = defineEmits(['update:modelValue', 'update'])

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
  data: {
    type: [Object, null] as PropType<Card | null>,
    required: true,
  },
})

const message = useMessage()

const baseUrl = import.meta.env.VITE_AXIOS_BASEURL

const deepClone = <T extends object>(obj: T): T =>
  JSON.parse(JSON.stringify(obj))

const defaultFormValue: BlogToPost = {
  id: '',
  title: '',
  author: userStore.userInfo?.id || '',
  type: BlogType['front-end-tec'],
  tag: {
    name: '',
    color: 'indigo',
  },
  pictures: [],
}

const formValue = ref<BlogToPost>(deepClone(defaultFormValue))

const handleReUploadFinish = ({
  event,
}: {
  file: UploadFileInfo
  event?: ProgressEvent
}) => {
  message.success(JSON.parse((event?.target as XMLHttpRequest).response).msg)
}

const showModal = computed({
  get: () => {
    if (!props.modelValue) {
      Object.assign(formValue.value, defaultFormValue)
    } else {
      Object.assign(formValue.value, omit(props.data, ['author']))
    }
    return props.modelValue
  },
  set: (value) => emit('update:modelValue', value),
})

const handleClose = () => {
  showModal.value = false
  Object.assign(formValue.value, defaultFormValue)
}

const handleSubmitEdit = async () => {
  const newBlogInfo = toRaw(formValue.value)
  try {
    const result = await editBlogInfo(newBlogInfo)
    message.success(result)
    emit('update')
    handleClose()
  } catch (e) {
    console.log(e)
    message.error('更新失败')
  }
}
</script>

<style>
.box-block {
  display: block !important;
}
</style>
