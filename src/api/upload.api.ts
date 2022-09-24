import { request } from '@/request'

function uploadMarkdown(data: FormData, headers?: Record<string, string>) {
  return request<{ id: string[]; msg: string }>({
    url: '/upload/markdown',
    method: 'POST',
    data,
    headers,
  })
}

export { uploadMarkdown }
