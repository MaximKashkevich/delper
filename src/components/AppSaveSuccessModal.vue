<template>
	<div class="modal-overlay" v-if="visible" @click.self="close">
		<div class="modal-box">
			<p class="message">
				Проект «{{ projectName }}»<br />
				сохранён в «Мои проекты»
			</p>
			<button class="close-button" @click="continueEditing">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M18 6L6 18" stroke="#7A8A99" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					<path d="M6 6L18 18" stroke="#7A8A99" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</button>
			<div class="actions">

				<button @click="continueEditing" class="btn primary">
					ПРОДОЛЖИТЬ РЕДАКТИРОВАНИЕ
				</button>
				<button @click="goToProjects" class="btn secondary">
					В МОИ ПРОЕКТЫ
				</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		visible: Boolean,
		projectName: String
	},
	methods: {
		close() {
			this.$emit('close')
		},
		continueEditing() {
			this.$emit('continue')
		},
		goToProjects() {
			this.$emit('goto-projects')
		}
	}
}
</script>

<style scoped>
.modal-overlay {
	position: fixed;
	inset: 0;
	background-color: rgba(0, 0, 0, 0.3);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1000;
}

.modal-box {
	background: #fff;
	border-radius: 12px;
	padding: 24px 28px;
	width: 320px;
	box-shadow: 0 4px 30px rgba(0, 0, 0, 0.25);
	text-align: center;
}

.message {
	font-size: 24px;

	color: #2E2E2E;
	line-height: 1.4;
	margin-bottom: 24px;
	font-family: "Arial", sans-serif;
	font-weight: 400;
}


.actions {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.btn {
	padding: 12px;
	font-size: 13px;
	border-radius: 8px;
	font-weight: 600;
	font-family: "Arial", sans-serif;
	border: none;
	cursor: pointer;
	transition: all 0.2s ease;
}

.primary {
	background-color: #3b5b75;
	color: white;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.primary:hover {
	background-color: #314c63;
}

.secondary {
	background-color: #d4dce5;
	color: #ffffff;
	opacity: 0.8;
}

.secondary:hover {
	opacity: 1;
}

.modal-box {
	position: relative;
	/* добавлено */
	background: #fff;
	border-radius: 12px;
	padding: 24px 28px;
	width: 320px;
	box-shadow: 0 4px 30px rgba(0, 0, 0, 0.25);
	text-align: center;
}

.close-button {
	position: absolute;
	/* добавлено */
	top: 16px;
	right: 16px;
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
</style>
