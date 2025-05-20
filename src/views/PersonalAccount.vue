<script setup>
import AppHeader from '@/components/AppHeader.vue'

import { computed, watchEffect } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const user = computed(() => {
	const storeUser = store.state.auth.user
	const localUser = JSON.parse(localStorage.getItem('user') || 'null')
	return storeUser || localUser
})

watchEffect(() => {
	console.log('Текущий пользователь:', user.value)
})
</script>

<template>
	<AppHeader />
	<div class="container">
		<div class="side">
			<div class="side-slide active">
				<p>Аккаунт</p>
			</div>
			<div class="side-slide">
				<p>Безопасность</p>
			</div>
		</div>
		<div class="content">
			<div class="content-block">
				<div class="profile-header">
					<img class="avatar" src="@/assets/images/header/avatar.svg" alt="avatar">
					<div class="profile-info">
						<h1>{{ user?.fullName || 'Имя не указано' }}</h1>
						<p class="registration">Год регистрации 2024</p>
					</div>
					<img class="edit-icon" src="@/assets/images/content/edit.svg" alt="edit">
				</div>

				<div class="divider"></div>

				<div class="profile-details">
					<div class="detail-item">
						<div class="detail-header">
							<span class="detail-title">Телефон</span>
							<img class="edit-icon" src="@/assets/images/content/edit.svg" alt="edit">
						</div>
						<span class="detail-value">+7 (495) 123-45-67</span>
					</div>

					<div class="detail-item">
						<div class="detail-header">
							<span class="detail-title">Электронная почта</span>
							<img class="edit-icon" src="@/assets/images/content/edit.svg" alt="edit">
						</div>
						<span class="detail-value">pochta@gmail.com</span>
					</div>
				</div>
			</div>

			<!-- Новый добавленный блок -->
			<div class="content-block additional-block">
				<div class="detail-item">
					<div class="detail-header">
						<span class="detail-title">Дата рождения</span>
					</div>
					<div class="birthday-fields">
						<input type="text" placeholder="Число" class="birthday-input">
						<input type="text" placeholder="Месяц" class="birthday-input">
						<input type="text" placeholder="Год" class="birthday-input">
					</div>
				</div>

				<div class="detail-item">
					<div class="detail-header">
						<span class="detail-title">Страна</span>
					</div>
					<div class="select-wrapper">
						<select class="country-select">
							<option disabled selected>Выберите из списка</option>
							<option>Россия</option>
							<option>Беларусь</option>
							<option>Казахстан</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
/* Основные цвета из фото */
:root {
	--text-primary: #1A1A1A;
	--text-secondary: #8E8E93;
	--border-color: #E5E5EA;
	--accent-color: #0066FF;
	--background: #FAF9F7;
	--white: #FFFFFF;
	--shadow-light: rgba(0, 0, 0, 0.05);
}

.container {
	display: flex;
	width: 100%;
	height: calc(100vh - 60px);
	background-color: var(--background);
	padding: 0 20px;
}

.side {
	width: 255px;
	background-color: var(--white);
	display: flex;
	flex-direction: column;
	padding: 20px 0;
	box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1),
		2px 0 4px rgba(0, 0, 0, 0.08);
	z-index: 10;
	border-radius: 10px;
}

.side-slide {
	color: var(--text-primary);
	font-weight: 700;
	font-size: 16px;
	padding: 12px 20px;
	cursor: pointer;
	transition: all 0.2s;
}

.side-slide:hover {
	background-color: rgba(0, 102, 255, 0.05);
}

.side-slide.active {
	background-color: rgba(0, 102, 255, 0.1);
	color: var(--accent-color);
}

.content {
	flex: 1;
	padding: 32px;
	overflow-y: auto;
}

.content-block {
	width: 528px;
	background-color: var(--white);
	border-radius: 10px;
	padding: 24px;
	box-shadow: 0 2px 8px var(--shadow-light);
}

/* Стили для полей ввода с внутренними тенями */
.birthday-fields {
	display: flex;
	gap: 12px;
	margin-top: 8px;
	width: 100%;
}

.birthday-input {
	padding: 12px 16px;
	border: 1px solid var(--border-color);
	border-radius: 8px;
	font-size: 16px;
	color: var(--text-primary);
	background-color: var(--white);
	height: 48px;
	box-sizing: border-box;
	transition: all 0.2s;
	flex: 1;
	min-width: 0;
	box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.08),
		inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.birthday-input:focus {
	border-color: var(--accent-color);
	outline: none;
	box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.08),
		inset 0 1px 2px rgba(0, 0, 0, 0.1),
		0 0 0 2px rgba(0, 102, 255, 0.1);
}

.birthday-input::placeholder {
	color: rgba(187, 202, 216, 1);
	opacity: 1;
}

.select-wrapper {
	position: relative;
	margin-top: 8px;
}

.country-select {
	width: 100%;
	padding: 12px 40px 12px 16px;
	border: 1px solid var(--border-color);
	border-radius: 8px;
	font-size: 16px;
	color: var(--text-primary);
	background-color: var(--white);
	height: 48px;
	appearance: none;
	cursor: pointer;
	transition: all 0.2s;
	box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.08),
		inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

.country-select option:disabled {
	color: rgba(187, 202, 216, 1);
}

.country-select option:checked:not(:disabled) {
	color: var(--text-primary);
}

.country-select:focus {
	border-color: var(--accent-color);
	outline: none;
	box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.08),
		inset 0 1px 2px rgba(0, 0, 0, 0.1),
		0 0 0 2px rgba(0, 102, 255, 0.1);
}


.select-wrapper::after {
	content: "";
	position: absolute;
	top: 50%;
	right: 16px;
	transform: translateY(-50%);
	width: 16px;
	height: 16px;
	background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%238E8E93' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	pointer-events: none;
}

/* Остальные стили остаются без изменений */
.profile-header {
	display: flex;
	align-items: center;
	gap: 20px;
	margin-bottom: 24px;
}

.avatar {
	width: 100px;
	height: 100px;
	border-radius: 50%;
	object-fit: cover;
}

.profile-info h1 {
	font-size: 20px;
	font-weight: 600;
	margin: 0 0 4px 0;
	color: var(--text-primary);
	line-height: 24px;
}

.registration {
	font-size: 14px;
	color: var(--text-secondary);
	margin: 0;
	line-height: 18px;
}

.edit-icon {
	width: 20px;
	height: 20px;
	cursor: pointer;
	transition: opacity 0.2s;
}

.edit-icon:hover {
	opacity: 0.8;
}

.divider {
	height: 1px;
	background-color: var(--border-color);
	margin: 16px 0;
	border: none;
}

.detail-item {
	margin-bottom: 24px;
}

.detail-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;
}

.detail-title {
	font-size: 14px;
	color: var(--text-secondary);
	line-height: 18px;
}

.detail-value {
	font-size: 16px;
	color: var(--text-primary);
	display: block;
	line-height: 22px;
}

.additional-block {
	margin-top: 24px;
}
</style>