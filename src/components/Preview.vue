<template>
  <NCard class="max-w-[1000px]" closable @close="() => $emit('close')">
    <div class="flex justify-between p-3">
      <h3 class="text-lg font-medium">预览</h3>
    </div>
    <Editor
      class="mx-3 mb-3"
      v-model="BlogMarkdown"
      :editable="false"
      :subfield="false"
      :toolbarsFlag="false"
      defaultOpen="preview"
    />
  </NCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Editor from '@/components/Editor.vue'
import { NCard } from 'naive-ui'
import { getBlogById } from '@/api'

defineEmits(['close'])

const props = defineProps({
  blogId: {
    type: String,
    required: true,
  },
})

const BlogMarkdown = ref('')

getBlogById<string>(props.blogId, 'markdown')
  .then((markdown) => {
    BlogMarkdown.value = markdown + ''
  })
  .catch((e) => {
    console.log(e)
  })
</script>
