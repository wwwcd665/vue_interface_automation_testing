import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import api from "@/api/index"
import store from './store'
import "./assets/css/global.css"
const app = createApp(App).use(store)

app.use(router)
app.use(ElementPlus)

app.use(ElementPlus, {
  locale: zhCn,
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.globalProperties.$api = api

app.mount('#app')
