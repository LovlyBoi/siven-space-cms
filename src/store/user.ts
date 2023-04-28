import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'
import { useRouter } from 'vue-router'
import { getChache, setCache } from '@/utils/useCache'
import {
  login as loginApi,
  register as registerApi,
  getUserInfoByToken,
  refreshToken,
} from '@/api'

import type { Tokens, UserInfo } from '@/types'

export const useUserStore = defineStore('userStore', {
  state() {
    const isLogin = ref(false)
    const isRestoring = ref(true)
    const userInfo = ref<UserInfo>()

    const router = useRouter()

    function initLoginState() {
      return new Promise<Tokens>((resolve, reject) => {
        const token = getChache<Tokens>('user_token')
        if (token) {
          // ToDo: 发送到服务器去验证refresh_token
          refreshToken(token.refreshToken)
            .then(({ isSuccess, token: tokens, msg }) => {
              if (isSuccess) {
                resolve(tokens!)
              } else {
                reject(msg)
              }
            })
            .catch((err) => {
              reject(err)
            })
        } else {
          setLoginState(false)
          reject('本地没有缓存token')
        }
      })
    }

    function initUserInfo(tokens: Tokens) {
      return new Promise<UserInfo>((resolve, reject) => {
        const info = getChache<UserInfo>('user_info')
        if (info && info.id) {
          resolve(info)
        } else {
          // ToDo: 向服务器请求用户数据
          getUserInfoByToken(tokens.refreshToken)
            .then(({ isSuccess, userInfo: info, msg }) => {
              if (isSuccess) {
                resolve(info!)
              } else {
                reject(msg)
              }
            })
            .catch((err) => {
              reject(err)
            })
        }
      })
    }

    function restoreLoginState() {
      isRestoring.value = true
      return new Promise<void>((resolve, reject) => {
        let t: Tokens
        initLoginState()
          .then((tokens) => {
            console.log('token 恢复成功')
            t = tokens
            return initUserInfo(tokens)
          })
          .then((info) => {
            console.log('用户信息 恢复成功')
            setLoginState(true)
            setUserInfo(info)
            setCache('user_token', t)
            setCache('user_info', info)
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
          .finally(() => {
            isRestoring.value = false
          })
      })
    }

    function setLoginState(state: boolean) {
      isLogin.value = state
    }

    function setUserInfo(info: UserInfo) {
      userInfo.value = info
    }

    function login(username: string, password: string) {
      return new Promise<void>((resolve, reject) => {
        loginApi(username, password)
          .then(({ isSuccess, msg, token, userInfo: userInfoData }) => {
            userInfo.value = userInfoData
            setLoginState(isSuccess)
            if (isSuccess) {
              setCache('user_token', token)
              setCache('user_info', userInfoData)
              resolve()
            }
            reject(msg)
          })
          .catch((err) => {
            console.log(err, 'userStore login() catch')
            reject(err)
          })
      })
    }

    function register(username: string, password: string) {
      return new Promise<void>((resolve, reject) => {
        registerApi(username, password)
          .then(({ isSuccess, msg, token, userInfo: userInfoData }) => {
            userInfo.value = userInfoData
            setLoginState(isSuccess)
            if (isSuccess) {
              setCache('user_token', token)
              setCache('user_info', userInfoData)
              resolve()
            }
            reject(msg)
          })
          .catch((err) => {
            console.log(err, 'userStore register() catch')
            reject(err)
          })
      })
    }

    function logout() {
      setCache('user_token', '')
      setCache('user_info', '')
      setLoginState(false)
      router.push('/user/login')
    }

    return {
      // 防止意外的修改，如果希望修改值，可以使用暴露的接口
      isLogin: readonly(isLogin),
      userInfo: readonly(userInfo),
      login,
      register,
      logout,
      restoreLoginState,
      // 该状态用于阻塞初次进入页面时vue-router的鉴权
      isRestoring,
    }
  },
})
