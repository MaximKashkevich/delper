import { getCategories } from '@/api/category'

export default {
	namespaced: true,
	state: {
		categories: [],
		fetchCategoriesSuccess: false,
		totalPrice: 0,
	},
	getters: {
		categories(state) {
			return state.categories
		},
		fetchCategoriesSuccess(state) {
			return state.fetchCategoriesSuccess
		},
	},
	mutations: {
		SET_CATEGORIES(state, categories) {
			state.categories = categories
		},
		SET_CATEGORIES_SUCCESS(state, success) {
			state.fetchCategoriesSuccess = success
		},
		UPDATE_TOTAL_PRICE(state, price) {
			state.totalPrice = price
		},
	},
	actions: {
		async fetchCategories({ commit }) {
			const response = await getCategories()
			commit('SET_CATEGORIES_SUCCESS', response.success)
			commit('SET_CATEGORIES', response.result)
			return response
		},
	},
}
