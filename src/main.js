import { createApp } from 'vue'
import App from './App.vue'
import '@arco-design/web-vue/dist/arco.less'
import '@arco-design/web-vue/es/message/style/css.js'
import 'virtual:windi.css'
import '@/styles/global.scss'
import { createPinia } from 'pinia'
import 'shepherd.js/dist/css/shepherd.css'

createApp(App).use(createPinia()).mount('#app')
