<template>
	<div class="modal-overlay" v-if="visible" @click.self="closeModal">
		<div class="modal-content">
			<div class="modal-header">
				<h3 class="modal-title">Сохраняем вашу композицию в проекты</h3>
				<button class="close-button" @click="closeModal">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M18 6L6 18" stroke="#7A8A99" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M6 6L18 18" stroke="#7A8A99" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</button>
			</div>

			<div class="input-group">
				<label for="project-name" class="input-label">Назовите проект</label>
				<input id="project-name" v-model="projectName" class="project-input"
					:placeholder='`Например, "${currentZoneTitle}"`' @keyup.enter="handleSave">
			</div>

			<div class="modal-actions">
				<button class="save-button" @click="handleSave" :disabled="!projectName.trim() || isSaving"
					:class="{ 'disabled': !projectName.trim() || isSaving }">
					{{ isSaving ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ' }}
				</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		visible: Boolean,
		currentZoneTitle: String,
		projectData: Object
	},
	data() {
		return {
			projectName: '',
			isSaving: false
		}
	},
	methods: {
		closeModal() {
			this.$emit('close')
		},
		async handleSave() {
			if (!this.projectName || this.isSaving) return

			this.isSaving = true
			try {
				const fullProjectData = {
					...this.projectData,
					name: String(this.projectName).trim(), // Гарантированное преобразование в строку
					createdAt: new Date().toISOString()
				}

				this.$emit('save', fullProjectData)
				this.closeModal()
			} catch (error) {
				console.error('Save error:', error)
				this.$emit('save-error', error)
			} finally {
				this.isSaving = false
			}
		}
	},
	watch: {
		visible(newVal) {
			if (newVal) {
				this.projectName = this.currentZoneTitle || 'Мой проект'
			} else {
				this.projectName = ''
				this.isSaving = false
			}
		}
	}
}
</script>

<style scoped>
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.3);
	/* заменили с синего на нейтральный полупрозрачный чёрный */
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1002;
	padding: 20px;
}


.modal-content {
	background-color: white;
	border-radius: 12px;
	width: 100%;
	max-width: 480px;
	padding: 24px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
	animation: modal-appear 0.3s ease-out;
}

@keyframes modal-appear {
	from {
		opacity: 0;
		transform: translateY(20px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 24px;
}

.modal-title {
	font-size: 18px;
	font-weight: 600;
	color: #26374E;
	margin: 0;
	line-height: 1.4;
}

.close-button {
	background: none;
	border: none;
	padding: 0;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: transform 0.2s ease;
}

.close-button:hover {
	transform: rotate(90deg);
}

.input-group {
	margin-bottom: 24px;
}

.input-label {
	display: block;
	font-size: 14px;
	color: #7A8A99;
	margin-bottom: 8px;
	font-weight: 500;
}

.project-input {
	width: 100%;
	padding: 12px 16px;
	border: 1px solid #E0E4E8;
	border-radius: 8px;
	font-size: 14px;
	color: #26374E;
	transition: border-color 0.2s;
}

.project-input:focus {
	outline: none;
	border-color: #496782;
}

.project-input::placeholder {
	color: #BBCAD8;
}

.modal-actions {
	display: flex;
	justify-content: flex-end;
}

.save-button {
	background-color: #496782;
	color: white;
	border: none;
	border-radius: 8px;
	padding: 12px 24px;
	font-size: 14px;
	font-weight: 600;
	text-transform: uppercase;
	cursor: pointer;
	transition: background-color 0.2s;
	width: 100%;
}

.save-button:hover:not(.disabled) {
	background-color: #3A526B;
}

.save-button.disabled {
	background-color: #BBCAD8;
	cursor: not-allowed;
}

/* Адаптивность */
@media (max-width: 480px) {
	.modal-content {
		padding: 16px;
	}

	.modal-title {
		font-size: 16px;
	}

	.save-button {
		padding: 10px 16px;
	}
}
</style>