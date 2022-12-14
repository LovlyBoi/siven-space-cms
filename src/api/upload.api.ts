import { request } from '@/request'

export function uploadMarkdown(
  data: FormData,
  headers?: Record<string, string>
) {
  return request<{ id: string[]; msg: string }>({
    url: '/upload/markdown',
    method: 'POST',
    data,
    headers,
  })
}

export function uploadImage(data: FormData, headers?: Record<string, string>) {
  return request<{ url: string[]; msg: string }>({
    url: '/upload/image',
    method: 'POST',
    data,
    headers,
  })
}

export function deleteImage(url: string) {
  const filename = url.trim().split('/').slice(-1)[0]
  return request({
    method: 'DELETE',
    url: `/upload/image/${filename}`,
  })
}

export function deleteMarkdown(id: string) {
  return request({
    method: 'DELETE',
    url: `/upload/markdown/${id}`,
  })
}
