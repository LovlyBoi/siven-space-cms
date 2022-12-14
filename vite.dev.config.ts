import { UserConfig } from 'vite'
import type { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
import { ViteAliases } from 'vite-aliases'

const config: UserConfig = {
  plugins: [
    vue(),
    eslint(),
    // 我的 VSCode 对这个类型判断不对，但我看他源码导出的就是 Plugin 类型
    ViteAliases() as unknown as Plugin,
  ],
  server: {
    host: '0.0.0.0',
  },
}

export default config
