<template>
	<AppHeader @navigate="handleNavigation" />
	<div class="projects-container">
		<AppSidebar :show-content="false" />

		<div class="projects-content">
			<div class="projects-grid">
				<div class="create-block" @click="createNewProject">
					<img :src="createProject" alt="Создать проект">
					<p>Создать новый проект</p>
				</div>

				<div v-for="project in savedProjects" :key="project.id" class="project-card">
					<div class="project-preview" @click.stop="openProject(project)">
						<img v-if="project.preview" :src="project.preview" alt="Превью" class="preview-image">
						<div v-else class="no-preview">
							<span>Нет превью</span>
						</div>
					</div>

					<div class="project-info">
						<h3 class="project-title">{{ project.name }}</h3>
						<div class="project-meta">
							<span class="project-date">{{ formatDate(project.createdAt) }}</span>
							<span class="project-zone">{{ getZoneTitle(project.zoneId) }}</span>
						</div>
					</div>

					<div class="project-actions">
						<img src="@/assets/images/content/settingsMyProject.svg" class="settings-icon"
							@click.stop="toggleMenu(project.id)">

						<transition name="fade">
							<div v-if="activeMenuId === project.id" class="dropdown-menu">
								<div class="menu-item" @click="openProject(project)">
									<img :src="open" alt="open">
									<span>Открыть</span>
								</div>
								<div class="menu-item" @click="renameProject(project)">
									<img :src="rename" alt="rename">
									<span>Переименовать</span>
								</div>
								<div class="menu-item" @click="downloadProject(project)">
									<img :src="download" alt="download">
									<span>Скачать</span>
								</div>
								<div class="menu-item" @click="deleteProject(project)">
									<img :src="deleteProjectImage" alt="delete">
									<span>Удалить</span>
								</div>
							</div>
						</transition>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import {
	createProject as createProjectIcon,
	deleteProjectImage,
	download,
	open,
	rename
} from '@/assets/images/content/index'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import axios from 'axios'

export default {
	components: {
		AppHeader,
		AppSidebar
	},

	data() {
		return {
			activeMenuId: null,
			savedProjects: [],
			fotozones: [
				{ id: 0, title: 'выездной регистрации' },
				{ id: 1, title: 'фотозоны' },
				{ id: 2, title: 'столов гостей' },
				{ id: 3, title: 'плана рассадки' },
				{ id: 5, title: 'другой зоны' }
			],
			createProject: createProjectIcon,
			download,
			open,
			rename,
			deleteProjectImage
		}
	},

	async created() {
		await this.loadProjects()
		document.addEventListener('click', this.handleClickOutside)
	},

	beforeUnmount() {
		document.removeEventListener('click', this.handleClickOutside)
	},

	methods: {
		async loadProjects() {
			try {
				const response = await axios.get('/api/save/list')
				this.savedProjects = response.data.map(project => ({
					...project,
					preview: this.getProjectPreview(project)
				}))
			} catch (error) {
				console.error('Ошибка загрузки проектов:', error)
			}
		},

		getProjectPreview(project) {
			try {
				if (project.preview) return project.preview
				const content = JSON.parse(project.content)
				const image = content.find(item => item.type === 'image' && !item.isBackground)
				return image?.src || ''
			} catch {
				return ''
			}
		},

		getZoneTitle(zoneId) {
			const zone = this.fotozones.find(z => z.id === zoneId)
			return zone?.title || 'Неизвестная зона'
		},

		formatDate(dateString) {
			const options = { year: 'numeric', month: 'long', day: 'numeric' }
			return new Date(dateString).toLocaleDateString('ru-RU', options)
		},

		handleNavigation(destination) {
			const routes = {
				'constructor': '/constructor',
				'projects': '/projects'
			}
			if (routes[destination]) {
				this.$router.push(routes[destination])
			}
		},

		createNewProject() {
			this.$router.push('/dashboard')
		},

		openProject(project) {
			this.activeMenuId = null
			localStorage.setItem('currentProject', JSON.stringify(project))
			this.$router.push({
				path: '/dashboard',
				query: { projectId: project.id }
			})
		},

		toggleMenu(projectId) {
			this.activeMenuId = this.activeMenuId === projectId ? null : projectId
		},

		handleClickOutside(event) {
			if (this.$el && !this.$el.contains(event.target)) {
				this.activeMenuId = null
			}
		},

		async renameProject(project) {
			const newName = prompt('Новое название проекта:', project.name)
			if (newName) {
				try {
					await axios.put(`/api/save/${project.id}`, { name: newName })
					project.name = newName
				} catch (error) {
					console.error('Ошибка обновления проекта:', error)
				}
			}
		},

		async deleteProject(project) {
			if (confirm(`Удалить проект "${project.name}"?`)) {
				try {
					await axios.delete(`/api/save/${project.id}`)
					this.savedProjects = this.savedProjects.filter(p => p.id !== project.id)
				} catch (error) {
					console.error('Ошибка удаления проекта:', error)
				}
			}
		},

		downloadProject(project) {
			const dataStr = JSON.stringify(project, null, 2)
			const blob = new Blob([dataStr], { type: 'application/json' })
			const url = URL.createObjectURL(blob)

			const link = document.createElement('a')
			link.href = url
			link.download = `${project.name.replace(/[^\w]/g, '_')}.json`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		}
	}
}
</script>

