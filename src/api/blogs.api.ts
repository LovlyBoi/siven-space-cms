import { request } from '@/request'
import type { Card, Blog, BlogToPost } from '@/types'

function getAllBlogs() {
  return request<Card[]>({
    method: 'GET',
    url: '/blogs',
  })
}

function getNotes() {
  return request<Card[]>({
    method: 'GET',
    url: '/blogs',
    params: {
      type: 'note',
    },
  })
}

function getEssays() {
  return request<Card[]>({
    method: 'GET',
    url: '/blogs',
    params: {
      type: 'essay',
    },
  })
}

function getBlogById<T = Blog>(id: string, type = '') {
  const params: Record<string, string> = {}
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
    url: '/blogs/publish',
    data: blog,
  })
}

function deleteBlog(id: string) {
  return request({
    method: 'DELETE',
    url: `/blogs/${id}`,
  })
}

function editBlogMarkdown(id: string, content: string) {
  return request<string>({
    method: 'POST',
    url: `/blogs/edit/markdown/${id}`,
    data: {
      content,
    },
  })
}

function editBlogInfo(newBlogInfo: BlogToPost) {
  return request<string>({
    method: 'POST',
    url: '/blogs/edit/blog',
    data: newBlogInfo,
  })
}

export {
  getAllBlogs,
  getNotes,
  getEssays,
  getBlogById,
  publishBlog,
  deleteBlog,
  editBlogMarkdown,
  editBlogInfo,
}
