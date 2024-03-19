import { request } from '@/request'
import type { Card, CardWithAudit, Blog, BlogToPost, TopNBlog } from '@/types'

export function getAllBlogs() {
  return request<{ cards: Card[]; hasNext: boolean }>({
    method: 'GET',
    url: '/blogs',
  })
}

// export function getBlogsByAuthor() {
//   return request<{ cards: CardWithAudit[]; hasNext: boolean }>({
//     method: 'GET',
//     url: '/blogs/blogsByAuthor',
//   })
// }

export function getBlogsByAuthor(authorId: string) {
  return request<{ cards: CardWithAudit[]; hasNext: boolean }>({
    method: 'GET',
    url: '/blogs',
    params: {
      from: 'cms',
      type: 'all',
      author: authorId,
    },
  })
}

export function getBlogsToBeAudit(authorId: string) {
  return request<{ cards: CardWithAudit[]; hasNext: boolean }>({
    method: 'GET',
    url: '/blogs/audit',
    params: {
      from: 'cms',
      type: 'all',
      author: authorId,
    },
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

export function getBlogById<T = Blog>(id: string) {
  return request<T>({
    method: 'GET',
    url: `/blogs/markdown/${id}`,
  })
}

export function publishBlog(blog: BlogToPost) {
  return request<string>({
    method: 'PUT',
    url: '/blogs',
    data: {
      ...blog,
      tagName: blog.tag.name,
      tagColor: blog.tag.color,
    },
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
  state: boolean,
  msg: string | undefined = void 0
) {
  return request({
    method: 'PATCH',
    url: `/blogs/audit/${blogId}`,
    data: {
      state,
      msg,
    },
  })
}
