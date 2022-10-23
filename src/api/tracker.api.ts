import { request } from '@/request'
import { PvRecords } from '@/types'

export function getPv(start: string, end?: string) {
  return request<PvRecords[]>({
    url: '/tracker/getPv',
    method: 'GET',
    params: {
      start,
      end,
    },
  })
}
