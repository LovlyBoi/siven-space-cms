<template>
  <div class="p-4">
    <n-card title="发布博客">
      <n-form ref="formRef" :label-width="80" :model="formValue">
        <n-form-item label="作者">
          <n-input
            placeholder="author"
            :maxlength="15"
            v-model:value="formValue.author"
            :allow-input="(value: string) => !value.startsWith(' ') && !value.endsWith(' ')"
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
            type="textarea"
            :allow-input="(value: string) => !value.startsWith(' ') && !value.endsWith(' ')"
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
            :allow-input="(value: string) => !value.startsWith(' ') && !value.endsWith(' ')"
            clearable
            show-count
            style="width: 300px"
          />
        </n-form-item>
        <n-form-item label="上传文章（md 文件）">
          <n-upload
            style="width: 400px"
            :default-file-list="[]"
            :max="1"
            accept=".md"
            directory-dnd
            :custom-request="customRequest"
            @remove="handleUploadRemove"
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
      <n-button>
        <n-icon>
          <PaperPlaneIcon />
        </n-icon>
        &nbsp; 冲！发布！
      </n-button>
      <pre>{{ JSON.stringify(formValue, null, 2) }}</pre>
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
} from 'naive-ui'
import type { FormInst, UploadCustomRequestOptions } from 'naive-ui'
import {
  CloudUploadOutline as CloudUploadIcon,
  PaperPlaneOutline as PaperPlaneIcon,
} from '@vicons/ionicons5'
import { typeOptions, tagColorOptions } from './options'
import { uploadMarkdown } from '@/api'

const message = useMessage()

const formRef = ref<FormInst>()

const formValue = ref({
  id: '',
  author: '',
  title: '',
  type: 1,
  tag: {
    name: '',
    color: 'indigo',
  },
  pictures: [],
})

const customRequest = async ({
  file,
  data,
  headers,
  onError,
  onFinish,
}: UploadCustomRequestOptions) => {
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

const handleUploadRemove = () => {
  // TODO: 还应该告知服务器删除文件
  console.log('删除文件', formValue.value.id)
  formValue.value.id = ''
}
</script>

<style scoped></style>
