import { fetchProjects, saveProject } from '@/api/projects'

const state = {
	projects: [],
	projectSaveSuccess: false,
}

const mutations = {
	SET_PROJECTS(state, projects) {
		state.projects = projects
	},
	ADD_PROJECT(state, project) {
		state.projects.push(project)
		localStorage.setItem('projects', JSON.stringify(state.projects))
	},
	UPDATE_PROJECT(state, updatedProject) {
		const index = state.projects.findIndex(p => p.id === updatedProject.id)
		if (index !== -1) {
			state.projects.splice(index, 1, updatedProject)
			localStorage.setItem('projects', JSON.stringify(state.projects))
		}
	},
	DELETE_PROJECT(state, projectId) {
		state.projects = state.projects.filter(p => p.id !== projectId)
		localStorage.setItem('projects', JSON.stringify(state.projects))
	},
	SET_PROJECT_SAVE_SUCCESS(state, data) {
		state.projectSaveSuccess = data.success
	},
}

function encodeDump(data) {
	const json = JSON.stringify(data)
	return btoa(unescape(encodeURIComponent(json)))
}

// function decodeDump(encoded) {
// 	const json = decodeURIComponent(escape(atob(encoded)));
// 	return JSON.parse(json);
// }

const actions = {
	loadProjects({ commit }) {
		try {
			const projects = localStorage.getItem('projects')
			if (projects) {
				commit('SET_PROJECTS', JSON.parse(projects))
			}
		} catch (e) {
			console.error('Error loading projects:', e)
		}
	},

	async loadProjectsFromServer({ commit }) {
		try {
			const response = await fetchProjects()
			commit('SET_PROJECTS', response.data)
			return response
		} catch (error) {
			console.error('Error loading projects:', error)
			throw error
		}
	},

	async saveProject({ commit }, projectData) {
		try {
			// Нормализация данных
			const name = String(projectData.name || '').trim()
			const images = Array.isArray(projectData.images) ? projectData.images : []

			// Валидация
			if (!name) throw new Error('Название проекта обязательно')
			if (images.length === 0) throw new Error('Добавьте элементы в проект')

			// Формируем проект
			const project = {
				id: Date.now(),
				title: name,
				zone_id: projectData.zoneId || 0,
				zone_title: projectData.zoneTitle || 'Без зоны',
				data: encodeDump(images),
				preview: projectData.preview || '',
				created_at: new Date().toISOString(),
			}

			// Отправка на сервер
			const response = await saveProject(project)

			if (response.success) {
				commit('ADD_PROJECT', project)
				return { success: true }
			}

			throw new Error('Ошибка сервера при сохранении')
		} catch (error) {
			console.error('Error saving project:', error)
			throw error
		}
	},
}

const getters = {
	getProjects: state => state.projects,
	getProjectsByZone: state => zoneId =>
		state.projects
			.filter(p => p.zoneId === zoneId)
			.sort(
				(a, b) =>
					new Date(b.updatedAt || b.createdAt) -
					new Date(a.updatedAt || a.createdAt)
			),
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
	getters,
}
