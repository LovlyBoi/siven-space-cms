import { createApp, defineComponent, h } from 'vue'
import { NMessageProvider } from 'naive-ui'
import 'tailwindcss/tailwind.css'
import './style.css'
import 'vfonts/Lato.css' // 通用字体
import 'vfonts/FiraCode.css' // 等宽字体
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import App from './App.vue'
import router from '@/router'
import { createPinia } from 'pinia'
import '@/assets/toast-theme-suger.css'

// 增加message provider
const app = createApp(
  defineComponent({
    name: 'RootApp',
    setup() {
      return () =>
        h(
          NMessageProvider,
          {},
          {
            default() {
              return h(App)
            },
          }
        )
    },
  })
)
app.use(router)
app.use(mavonEditor)
app.use(createPinia())
app.mount('#app')
