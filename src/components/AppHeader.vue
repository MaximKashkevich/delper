<template>
	<header class="main-header">
		<div class="header-block-one">
			<img :src="icons.logo" alt="Логотип компании">
			<ul class="header-ul">
				<li class="header-li"><a href="#">Конструктор</a></li>
				<li class="header-li"><a href="#">Мои проекты</a></li>
			</ul>
		</div>

		<div class="header-block-two">
			<p class="total-amount">Общая стоимость: <span class="amount">12345 руб</span></p>
			<button class="order-button">Заказать декор</button>
			<img :src="icons.faq" alt="Часто задаваемые вопросы" class="icon">
			<img :src="icons.avatar" alt="Профиль пользователя" class="icon">
		</div>
	</header>
</template>

<script setup>
import { avatar, faq, logo } from '@/assets/images/header'
import { computed } from 'vue'

const icons = computed(() => ({
	avatar,
	faq,
	logo
}))
</script>

<style scoped>
.main-header {
	box-sizing: border-box;
	width: 98%;
	font-family: 'BerlinType';
	height: 50px;
	background: linear-gradient(to right, rgba(255, 255, 255, 1), rgba(194, 207, 220, 1), rgba(194, 207, 220, 1));
	border: 1px solid rgba(250, 250, 250, 1);
	border-radius: 10px;
	margin: 25px;
	padding: 5px 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10px;
}

.header-block-one {
	display: flex;
	align-items: center;
	gap: 70px;
}

.header-block-one a {
	color: rgba(73, 103, 130, 1);
	font-weight: 700;
	font-size: 14px;
	line-height: 120%;
	text-transform: uppercase;
	text-decoration: none;
}

.header-ul {
	display: flex;
	align-items: center;
	gap: 50px;
	list-style: none;
	padding-left: 0;
	margin: 0;
}

.header-block-two {
	display: flex;
	align-items: center;
	gap: 70px;
}

.total-amount {
	color: rgba(38, 55, 78, 1);
	margin: 0;
	font-size: 14px;
}

.amount {
	font-weight: 700;
	font-size: 20px;
}

.order-button {
	background: rgba(73, 103, 130, 1);
	border-radius: 10px;
	padding: 10px 20px;
	color: rgba(255, 255, 255, 1);
	text-transform: uppercase;
	line-height: 120%;
	border: none;
	cursor: pointer;
	font-family: inherit;
	font-weight: 700;
	font-size: 14px;
}

.order-button:hover {
	background: rgba(60, 85, 110, 1);
}

.icon {
	cursor: pointer;
	width: 24px;
	height: 24px;
}
</style>