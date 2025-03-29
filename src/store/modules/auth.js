import {
	forgotPassword,
	login,
	logout,
	passwordRecovery,
	register,
} from '@/api/auth'

export default {
	namespaced: true,
	state: {
		user: null,
		isAuthenticated: !!localStorage.getItem('isAuthenticated'),
		loginSuccess: false,
		forgotPasswordSuccess: false,
		passwordRecoverySuccess: false,
		registrationSuccess: false,
	},
	getters: {
		isAuthenticated(state) {
			return state.isAuthenticated
		},
		loginSuccess(state) {
			return state.loginSuccess
		},
		registrationSuccess(state) {
			return state.registrationSuccess
		},
	},
	mutations: {
		SET_USER(state, user) {
			state.user = user
			state.isAuthenticated = !!user
		},
		CLEAR_USER(state) {
			state.user = null
			state.isAuthenticated = false
		},
		SET_REGISTRATION_SUCCESS(state, success) {
			state.registrationSuccess = success
		},
		SET_LOGIN_SUCCESS(state, success) {
			state.loginSuccess = success
			if (success) {
				localStorage.setItem('isAuthenticated', true)
			}
		},
	},
	actions: {
		async login({ commit }, credentials) {
			const response = await login(credentials)
			commit('SET_LOGIN_SUCCESS', response.success)
			return response
		},
		async logout({ commit }) {
			await logout()
			commit('CLEAR_USER')
		},
		async register({ commit }, formData) {
			try {
				const response = await register(formData)
				commit('SET_REGISTRATION_SUCCESS', response.success)
				return response
			} catch (error) {
				commit('SET_REGISTRATION_SUCCESS', false)
				return {
					result: {
						success: false,
						message: 'Что-то пошло не так',
					},
				}
			}
		},
		async passwordRecovery({ commit }, formData) {
			try {
				const response = await passwordRecovery(formData)
				commit('SET_PASSWORD_RECOVERY_SUCCESS', response.success)
				return response
			} catch (error) {
				commit('SET_PASSWORD_RECOVERY_SUCCESS', false)
				return {
					result: {
						success: false,
						message: 'Что-то пошло не так',
					},
				}
			}
		},
		async forgotPassword({ commit }, formData) {
			try {
				const response = await forgotPassword(formData)
				commit('SET_FORGOT_PASSWORD_SUCCESS', response.success)
				return response
			} catch (error) {
				commit('SET_FORGOT_PASSWORD_SUCCESS', false)
				return {
					result: {
						success: false,
						message: 'Такой Email не найден',
					},
				}
			}
		},
	},
}
