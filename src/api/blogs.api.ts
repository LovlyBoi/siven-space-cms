import { request } from '@/request'
import type { Card, Blog, BlogToPost } from '@/types'

function getAllBlogs() {
  return request<Card[]>({
    method: 'GET',
    url: '/blogs?from=cms',
    params: {
      from: 'cms',
    },
  })
}

function getNotes() {
  return request<Card[]>({
    method: 'GET',
    url: '/blogs?from=cms',
    params: {
      type: 'note',
      from: 'cms',
    },
  })
}

function getEssays() {
  return request<Card[]>({
    method: 'GET',
    url: '/blogs?from=cms',
    params: {
      type: 'essay',
      from: 'cms',
    },
  })
}

function getBlogById<T = Blog>(id: string, type = '') {
  const params: Record<string, string> = {
    from: 'cms',
  }
  type ? (params.type = type) : null
  return request<T>({
    method: 'GET',
    url: `/blogs/${id}`,
    params,
  })
}

function publishBlog(blog: BlogToPost) {
  return request({
    method: 'POST',
    url: '/blogs/publish?from=cms',
    data: blog,
    params: {
      from: 'cms',
    },
  })
}

function deleteBlog(id: string) {
  return request({
    method: 'DELETE',
    url: `/blogs/${id}`,
    params: {
      from: 'cms',
    },
  })
}

function editBlog(id: string, content: string) {
  return request<string>({
    method: 'POST',
    url: `/blogs/edit/${id}`,
    params: {
      from: 'cms',
    },
    data: {
      content,
    },
  })
}

export {
  getAllBlogs,
  getNotes,
  getEssays,
  getBlogById,
  publishBlog,
  deleteBlog,
  editBlog,
}
