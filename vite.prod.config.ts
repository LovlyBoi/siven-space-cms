import { UserConfig, splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
import viteLegacyPlugin from '@vitejs/plugin-legacy'
import viteCompression from 'vite-plugin-compression'

const config: UserConfig = {
  base: '/cms/',
  build: {
    outDir: 'dist-cms',
  },
  plugins: [
    vue(),
    eslint(),
    viteCompression({
      // 50kb以上进行压缩
      threshold: 50 * 1024,
    }),
    // legacy 浏览器兼容
    viteLegacyPlugin(),
    // Vite 自带分割 vendor 的插件
    splitVendorChunkPlugin(),
  ],
  resolve: {
    alias: {
      '@': '/src',
    }
  },
}

export default config
