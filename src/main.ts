import { createApp } from 'vue'
import './style.css'
import '@phanna/ui-framework/style.css'
import App from './App.vue'
import router from './router'
import UIFramework from '@phanna/ui-framework'

const app = createApp(App)
app.use(router)
app.use(UIFramework as any)
app.mount('#app')
