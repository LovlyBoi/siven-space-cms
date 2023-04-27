import { request } from '@/request'
import { Tokens, UserInfo } from '@/types'

interface LoginResponce {
  isSuccess: boolean
  msg: string
  token: Tokens
  userInfo: UserInfo
}

interface UserInfoResponce {
  isSuccess: boolean
  userInfo?: UserInfo
  type?: string
  msg?: string
}

interface TokenResponce {
  isSuccess: boolean
  token?: Tokens
  type?: string
  msg?: string
}

export function login(username: string, password: string) {
  return request<LoginResponce>({
    method: 'POST',
    url: '/auth/login',
    data: {
      username,
      password,
    },
  })
}

export function register(username: string, password: string) {
  return request<LoginResponce>({
    method: 'POST',
    url: '/auth/register',
    data: {
      username,
      password,
    },
  })
}

export function refreshToken(refreshToken: string) {
  return request<TokenResponce>({
    method: 'POST',
    url: '/auth/refreshToken',
    data: {
      refreshToken,
    },
  })
}

export function getUserInfoByToken(token: string) {
  return request<UserInfoResponce>({
    method: 'POST',
    url: '/auth/getUserInfo',
    data: {
      token,
    },
  })
}
