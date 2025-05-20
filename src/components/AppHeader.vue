<template>
	<header class="main-header" style="z-index: 999">
		<div class="header-block-one">
			<img src="@/assets/images/header/logo.svg" alt="Логотип компании">
			<ul class="header-ul">
				<li class="header-li">
					<router-link to="/dashboard">Конструктор</router-link>
				</li>
				<li class="header-li">
					<router-link to="/projects">Мои проекты</router-link>
				</li>
			</ul>
		</div>

		<div class="header-block-two">
			<p class="total-amount">Общая стоимость: <span class="amount">{{ totalPrice }} руб</span></p>
			<button class="order-button">Заказать декор</button>

			<div class="faq-container" :class="{ 'guide-highlight': currentGuidePage === 1 }">
				<img src="@/assets/images/header/faq.svg" class="icon faq-icon" @click.stop="openGuide(1)">
			</div>

			<router-link to="/personal-account" class="avatar-container"
				:class="{ 'guide-highlight': currentGuidePage === 2 }">
				<img src="@/assets/images/header/avatar.svg" alt="Профиль пользователя" class="icon avatar-icon"
					@click.stop="openGuide(2)">
			</router-link>

			<AppGuide v-if="showGuide" @close="closeGuide" @update-page="updateCurrentPage" />
		</div>
	</header>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from 'vuex'
import AppGuide from './AppGuide.vue'

export default {
	components: { AppGuide },
	setup() {
		const store = useStore()
		const showGuide = ref(false)
		const currentGuidePage = ref(1)

		const totalPrice = computed(() => store.state.category.totalPrice || 0)


		const icons = {
			avatar: '@/assets/images/header/avatar.svg',
			faq: '@/assets/images/header/faq.svg',
			logo: '@/assets/images/header/logo.svg'
		}

		const openGuide = (guideNumber) => {
			currentGuidePage.value = guideNumber
			showGuide.value = true
		}

		const closeGuide = () => {
			showGuide.value = false
			currentGuidePage.value = 0
		}

		const updateCurrentPage = (newPage) => {
			currentGuidePage.value = newPage
		}

		const handleClickOutside = (event) => {
			if (showGuide.value &&
				!event.target.closest('.faq-container') &&
				!event.target.closest('.avatar-container') &&
				!event.target.closest('.guide-container')) {
				closeGuide()
			}
		}

		onMounted(() => {
			document.addEventListener('click', handleClickOutside)
		})

		onUnmounted(() => {
			document.removeEventListener('click', handleClickOutside)
		})

		return {
			icons,
			totalPrice,
			showGuide,
			currentGuidePage,
			openGuide,
			closeGuide,
			updateCurrentPage
		}
	}
}
</script>

<style scoped>
.main-header {
	box-sizing: border-box;
	font-family: 'BerlinType';
	height: 50px;
	background: linear-gradient(to right, #ffffff, #c2cfdc, #c2cfdc);
	border: 1px solid #fafafa;
	border-radius: 10px;
	margin: 25px;
	padding: 5px 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	position: relative;
	z-index: 1000;
}

.header-block-one,
.header-block-two {
	display: flex;
	align-items: center;
	gap: 70px;
}

.header-ul {
	display: flex;
	gap: 50px;
	list-style: none;
	margin: 0;
	padding: 0;
}

.header-li a {
	color: #496782;
	font-weight: 700;
	font-size: 14px;
	text-transform: uppercase;
	text-decoration: none;
	transition: opacity 0.3s;
}

.header-li a:hover {
	opacity: 0.8;
}

.total-amount {
	color: #26374e;
	font-size: 14px;
	margin: 0;
}

.amount {
	font-weight: 700;
	font-size: 20px;
}

.order-button {
	background: #496782;
	border-radius: 10px;
	padding: 10px 20px;
	color: white;
	border: none;
	cursor: pointer;
	font-weight: 700;
	font-size: 14px;
	text-transform: uppercase;
	transition: background 0.3s;
}

.order-button:hover {
	background: #3c556e;
}

.icon {
	width: 24px;
	height: 24px;
	cursor: pointer;
	transition: all 0.3s;
}

.icon:hover {
	transform: scale(1.1);
}

.faq-container,
.avatar-container {
	position: relative;
	display: flex;
	align-items: center;
}

.avatar-icon {
	border-radius: 50%;
}

.guide-highlight {
	position: relative;
	z-index: 100001;
	animation: pulse 1.5s infinite;
}

@keyframes pulse {
	0% {
		box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.7);
	}

	70% {
		box-shadow: 0 0 0 10px rgba(74, 144, 226, 0);
	}

	100% {
		box-shadow: 0 0 0 0 rgba(74, 144, 226, 0);
	}
}

@media (max-width: 768px) {

	.header-block-one,
	.header-block-two {
		gap: 20px;
	}

	.header-ul {
		gap: 20px;
	}

	.total-amount {
		font-size: 12px;
	}

	.amount {
		font-size: 16px;
	}

	.order-button {
		padding: 8px 16px;
		font-size: 12px;
	}
}
</style>