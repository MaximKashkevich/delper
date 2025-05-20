<template>
	<div class="slides-container">
		<div class="slides-grid" ref="slidesGrid">
			<div v-for="zone in zones" :key="zone.id" class="slide-card" @click="selectZone(zone.id)">
				<div class="plus-icon">
					<img src="@/assets/images/content/plus.svg" alt="Добавить">
				</div>
				<h3>{{ zone.title }}</h3>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		zones: {
			type: Array,
			required: true
		}
	},
	methods: {
		selectZone(zoneId) {
			this.$emit('zone-selected', zoneId)
			this.$router.push({
				path: '/dashboard',
				query: { zone: zoneId }
			})
		}
	}
}
</script>

<style scoped>
.slides-container {
	padding: 20px;
	position: relative;
}

.slides-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 20px;
	position: relative;
	padding: 10px;
	border-radius: 10px;
	transition: all 0.3s ease;
}

.slide-card {
	background: white;
	border-radius: 10px;
	padding: 30px;
	text-align: center;
	box-shadow: 0 3px 10px rgba(178, 176, 173, 0.2);
	cursor: pointer;
	transition: transform 0.3s, box-shadow 0.3s;
}

.slide-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 5px 15px rgba(178, 176, 173, 0.3);
}

.plus-icon {
	width: 60px;
	height: 60px;
	margin: 0 auto 15px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.plus-icon img {
	width: 100%;
	height: 100%;
	object-fit: contain;
}

.slide-card h3 {
	font-size: 20px;
	color: #26374e;
	margin: 0;
	font-weight: normal;
}

@media (max-width: 768px) {
	.slides-grid {
		grid-template-columns: 1fr;
	}
}
</style>