import { UserConfig } from 'vite'
import type { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
import { ViteAliases } from 'vite-aliases'
import viteCompression from 'vite-plugin-compression'

const config: UserConfig = {
  plugins: [
    vue(),
    eslint(),
    // 我的 VSCode 对这个类型判断不对，但我看他源码导出的就是 Plugin 类型
    ViteAliases() as unknown as Plugin,
    viteCompression({
      // 50kb以上进行压缩
      threshold: 50 * 1024,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
      },
    },
  },
}

export default config
