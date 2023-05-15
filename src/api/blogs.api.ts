import { request } from '@/request'
import type { Card, CardWithAudit, Blog, BlogToPost, TopNBlog } from '@/types'

export function getAllBlogs() {
  return request<{ cards: Card[]; hasNext: boolean }>({
    method: 'GET',
    url: '/blogs',
  })
}

export function getBlogsByAuthor() {
  return request<{ cards: CardWithAudit[]; hasNext: boolean }>({
    method: 'GET',
    url: '/blogs/blogsByAuthor',
  })
}

export function getBlogsToBeAudit() {
  return request<{ cards: CardWithAudit[]; hasNext: boolean }>({
    method: 'GET',
    url: '/blogs/blogsToBeAudit',
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
    method: 'POST',
    url: `/blogs/article/${id}`,
    params,
  })
}

export function publishBlog(blog: BlogToPost) {
  return request<string>({
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

export function getTopNBlogs(n: number) {
  return request<TopNBlog[]>({
    method: 'GET',
    url: '/blogs/top/readingVolume',
    params: {
      n,
    },
  })
}

export function auditBlog(
  blogId: string,
  state: 0 | 2,
  msg: string | undefined = void 0
) {
  return request({
    method: 'POST',
    url: `/blogs/audit/${blogId}`,
    data: {
      state,
      msg,
    },
  })
}
