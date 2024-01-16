import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createVuestic } from 'vuestic-ui'
import 'vuestic-ui/css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(
  createVuestic({
    config: {
      colors: {
        currentPresetName: 'dark'
      }
    }
  })
)

app.mount('#app')
