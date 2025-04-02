<template>
	<div class="container">
		<div class="slides-container" v-for='item in props.fotozones' :key='item.id'>
			<div @click="props.toggleShaw?.(item.id)" class="block">
				<img src="@/assets/images/content/plus.svg" alt="plus">
				<span>{{ item.title }}</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
	fotozones: Array,
	toggleShaw: Function,
})
</script>

<style scoped>
.container {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	/* 3 колонки с равной шириной */
	gap: 10px;
	align-items: center;
	padding: 10px;
}

.block {
	width: 100%;
	min-height: 250px;
	background-color: rgba(255, 255, 255, 1);
	box-shadow: 0 3px 10px rgba(178, 176, 173, 0.2);
	/* исправленная тень */
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 15px;
	box-sizing: border-box;
	border-radius: 10px;
	gap: 10px;
	cursor: pointer;
}

.block span {
	font-size: 20px;
	color: rgba(38, 55, 78, 1);
	line-height: 120%
}
</style>