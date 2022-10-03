<template>
  <div>
    <div class="flex justify-between p-3">
      <h3 class="text-lg font-medium">编辑博客</h3>
      <NButton
        quaternary
        type="primary"
        size="small"
        @click="handleSubmit"
        :disabled="submiting"
        >提交</NButton
      >
    </div>
    <Editor class="mx-3 mb-3" v-model="BlogMarkdown" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Editor from '@/components/Editor.vue'
import { NButton, useMessage } from 'naive-ui'
import { getBlogById, editBlog } from '@/api'

const message = useMessage()

const BlogMarkdown = ref('')

const submiting = ref(false)

const route = useRoute()
const blogId = route.params.id as string

getBlogById<string>(blogId, 'markdown')
  .then((markdown) => {
    BlogMarkdown.value = markdown
  })
  .catch((e) => {
    console.log(e)
  })

const handleSubmit = async () => {
  submiting.value = true
  try {
    await editBlog(blogId, BlogMarkdown.value)
    message.success('修改成功')
  } catch (e) {
    message.error('修改失败')
    console.log(e)
  } finally {
    submiting.value = false
  }
}
</script>
