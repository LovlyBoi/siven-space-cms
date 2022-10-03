import { createApp } from 'vue'
import 'tailwindcss/tailwind.css'
import './style.css'
import 'vfonts/Lato.css' // 通用字体
import 'vfonts/FiraCode.css' // 等宽字体
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import App from './App.vue'
import router from '@/router'

createApp(App).use(router).use(mavonEditor).mount('#app')
