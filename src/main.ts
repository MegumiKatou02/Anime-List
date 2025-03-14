import './assets/main.css'

import { createApp } from 'vue'
import { createHead } from '@vueuse/head'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import TurnstileWidget from 'vue-turnstile'

const app = createApp(App)
const head = createHead()
const pinia = createPinia()

app.use(router)
app.use(head)
app.use(pinia)
app.component('turnstile-widget', TurnstileWidget)

app.mount('#app')
