import { request } from '@/request'
import { Tokens, UserInfo } from '@/types'

interface LoginResponce {
  token: Tokens
  userInfo: UserInfo
}

export function login(username: string, password: string) {
  return request<LoginResponce>({
    method: 'POST',
    url: '/user/login',
    data: {
      username,
      password,
    },
  })
}

export function register(username: string, password: string) {
  return request<LoginResponce>({
    method: 'PUT',
    url: '/user',
    data: {
      username,
      password,
    },
  })
}

export function refreshToken(refreshToken: string) {
  return request<Tokens>({
    method: 'POST',
    url: '/user/refresh',
    data: {
      refreshToken,
    },
  })
}

export function getUserInfoByToken() {
  return request<UserInfo>({
    method: 'POST',
    url: '/user',
  })
}

export function searchUser(idOrName: string) {
  return request<UserInfo[]>({
    method: 'GET',
    url: '/user/searchUsers',
    params: {
      userIdOrName: idOrName,
    },
  })
}

export function updateUserRole(
  userId: string,
  oldRole: 1 | 2 | 3,
  newRole: 1 | 2 | 3
) {
  return request({
    method: 'POST',
    url: '/user/updateUserRole',
    data: {
      userId,
      oldRole,
      newRole,
    },
  })
}
