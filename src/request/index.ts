import axios, { AxiosRequestConfig } from 'axios'
import { getChache, setCache } from '@/utils/useCache'
import type { Tokens } from '@/types'
import { refreshToken } from '@/api'
import { useUserStore } from '@/store/user'

const instance = axios.create({
  timeout: 20000,
  baseURL: import.meta.env.VITE_AXIOS_BASEURL,
  params: {
    from: 'cms',
  },
})

instance.interceptors.request.use((config) => {
  const token = getChache<Tokens>('user_token')
  if (token?.accessToken) {
    config.headers = Object.assign(config.headers || {}, {
      Authorization: token.accessToken,
    })
  }
  return config
})

instance.interceptors.response.use(
  (value) => value,
  (error) => {
    // token过期自动续签
    const { config } = error
    const { status, data } = error.response
    if (status === 401 && data === 'jwt expired') {
      console.log('token 过期')
      const token = getChache<Tokens>('user_token')
      if (token?.refreshToken) {
        return refreshToken(token?.refreshToken)
          .then(({ isSuccess, token }) => {
            if (!isSuccess) {
              return Promise.reject('refresh_token 过期')
            }
            console.log('token 续签成功')
            setCache('user_token', token)
            console.log('开始重新请求')
            return instance(config)
          })
          .catch((err) => {
            const userStore = useUserStore()
            userStore.logout()
            window.$message.error('登录过期，请重新登陆')
            console.log(err, 'token 续签失败')
          })
      } else {
        return Promise.reject(error)
      }
    }
  }
)

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  const { data } = await instance.request<T>(config)
  return data
}

export { request }
