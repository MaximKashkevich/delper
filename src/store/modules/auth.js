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
			console.log('Сохранение пользователя:', user)
			state.user = user
			state.isAuthenticated = !!user
			if (user) {
				localStorage.setItem('user', JSON.stringify(user))
			} else {
				localStorage.removeItem('user')
			}
		},
		CLEAR_USER(state) {
			state.user = null
			state.isAuthenticated = false
		},
		SET_REGISTRATION_SUCCESS(state, data) {
			state.registrationSuccess = data.success
			if (data.success) {
				localStorage.setItem('isAuthenticated', true)
				localStorage.setItem('userToken', data.result.accessToken)
			}
		},
		SET_LOGIN_SUCCESS(state, data) {
			state.loginSuccess = data.success
			if (data.success) {
				localStorage.setItem('isAuthenticated', true)
				localStorage.setItem('userToken', data.result.accessToken)
			}
		},
	},
	actions: {
		async login({ commit }, credentials) {
			try {
				const response = await login(credentials)
				console.log('Полный ответ сервера:', response)
				if (response.success) {
					commit('SET_USER', response.result.user)
					commit('SET_LOGIN_SUCCESS', response)
				}
				return response
			} catch (error) {
				commit('SET_REGISTRATION_SUCCESS', false)

				if (error.response && error.response.status === 422) {
					return error.response.data
				}

				return {
					success: false,
					message: 'Произошла ошибка при авторизации',
					error,
				}
			}
		},
		async logout({ commit }) {
			await logout()
			commit('CLEAR_USER')
		},
		async register({ commit }, formData) {
			try {
				const response = await register(formData)
				commit('SET_REGISTRATION_SUCCESS', response)
				return response
			} catch (error) {
				commit('SET_REGISTRATION_SUCCESS', false)

				if (error.response && error.response.status === 422) {
					return error.response.data
				}

				return {
					success: false,
					message: 'Произошла ошибка при регистрации',
					error,
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