<style scoped>
.projects-container {
	display: flex;
	height: calc(100vh - 80px);
	padding: 0 20px 0 20px;
}

.projects-content {
	flex: 1;
	padding: 20px;
	min-height: 100vh;
	border-radius: 10px;
	background-color: #faf9f7;
	overflow-y: auto;
	margin-left: var(--sidebar-width);
}

.create-block {
	background: white;
	border-radius: 10px;
	padding: 25px;
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 15px;
	min-height: 250px;
	border: 2px dashed #e0e4e8;
	text-align: center;
}

.create-block:hover {
	transform: translateY(-3px);
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
	border-color: #3498db;
	background-color: #f8faff;
}

/* Изменение */

.create-block img {
	width: 70px;
	height: 70px;
	object-fit: contain;
	transition: transform 0.3s ease;
}

.create-block:hover img {
	transform: scale(1.05);
}

.create-block p {
	color: #26374e;
	font-size: 18px;
	font-weight: 500;
	margin: 0;
	line-height: 1.3;
}

.projects-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 25px;
	margin-top: 20px;
}

.project-card {
	background: white;
	border-radius: 10px;
	overflow: hidden;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	cursor: pointer;
	transition: all 0.3s ease;
	display: flex;
	flex-direction: column;
	height: 100%;
	position: relative;
}

.project-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.project-preview {
	height: 180px;
	background-color: #f0f2f5;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	position: relative;
}

.preview-image {
	width: 100%;
	height: 100%;
	object-fit: contain;
	background-color: white;
}

.no-preview {
	color: #7a8a99;
	font-size: 14px;
}

.project-info {
	padding: 15px;
	border-top: 1px solid #e0e4e8;
}

.project-title {
	font-weight: 600;
	margin-bottom: 8px;
	color: #26374e;
	font-size: 15px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.project-date {
	color: #7a8a99;
	font-size: 13px;
	margin-bottom: 5px;
}

.project-zone {
	color: #496782;
	font-size: 12px;
	font-style: italic;
}

.settings-icon {
	position: absolute;
	top: 1rem;
	right: 1rem;
	width: 32px;
	height: 32px;
	cursor: pointer;
	padding: 6px;
	background: rgba(255, 255, 255, 0.9);
	border-radius: 6px;
	transition: 0.2s;
}

.settings-icon:hover {
	background: white;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-menu {
	position: absolute;
	top: 3rem;
	right: 1rem;
	background: white;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	z-index: 10;
	min-width: 160px;
}

.menu-item {
	display: flex;
	align-items: center;
	padding: 0.75rem 1rem;
	font-size: 0.9rem;
	color: #606266;
	cursor: pointer;
	transition: 0.2s;
}

.menu-item:hover {
	background: #f5f7fa;
}

.menu-item img {
	width: 18px;
	height: 18px;
	margin-right: 0.75rem;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s, transform 0.2s;
}

.fade-enter,
.fade-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
</style>