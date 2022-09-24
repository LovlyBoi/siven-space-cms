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

function getBlogById(id: string) {
  return request<Blog>({
    method: 'GET',
    url: `/blogs/${id}`,
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

export {
  getAllBlogs,
  getNotes,
  getEssays,
  getBlogById,
  publishBlog,
  deleteBlog,
}
