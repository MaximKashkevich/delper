<template>
	<div class="container">
		<div v-for='item in props.fotozones' :key='item.id' class="slides-container">
			<div @click="props.activeSlides?.(item.id)" class="block" :class="{ active: props.slidesId === item.id }">
				<span class="slides-title">{{ item.title }}</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
	fotozones: {
		type: Array,
		required: true
	},
	activeSlides: {
		type: Function,
		default: () => { }
	},
	slidesId: {
		type: Number,
		default: null
	}
})


</script>

<style scoped>
.container {
	display: flex;
	gap: 10px;
	padding: 10px 0;
	overflow-x: auto;
	position: absolute;
	top: -50px;
	left: 0;
}

.slides-container {
	flex-shrink: 0;
}

.block {
	cursor: pointer;
	padding: 5px;
}

.slides-title {
	display: inline-block;
	background: rgba(224, 228, 232, 1);
	padding: 10px 15px;
	border-radius: 5px 5px 0 0;
	color: rgba(38, 55, 78, 1);
	text-transform: uppercase;
	transition: background 0.2s ease;
}

.active .slides-title {
	background: rgba(255, 255, 255, 1);
	font-weight: bold;
}
</style>