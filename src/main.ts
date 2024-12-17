import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import './mock'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { api } from './api'

const app = createApp(App)

// 初始化 axios 配置
const token = localStorage.getItem('token')
if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

app.use(ElementPlus)
app.use(router)
app.use(createPinia())



app.mount('#app')
