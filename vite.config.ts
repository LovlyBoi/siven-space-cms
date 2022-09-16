import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ViteAliases } from 'vite-aliases'
import eslint from 'vite-plugin-eslint'
// import tailwindcss from 'tailwindcss'
// import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [vue(), eslint(), ViteAliases() as unknown as Plugin],
  // css: {
  //   postcss: {
  //     plugins: [tailwindcss, autoprefixer],
  //   },
  // },
  server: {
    host: '0.0.0.0',
  },
})
