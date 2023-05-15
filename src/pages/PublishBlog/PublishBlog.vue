<template>
  <div class="p-4">
    <n-card title="发布文章">
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
        <n-form-item label="博客封面">
          <FileUploader
            type="image"
            ref="imageUploaderRef"
            list-type="image-card"
            @file-update="handleImageUploadUpdate"
            @file-error="handleImageUploadError"
            @file-remove="handleImageRemove"
          >
            <n-icon size="48" :depth="3">
              <AddOutlineIcon />
            </n-icon>
          </FileUploader>
        </n-form-item>
        <n-form-item label="上传文章（md 文件）">
          <FileUploader
            ref="markdownUploaderRef"
            style="width: 400px"
            @file-update="handleMardownUploadUpdate"
            @file-error="handleMarkdownUploadError"
            @file-remove="handleMarkdownRemove"
          >
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="48" :depth="3">
                  <CloudUploadIcon />
                </n-icon>
              </div>
              <n-text style="font-size: 16px">
                点击或者拖动文件到该区域来上传
              </n-text>
              <n-p depth="3" style="margin: 8px 0 0 0">
                请不要上传个人敏感信息。
              </n-p>
            </n-upload-dragger>
          </FileUploader>
        </n-form-item>
      </n-form>
      <n-button @click="handleSubmit">
        <n-icon>
          <PaperPlaneIcon />
        </n-icon>
        &nbsp; 冲！发布！
      </n-button>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NUploadDragger,
  NText,
  NP,
  NIcon,
  NButton,
  useMessage,
} from 'naive-ui'
import type { FormInst } from 'naive-ui'
import {
  CloudUploadOutline as CloudUploadIcon,
  PaperPlaneOutline as PaperPlaneIcon,
  AddOutline as AddOutlineIcon,
} from '@vicons/ionicons5'
import FileUploader from '@/components/FileUploader.vue'
import { typeOptions, tagColorOptions } from './options'
import { publishBlog } from '@/api'
import { BlogToPost, BlogType } from '@/types'
import { useUserStore } from '@/store/user'
import { FileInfo } from 'naive-ui/es/upload/src/interface'

const userStore = useUserStore()

const message = useMessage()

const formRef = ref<FormInst>()

const formValue = ref<BlogToPost>({
  id: '',
  title: '',
  author: userStore.userInfo?.id || '',
  type: BlogType.staple,
  tag: {
    name: '',
    color: 'indigo',
  },
  pictures: [],
})

watchEffect(() => {
  formValue.value.author = userStore.userInfo?.id || ''
})

const imageUploaderRef = ref<InstanceType<typeof FileUploader>>()
const markdownUploaderRef = ref<InstanceType<typeof FileUploader>>()

const handleImageUploadUpdate = ({
  records,
  file,
}: {
  records: string[]
  file: Required<FileInfo>
}) => {
  formValue.value.pictures = records
  message.success(`图片 [${file.name}] 上传成功`)
}

const handleImageUploadError = ({
  error,
  file,
}: {
  error: unknown
  file: Required<FileInfo>
}) => {
  console.log(error)
  message.error(`图片 [${file.name}] 上传失败`)
}

const handleImageRemove = (records: string[]) =>
  (formValue.value.pictures = records)

const handleMardownUploadUpdate = ({
  records,
  file,
}: {
  records: string[]
  file: Required<FileInfo>
}) => {
  formValue.value.id = records[0]
  message.success(`文件 [${file.name}] 上传成功`)
}

const handleMarkdownUploadError = ({
  error,
  file,
}: {
  error: unknown
  file: Required<FileInfo>
}) => {
  console.log(error)
  message.error(`文件 [${file.name}] 上传失败`)
}

const handleMarkdownRemove = () => (formValue.value.id = '')

const handleSubmit = async () => {
  // TODO: 提交blog
  try {
    const request = await publishBlog(formValue.value)
    console.log(request)
    message.success('发布成功')
    Object.assign(formValue.value, {
      id: '',
      title: '',
      author: userStore.userInfo?.id || '',
      type: BlogType.staple,
      tag: {
        name: '',
        color: 'indigo',
      },
      pictures: [],
    })
    imageUploaderRef.value?.clear()
    markdownUploaderRef.value?.clear()
  } catch (e) {
    console.warn(e)
    message.error((e as any).response?.data || '发布失败')
  }
}
</script>
