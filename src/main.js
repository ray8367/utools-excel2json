import { createApp } from 'vue'
import App from './App.vue'
import '@arco-design/web-vue/es/message/style/css.js'
import 'virtual:windi.css'
import '@/styles/index.scss'
import 'shepherd.js/dist/css/shepherd.css'
import '@/assets/iconfont/iconfont.css'
import { createPinia } from 'pinia'

createApp(App).use(createPinia()).mount('#app')
