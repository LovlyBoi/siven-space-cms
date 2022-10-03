<template>
  <div class="p-4">
    <n-card title="发布博客">
      <n-form ref="formRef" :label-width="80" :model="formValue">
        <n-form-item label="作者">
          <n-input
            placeholder="author"
            :maxlength="15"
            v-model:value="formValue.author"
            @blur="formValue.author = formValue.author.trim()"
            clearable
            show-count
            style="width: 300px"
          />
        </n-form-item>
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
          <n-upload
            ref="imageUploaderRef"
            v-model:file-list="imageFileList"
            list-type="image-card"
            :custom-request="handleImageRequest"
            @remove="handleImageRemove"
            accept="image/*"
          >
            点击上传
          </n-upload>
        </n-form-item>
        <n-form-item label="上传文章（md 文件）">
          <n-upload
            ref="markdownUploaderRef"
            v-model:file-list="markdownFileList"
            style="width: 400px"
            :default-file-list="[]"
            :max="1"
            accept=".md"
            directory-dnd
            :custom-request="handleMarkdownRequest"
            @remove="handleMarkdownRemove"
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
                请不要上传个人敏感信息，比如家里有几套房，存款几位数，以防作者抱大腿
                ^_^
              </n-p>
            </n-upload-dragger>
          </n-upload>
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
import { ref } from 'vue'
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NUpload,
  NUploadDragger,
  NText,
  NP,
  NIcon,
  NButton,
  useMessage,
  UploadFileInfo,
} from 'naive-ui'
import type { FormInst, UploadCustomRequestOptions } from 'naive-ui'
import {
  CloudUploadOutline as CloudUploadIcon,
  PaperPlaneOutline as PaperPlaneIcon,
} from '@vicons/ionicons5'
import { typeOptions, tagColorOptions } from './options'
import {
  uploadMarkdown,
  uploadImage,
  publishBlog,
  deleteMarkdown,
  deleteImage,
} from '@/api'
import { BlogToPost, BlogType } from '@/types'

const message = useMessage()

const formRef = ref<FormInst>()

const imageFileList = ref<UploadFileInfo[]>([])
const imageUploaderRef = ref<InstanceType<typeof NUpload>>()

const markdownFileList = ref<UploadFileInfo[]>([])
const markdownUploaderRef = ref<InstanceType<typeof NUpload>>()

const formValue = ref<BlogToPost>({
  id: '',
  title: '',
  author: '',
  type: BlogType.note,
  tag: {
    name: '',
    color: 'indigo',
  },
  pictures: [],
})

interface FileRecord {
  fileId: string
  value: string
}

// 记录原始文件id和服务器id，方便删除文件
let imageRecords: FileRecord[] = []

const fileLoader = ({ file, data }: UploadCustomRequestOptions) => {
  const formData = new FormData()
  if (data) {
    Object.keys(data).forEach((key) => {
      formData.append(
        'file',
        data[key as keyof UploadCustomRequestOptions['data']]
      )
    })
  }
  formData.append('file', file.file as File)
  return formData
}

const handleImageRequest = async (options: UploadCustomRequestOptions) => {
  const { file, headers, onError, onFinish } = options
  const formData = fileLoader(options)
  try {
    const { url } = await uploadImage(
      formData,
      headers as Record<string, string>
    )
    // 新增图片，更新记录
    imageRecords.push({ fileId: file.id, value: url[0] })
    // 更新表单
    formValue.value.pictures = imageRecords.map((item) => item.value)
    message.success(`图片 [${file.name}] 上传成功`)
    onFinish()
  } catch (e) {
    console.log(e)
    message.error(`图片 [${file.name}] 上传失败`)
    onError()
  }
}

const handleMarkdownRequest = async (options: UploadCustomRequestOptions) => {
  const { file, headers, onError, onFinish } = options
  const formData = fileLoader(options)
  try {
    const { id } = await uploadMarkdown(
      formData,
      headers as Record<string, string>
    )
    formValue.value.id = id[0]
    message.success(`文件 [${file.name}] 上传成功`)
    onFinish()
  } catch (e) {
    console.log(e)
    message.error(`文件 [${file.name}] 上传失败`)
    onError()
  }
}

const handleImageRemove = ({
  file,
}: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) => {
  let removedUrl: string | null = null
  // 更新记录
  imageRecords = imageRecords.filter((item) => {
    if (item.fileId === file.id) {
      removedUrl = item.value
    }
    return item.fileId !== file.id
  })
  if (removedUrl == null) return
  // 更新表单项
  formValue.value.pictures = imageRecords.map((item) => item.value)
  console.log('删除图片', removedUrl)
  deleteImage(removedUrl)
}

const handleMarkdownRemove = () => {
  console.log('删除文件', formValue.value.id)
  deleteMarkdown(formValue.value.id)
  formValue.value.id = ''
}

const handleSubmit = async () => {
  // TODO: 提交blog
  try {
    const request = await publishBlog(formValue.value)
    console.log(request)
    message.success('发布成功')
    Object.assign(formValue.value, {
      id: '',
      title: '',
      author: '',
      type: BlogType.note,
      tag: {
        name: '',
        color: 'indigo',
      },
      pictures: [],
    })
    imageFileList.value = []
    markdownFileList.value = []
    imageUploaderRef.value?.clear()
    markdownUploaderRef.value?.clear()
    imageRecords = []
  } catch (e) {
    console.warn(e)
    message.error((e as any).response?.data || '发布失败')
  }
}
</script>
