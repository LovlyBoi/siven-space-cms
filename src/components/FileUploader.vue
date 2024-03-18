<script lang="ts">
import { defineComponent, h, mergeProps, PropType, ref } from 'vue'
import { NUpload } from 'naive-ui'
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'
import { uploadMarkdown, deleteMarkdown, uploadImage, deleteImage } from '@/api'

export default defineComponent({
  emits: ['file-error', 'file-remove', 'file-update'],
  props: {
    type: {
      type: String as PropType<'markdown' | 'image'>,
      default: 'markdown',
    },
  },
  setup(props, { emit }) {
    interface FileRecord {
      fileId: string
      value: string
    }

    // 记录原始文件id和服务器id，方便删除文件
    let fileRecords: FileRecord[] = []

    const fileUploaderRef = ref<InstanceType<typeof NUpload>>()

    const fileLoader = (
      { file, data }: UploadCustomRequestOptions,
      name = 'file'
    ) => {
      const formData = new FormData()
      if (data) {
        Object.keys(data).forEach((key) => {
          formData.append(
            name,
            data[key as keyof UploadCustomRequestOptions['data']]
          )
        })
      }
      formData.append(name, file.file as File)
      return formData
    }

    async function uploadItem(
      data: FormData,
      headers?: Record<string, string>
    ) {
      let record: string[] = []
      if (props.type === 'markdown') {
        const { id } = await uploadMarkdown(
          data,
          headers as Record<string, string>
        )
        record = [id]
      } else if (props.type === 'image') {
        const { filename } = await uploadImage(
          data,
          headers as Record<string, string>
        )
        record = [filename]
      }
      return record
    }

    function removeItem(record: string) {
      if (props.type === 'markdown') {
        deleteMarkdown(record)
      } else if (props.type === 'image') {
        deleteImage(record)
      }
    }

    const handleFileUploadRequest = async (
      options: UploadCustomRequestOptions
    ) => {
      const { file, headers, onError, onFinish } = options
      const formData = fileLoader(
        options,
        props.type === 'image' ? 'img' : 'file'
      )
      try {
        const nextPart = await uploadItem(
          formData,
          headers as Record<string, string>
        )
        // 新增文件，更新记录
        fileRecords.push({ fileId: file.id, value: nextPart[0] })
        const records = fileRecords.map((item) => item.value)
        emit('file-update', { records, file })
        onFinish()
      } catch (e) {
        console.log(e)
        emit('file-error', { error: e, file })
        onError()
      }
    }

    const handleFileRemove = ({
      file,
    }: {
      file: UploadFileInfo
      fileList: UploadFileInfo[]
    }) => {
      let removedRecord: string | null = null
      // 更新记录
      fileRecords = fileRecords.filter((item) => {
        if (item.fileId === file.id) {
          removedRecord = item.value
        }
        return item.fileId !== file.id
      })
      if (removedRecord == null) return
      console.log('删除文件', removedRecord)
      removeItem(removedRecord)
      // 更新表单项
      const records = fileRecords.map((item) => item.value)
      emit('file-remove', records)
    }

    const clear = () => {
      fileUploaderRef.value?.clear()
      fileRecords.length = 0
    }

    return {
      fileRecords,
      clear,
      fileUploaderRef,
      handleFileUploadRequest,
      handleFileRemove,
    }
  },
  render() {
    const {
      $attrs,
      $slots,
      $props,
      handleFileUploadRequest,
      handleFileRemove,
    } = this

    const staticProps = {
      defaultFileList: [],
      ref: 'fileUploaderRef',
      max: $props.type === 'markdown' ? 1 : 4,
      accept: $props.type === 'markdown' ? '.md' : 'image/*',
      customRequest: handleFileUploadRequest,
      onRemove: handleFileRemove,
    }

    return h(NUpload, mergeProps({ ...$attrs }, staticProps), { ...$slots })
  },
})
</script>
