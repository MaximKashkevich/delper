import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const savedUser = localStorage.getItem('user')
if (savedUser) {
	store.commit('auth/SET_USER', JSON.parse(savedUser))
}
createApp(App).use(store).use(router).mount('#app')
