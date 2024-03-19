<template>
  <mavon-editor
    ref="editorRef"
    style="z-index: 0"
    @imgAdd="handleImgAdd"
    :tabSize="2"
    :editable="editable"
  ></mavon-editor>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { uploadImage } from '@/api'

defineProps({
  editable: {
    type: Boolean,
    default: true,
  },
})

const editorRef = ref<any>(null)

async function handleImgAdd(filename: string, imgFile: File) {
  const data = new FormData()
  data.append('file', imgFile)
  const { filename: url } = await uploadImage(data)
  editorRef.value?.$img2Url(filename, url[0])
}
</script>
