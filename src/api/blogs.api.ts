import { request } from '@/request'
import type { Card, Blog, BlogToPost } from '@/types'

export function getAllBlogs() {
  return request<Card[]>({
    method: 'GET',
    url: '/blogs',
  })
}

export function getNotes() {
  return request<Card[]>({
    method: 'GET',
    url: '/blogs',
    params: {
      type: 'note',
    },
  })
}

export function getEssays() {
  return request<Card[]>({
    method: 'GET',
    url: '/blogs',
    params: {
      type: 'essay',
    },
  })
}

export function getBlogById<T = Blog>(id: string, type = '') {
  const params: Record<string, string> = {}
  type ? (params.type = type) : null
  return request<T>({
    method: 'GET',
    url: `/blogs/${id}`,
    params,
  })
}

export function publishBlog(blog: BlogToPost) {
  return request({
    method: 'POST',
    url: '/blogs/publish',
    data: blog,
  })
}

export function deleteBlog(id: string) {
  return request({
    method: 'DELETE',
    url: `/blogs/${id}`,
  })
}

export function editBlogMarkdown(id: string, content: string) {
  return request<string>({
    method: 'POST',
    url: `/blogs/edit/markdown/${id}`,
    data: {
      content,
    },
  })
}

export function editBlogInfo(newBlogInfo: BlogToPost) {
  return request<string>({
    method: 'POST',
    url: '/blogs/edit/blog',
    data: newBlogInfo,
  })
}
