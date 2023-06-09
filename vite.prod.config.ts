import { UserConfig, splitVendorChunkPlugin } from 'vite'
import type { Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
import viteLegacyPlugin from '@vitejs/plugin-legacy'
import { ViteAliases } from 'vite-aliases'
import viteCompression from 'vite-plugin-compression'

const config: UserConfig = {
  base: '/cms/',
  build: {
    outDir: 'dist2',
  },
  plugins: [
    vue(),
    eslint(),
    // 我的 VSCode 对这个类型判断不对，但我看他源码导出的就是 Plugin 类型
    ViteAliases() as unknown as Plugin,
    viteCompression({
      // 50kb以上进行压缩
      threshold: 50 * 1024,
    }),
    // legacy 浏览器兼容
    viteLegacyPlugin(),
    // Vite 自带分割 vendor 的插件
    splitVendorChunkPlugin(),
  ],
}

export default config
