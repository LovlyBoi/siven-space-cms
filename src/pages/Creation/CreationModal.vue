<template>
  <n-modal v-model:show="showModal">
    <n-card
      style="width: 600px"
      title="最后一步"
      :bordered="false"
      size="huge"
      role="dialog"
      closable
      @close="handleClose"
      aria-modal="true"
    >
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
          <n-button
            tertiary
            type="primary"
            @click="handleSubmit"
            :disabled="submiting"
          >
            发布！
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, toRaw } from 'vue'
import {
  NModal,
  NCard,
  NButton,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  useMessage,
} from 'naive-ui'
import { BlogToPost, BlogType } from '@/types'
import { typeOptions, tagColorOptions } from '../PublishBlog/options'
import { editBlogInfo } from '@/api'

const emit = defineEmits(['update:modelValue', 'update'])

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
})

const message = useMessage()

const submiting = ref(false)

const formValue = ref<BlogToPost>({
  id: '',
  title: '',
  author: '',
  type: BlogType.staple,
  tag: {
    name: '',
    color: 'indigo',
  },
  pictures: [],
})

const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const handleClose = () => (showModal.value = false)

const handleSubmit = async () => {
  submiting.value = true
  const newBlogInfo = toRaw(formValue.value)
  console.log(newBlogInfo)
  try {
    const result = await editBlogInfo(newBlogInfo)
    message.success(result)
    emit('update')
    handleClose()
  } catch (e) {
    console.log(e)
    message.error('更新失败')
  } finally {
    submiting.value = false
  }
}
</script>

<style>
.box-block {
  display: block !important;
}
</style>
