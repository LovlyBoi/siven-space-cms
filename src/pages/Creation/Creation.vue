<template>
  <div class="p-4">
    <div class="flex justify-between p-3">
      <h3 class="text-lg font-medium">在线创作</h3>
      <NButton
        quaternary
        type="primary"
        size="small"
        @click="handleSubmit"
        :disabled="submiting"
        >发布</NButton
      >
    </div>
    <div class="max-w-lg p-3 text-gray-500">
      我们推荐使用 MarkDown 语法创作。MarkDown
      语法是一种轻量级标记语言，排版语法简洁，让人们更多地关注内容本身而非排版。
      具体语法规则可以参考：
      <a
        href="https://markdown.com.cn/basic-syntax/"
        class="underline hover:text-gray-600"
        >MarkDown 语法</a
      >。
    </div>
    <Editor
      class="mx-3 mb-3"
      :tabSize="2"
      placeholder="开始你的创作..."
      v-model="userCreation"
    />
    <creation-modal v-model="showModal"></creation-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Editor from '@/components/Editor.vue'
import { NButton, useMessage } from 'naive-ui'
import CreationModal from './CreationModal.vue'

const userCreation = ref('')

const showModal = ref(false)

const submiting = ref(false)

const handleSubmit = () => {
  showModal.value = true
  console.log('发布', userCreation.value)
}
</script>
