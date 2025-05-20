import DashboardPage from '@/views/DashboardPage.vue'
import ForgotPasswordPage from '@/views/ForgotPasswordPage.vue'
import LoginPage from '@/views/LoginPage'
import PasswordRecoveryPage from '@/views/PasswordRecoveryPage.vue'
import PersonalAccount from '@/views/PersonalAccount.vue'
import ProjectsPage from '@/views/ProjectsPage.vue'
import RegisterPage from '@/views/RegisterPage'
import SlidesPage from '@/views/SlidesPage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/index'

const ifAuthenticated = (to, from, next) => {
	if (store.getters['ui/isAuthenticated']) {
		next()
	} else {
		next('/login')
	}
}

const routes = [
	{
		path: '/',
		name: 'main',
		component: DashboardPage,
		beforeEnter: ifAuthenticated,
	},
	{ path: '/login', component: LoginPage },
	{ path: '/register', component: RegisterPage },
	{ path: '/password-recovery', component: PasswordRecoveryPage },
	{ path: '/forgot-password', component: ForgotPasswordPage },
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: DashboardPage,
		props: route => ({ projectId: route.query.projectId }),
	},
	{
		path: '/projects',
		component: ProjectsPage,
	},
	{
		path: '/personal-account',
		component: PersonalAccount,
	},
	{
		path: '/slides',
		component: SlidesPage,
		beforeEnter: (to, from, next) => {
			if (from.path === '/dashboard' && to.query.guide) {
				localStorage.setItem('guideActive', 'true')
				localStorage.setItem('guidePage', '3')
			}
			next()
		},
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach((to, from, next) => {
	const isAuthenticated = store.getters['auth/isAuthenticated'] // Проверка через Vuex
	if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
		next('/login')
	} else {
		next()
	}
})

export default router
