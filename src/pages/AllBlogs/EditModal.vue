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
        <n-form-item label="文章">
          这是一篇已经发布的文章，您可以选择
          <router-link
            class="mx-1 text-green-700 underline hover:text-green-600"
            @click="handleClose"
            :to="`/blogs/edit-blog/${formValue.id}`"
          >
            在线修改
          </router-link>
          或
          <span
            class="mx-1 text-green-700 underline cursor-pointer hover:text-green-600"
          >
            重新上传
          </span>
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
            当我没点开过
          </n-button>
          <n-button tertiary type="primary">修改！</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, PropType } from 'vue'
import {
  NModal,
  NCard,
  NButton,
  NForm,
  NFormItem,
  NInput,
  NSelect,
} from 'naive-ui'
import { BlogType, Card } from '@/types'
import { typeOptions, tagColorOptions } from '../PublishBlog/options'

const deepClone = <T extends object>(obj: T): T =>
  JSON.parse(JSON.stringify(obj))

const defaultFormValue = {
  id: '',
  title: '',
  author: '',
  type: BlogType.note,
  tag: {
    name: '',
    color: 'indigo',
  },
  pictures: [],
}

const formValue = ref(deepClone(defaultFormValue))

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
  data: {
    type: [Object, null] as PropType<Card | null>,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const showModal = computed({
  get: () => {
    if (!props.modelValue) {
      Object.assign(formValue.value, defaultFormValue)
    } else {
      Object.assign(formValue.value, props.data)
    }
    return props.modelValue
  },
  set: (value) => emit('update:modelValue', value),
})

const handleClose = () => {
  showModal.value = false
  Object.assign(formValue.value, defaultFormValue)
}
</script>