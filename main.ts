import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { setSessionExpiredHandler } from './api/http-client'
import { useAuthStore } from './stores/auth'
import './assets/main.scss'

const app = createApp(App)
app.use(createPinia())
app.use(router)

const auth = useAuthStore()
setSessionExpiredHandler(() => {
  auth.logout()
  void router.push({ name: 'login' })
})
void auth.fetchMe()

app.mount('#app')
