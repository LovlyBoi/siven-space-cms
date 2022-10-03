import { request } from '@/request'

function uploadMarkdown(data: FormData, headers?: Record<string, string>) {
  return request<{ id: string[]; msg: string }>({
    url: '/upload/markdown',
    method: 'POST',
    data,
    headers,
    params: {
      from: 'cms',
    },
  })
}

function uploadImage(data: FormData, headers?: Record<string, string>) {
  return request<{ url: string[]; msg: string }>({
    url: '/upload/image',
    method: 'POST',
    data,
    headers,
  })
}

function deleteImage(url: string) {
  const filename = url.trim().split('/').slice(-1)[0]
  return request({
    method: 'DELETE',
    url: `/upload/image/${filename}`,
  })
}

function deleteMarkdown(id: string) {
  return request({
    method: 'DELETE',
    url: `/upload/markdown/${id}`,
  })
}

export { uploadMarkdown, uploadImage, deleteImage, deleteMarkdown }
