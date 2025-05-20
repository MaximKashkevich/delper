export default {
	namespaced: true,
	state: () => ({
		opacitySettings: {
			sidebar: 1,
			photoZoneIcons: 1,
			contentBackground: 1,
			activeElements: 1,
		},
	}),
	mutations: {
		UPDATE_OPACITY(state, { component, value }) {
			// eslint-disable-next-line no-prototype-builtins
			if (state.opacitySettings.hasOwnProperty(component)) {
				state.opacitySettings[component] = Math.min(1, Math.max(0, value))
			}
		},
	},
	actions: {
		saveSettings({ state }) {
			localStorage.setItem(
				'opacitySettings',
				JSON.stringify(state.opacitySettings)
			)
		},
		loadSettings({ commit }) {
			const settings = JSON.parse(localStorage.getItem('opacitySettings'))
			if (settings) {
				Object.entries(settings).forEach(([key, value]) => {
					commit('UPDATE_OPACITY', { component: key, value })
				})
			}
		},
	},
}
