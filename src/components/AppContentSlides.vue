<template>
	<div class="slides-container" :class="{ 'guide-highlight': highlight }">
		<div class="slides-track">
			<div v-for="slide in slides" :key="slide.id" class="slide-item" :class="{
				'is-active': activeSlideId === slide.id,
				'guide-highlight-item': highlight && activeSlideId === slide.id
			}" @click="handleSlideChange(slide.id)">
				{{ slide.title }}
				<div class="border-animation">
					<div class="runner-top"></div>
					<div class="runner-right"></div>
					<div class="runner-bottom"></div>
					<div class="runner-left"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		slides: {
			type: Array,
			required: true,
			validator: (value) => value.every(item => item.id !== undefined && item.title !== undefined)
		},
		activeSlideId: {
			type: [Number, String],
			required: true
		},
		highlight: {
			type: Boolean,
			default: false
		}
	},
	emits: ['slide-change'],
	methods: {
		handleSlideChange(id) {
			this.$emit('slide-change', id)
			this.$emit('update:highlight', false)
		}
	}

}
</script>

<style scoped>
.guide-highlight .slides-track {
	position: relative;
}

.guide-highlight .slides-track::before {
	content: '';
	position: absolute;
	top: -10px;
	left: -10px;
	right: -10px;
	bottom: -10px;
	border: 3px dashed #4a90e2;
	border-radius: 12px;
	animation: pulse-border 2s infinite;
	pointer-events: none;
}

@keyframes pulse-border {
	0% {
		opacity: 0.7;
		transform: scale(1);
	}

	50% {
		opacity: 0.3;
		transform: scale(1.02);
	}

	100% {
		opacity: 0.7;
		transform: scale(1);
	}
}

.guide-highlight .slide-item.is-active {
	transform: scale(1.05);
	transition: transform 0.3s ease;
}

.guide-highlight .slide-item.is-active .border-animation {
	opacity: 1;
	animation-duration: 1.5s;
}

.slides-container {
	padding: 0
}

.slides-track {
	display: flex;
	gap: 12px;
	padding: 0;
	margin: 0 auto;
	max-width: 1200px;
	overflow-x: auto;
	scrollbar-width: none;
	justify-content: center;
}

.slide-item {
	padding: 12px 28px;
	font-size: 15px;
	font-weight: 500;
	color: #4a5568;
	white-space: nowrap;
	border-radius: 10px;
	transition: all 0.3s ease;
	background: white;
	border: 1px solid #e2e8f0;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
	cursor: pointer;
	flex-shrink: 0;
	position: relative;
	overflow: hidden;
}

.slide-item.is-active {
	color: #3b82f6;
}

/* Новые стили для анимации */
.border-animation {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	opacity: 0;
}

.slide-item.is-active .border-animation {
	opacity: 1;
}

.runner-top,
.runner-right,
.runner-bottom,
.runner-left {
	position: absolute;
	background: linear-gradient(90deg, transparent, #3b82f6, transparent);
	opacity: 0;
}

.runner-top {
	top: 0;
	left: 0;
	width: 100%;
	height: 2px;
	animation: runTop 3s linear infinite;
}

.runner-right {
	top: 0;
	right: 0;
	width: 2px;
	height: 100%;
	animation: runRight 3s linear infinite;
	animation-delay: 0.75s;
}

.runner-bottom {
	bottom: 0;
	left: 0;
	width: 100%;
	height: 2px;
	animation: runBottom 3s linear infinite;
	animation-delay: 1.5s;
}

.runner-left {
	top: 0;
	left: 0;
	width: 2px;
	height: 100%;
	animation: runLeft 3s linear infinite;
	animation-delay: 2.25s;
}

@keyframes runTop {

	0%,
	100% {
		opacity: 0;
		transform: translateX(-100%);
	}

	5% {
		opacity: 1;
	}

	45% {
		opacity: 1;
		transform: translateX(100%);
	}

	50% {
		opacity: 0;
	}
}

@keyframes runRight {

	0%,
	100% {
		opacity: 0;
		transform: translateY(-100%);
	}

	5% {
		opacity: 1;
	}

	45% {
		opacity: 1;
		transform: translateY(100%);
	}

	50% {
		opacity: 0;
	}
}

@keyframes runBottom {

	0%,
	100% {
		opacity: 0;
		transform: translateX(100%);
	}

	5% {
		opacity: 1;
	}

	45% {
		opacity: 1;
		transform: translateX(-100%);
	}

	50% {
		opacity: 0;
	}
}

@keyframes runLeft {

	0%,
	100% {
		opacity: 0;
		transform: translateY(100%);
	}

	5% {
		opacity: 1;
	}

	45% {
		opacity: 1;
		transform: translateY(-100%);
	}

	50% {
		opacity: 0;
	}
}

@media (max-width: 768px) {
	.slides-container {
		padding: 0 16px 20px;
	}

	.slide-item {
		padding: 10px 20px;
		font-size: 14px;
	}

	.runner-top,
	.runner-bottom {
		height: 1.5px;
	}

	.runner-right,
	.runner-left {
		width: 1.5px;
	}
}
</style>