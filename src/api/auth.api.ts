import { request } from '@/request'

interface Tokens {
  accessToken: string
  refreshToken: string
}

interface UserInfo {
  id: string
  userName: string
  role: 1 | 2
  avatar: string
}

interface LoginResponce {
  isSuccess: boolean
  msg: string
  token: Tokens
  userInfo: UserInfo
}

export default function login(username: string, password: string) {
  return request<LoginResponce>({
    method: 'POST',
    url: '/auth/login',
    data: {
      username,
      password,
    },
  })
}
