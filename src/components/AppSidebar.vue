<template>
	<div class="sidebar-menu">
		<div class="sidebar-icons">
			<div class="icon-item" v-for="(category, index) in categories" :key="category.id"
				:class="{ active: activeIcon === category.name }" @click="setActiveIcon(category.name)">
				<img :src="index === 0 ? backgroundIcon : category.image" :alt="category.name" />
				<span>{{ category.name }}</span>
			</div>
		</div>

		<div class="sidebar-content" v-if="showContent">
			<div class="search-bar">
				<input type="text" placeholder="Искать в Зазеркалье" class="search-input" v-model="searchQuery" />
				<img :src="glassIcon" alt="Search Icon" class="search-icon" />
			</div>

			<div class="categories">
				<div class="category" v-for="subcategory in filteredCategories" :key="subcategory.id">
					<div class="category-header" @click="toggleCategory(subcategory.id)">
						<div>
							<span>{{ subcategory.name }}&nbsp;</span>
							<span>({{ subcategory.elements.length }})</span>

						</div>
						<span class="collapse-row-icon" :class="{ rotated: subcategory.open }">
							<img :src="collapseRowIcon" alt="Collapse Row Icon" />
						</span>
					</div>

					<transition name="category-transition">
						<div class="category-content" v-if="subcategory.open">
							<!-- Блок для цветов -->
							<div v-if="isColorCategory(subcategory)" class="color-palette">
								<div v-for="element in subcategory.elements" :key="element.id" class="color-item"
									:style="{ backgroundColor: element.color || '#ccc' }" @click="$emit('add-image', element)"
									:title="element.name || 'Цвет'"></div>
							</div>

							<!-- Блок для шрифтов -->
							<div v-else-if="isFontCategory(subcategory)" class="font-palette">
								<div v-for="element in subcategory.elements" :key="element.id" class="font-item"
									@click="$emit('add-font', element)" :style="{ fontFamily: element.name }">
									{{ element.name }}
								</div>
							</div>

							<!-- Блок для обычных элементов -->
							<template v-else>
								<div class="subcategory" v-for="element in subcategory.elements" :key="element.id">
									<div class="subcategory-header" @dblclick="$emit('add-image', element)">
										<span>
											<img class="img-element" :src="element.image" :alt="element.name" />
										</span>
									</div>
								</div>
							</template>
						</div>
					</transition>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { backgroundIcon, collapseRowIcon, glassIcon } from '@/assets/images/category'
import { mapActions, mapState } from 'vuex'

export default {
	props: {
		showContent: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			backgroundIcon,
			glassIcon,
			collapseRowIcon,
			activeIcon: null,
			searchQuery: ""
		}
	},
	computed: {
		...mapState("category", ["categories"]),

		filteredCategories() {
			if (this.searchQuery.length > 0) {
				const allSubcategories = this.categories.flatMap(
					(category) => category.subcategories || []
				)
				return allSubcategories.filter((subcategory) =>
					subcategory.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
					subcategory.elements.some(el =>
						el.name?.toLowerCase().includes(this.searchQuery.toLowerCase())
					)
				)
			}
			const currentCategory = this.categories.find(
				(category) => category.name === this.activeIcon
			)
			return currentCategory?.subcategories || []
		}
	},
	methods: {
		...mapActions("category", ["fetchCategories"]),

		setActiveIcon(id) {
			this.activeIcon = id
			this.$emit('icon-change', id)
		},

		toggleCategory(id) {
			this.categories.forEach((category) => {
				const subcategory = category.subcategories.find((sub) => sub.id === id)
				if (subcategory) subcategory.open = !subcategory.open
			})
		},

		isColorCategory(subcategory) {
			return subcategory.name.toLowerCase().includes('цвет') ||
				subcategory.elements.some(el => el.color)
		},

		isFontCategory(subcategory) {
			return subcategory.name.toLowerCase().includes('шрифты') ||
				subcategory.elements.some(el => el.url?.includes('fonts'))
		}
	},
	mounted() {
		this.fetchCategories()
	}
}
</script>



<style scoped>
.sidebar-menu {
	--sidebar-width: 80px;
	--content-width: 320px;
	--icon-size: 32px;
	--element-size: 80px;
	--border-color: #e0e3e7;
	--active-bg: #f0f7ff;
	--hover-bg: #f5f8fa;
	--category-bg: #f8fafc;
	--text-color: #2d3748;
	--text-light: #718096;
	--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
	--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
	--transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

	display: flex;
	height: 100vh;
	border-radius: 16px;
	box-shadow: var(--shadow-md);
	background-color: #fff;
	overflow: hidden;
	font-family: 'BerlinType', -apple-system, BlinkMacSystemFont, sans-serif;
}

.color-palette {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
	gap: 12px;
	padding: 8px 0;
}

.color-item {
	width: 40px;
	height: 40px;
	border-radius: 8px;
	cursor: pointer;
	border: 1px solid #e0e3e7;
	transition: all 0.2s ease;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.color-item:hover {
	transform: scale(1.1);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
	.color-palette {
		grid-template-columns: repeat(auto-fill, minmax(32px, 1fr));
		gap: 8px;
	}

	.color-item {
		width: 32px;
		height: 32px;
	}
}


.sidebar-icons {
	width: var(--sidebar-width);
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 16px 0;
	background-color: #f8fafc;
	border-right: 1px solid var(--border-color);
	overflow-y: auto;
	overflow-x: hidden;
	flex-shrink: 0;
}

.sidebar-icons::-webkit-scrollbar {
	width: 4px;
}

.sidebar-icons::-webkit-scrollbar-track {
	background: transparent;
}

.sidebar-icons::-webkit-scrollbar-thumb {
	background-color: rgba(187, 202, 216, 0.6);
	border-radius: 2px;
}

.icon-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 12px;
	cursor: pointer;
	padding: 12px 8px;
	border-radius: 8px;
	transition: var(--transition);
	width: calc(100% - 16px);
	box-sizing: border-box;
	position: relative;
}

.icon-item:hover {
	background-color: var(--hover-bg);
}

.icon-item.active {
	background-color: var(--active-bg);
	box-shadow: var(--shadow-sm);
}

.icon-item.active::before {
	content: '';
	position: absolute;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	width: 3px;
	height: 24px;
	background-color: #496782;
	border-radius: 0 3px 3px 0;
}

.icon-item img {
	width: var(--icon-size);
	height: var(--icon-size);
	margin-bottom: 8px;
	object-fit: contain;
	filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.05));
	transition: transform 0.2s ease;
}

.icon-item:hover img {
	transform: scale(1.1);
}

.icon-item span {
	font-size: 10px;
	font-weight: 500;
	text-align: center;
	color: var(--text-color);
	max-width: 100%;
	word-break: break-word;
	line-height: 1.3;
	letter-spacing: 0.2px;
}

.sidebar-content {
	width: var(--content-width);
	min-width: 260px;
	max-width: var(--content-width);
	height: 100%;
	padding: 16px;
	display: flex;
	flex-direction: column;
	overflow-y: auto;
	scrollbar-width: thin;
	scrollbar-color: #d1dbe6 #fff;
	background-color: #fff;
}

.sidebar-content::-webkit-scrollbar {
	width: 6px;
}

.sidebar-content::-webkit-scrollbar-track {
	background: #fff;
}

.sidebar-content::-webkit-scrollbar-thumb {
	background-color: #d1dbe6;
	border-radius: 3px;
}

.search-bar {
	position: relative;
	width: 100%;
	margin-bottom: 16px;
}

.search-input {
	width: 100%;
	padding: 10px 10px 10px 36px;
	border: 1px solid var(--border-color);
	border-radius: 10px;
	height: 42px;
	font-size: 14px;
	font-weight: 400;
	background-color: #fff;
	box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
	transition: var(--transition);
	color: var(--text-color);
}

.search-input:focus {
	outline: none;
	border-color: #a0b3c6;
	box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(73, 103, 130, 0.1);
}

.search-icon {
	position: absolute;
	left: 12px;
	top: 50%;
	transform: translateY(-50%);
	width: 16px;
	height: 16px;
	opacity: 0.6;
	pointer-events: none;
}

.categories {
	flex: 1;
	overflow-y: auto;
	padding-right: 4px;
}

.category {
	margin-bottom: 20px;
}

.category-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px 14px;
	background-color: var(--category-bg);
	border-radius: 10px;
	cursor: pointer;
	transition: var(--transition);
	user-select: none;
}

.category-header:hover {
	background-color: #edf2f7;
}

.category-header div {
	display: flex;
	align-items: center;
}

.category-header span {
	font-weight: 600;
	font-size: 14px;
	color: var(--text-color);
}

.category-count {
	margin-left: 8px;
	font-size: 12px;
	color: var(--text-light);
	background-color: #e2e8f0;
	padding: 2px 6px;
	border-radius: 10px;
}

.collapse-row-icon {
	transition: var(--transition);
	display: flex;
}

.collapse-row-icon.rotated {
	transform: rotate(180deg);
}

.collapse-row-icon img {
	width: 16px;
	height: 16px;
	opacity: 0.7;
}

.category-content {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(var(--element-size), 1fr));
	gap: 16px;
	padding: 16px 0;
}

.subcategory {
	width: var(--element-size);
	height: var(--element-size);
	position: relative;
}

.img-element {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 8px;
	box-shadow: var(--shadow-sm);
	background-color: #f5f7fa;
	transition: var(--transition);
	cursor: pointer;
}

.img-element:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

/* Адаптивные стили */
@media (max-width: 1024px) {
	.sidebar-menu {
		flex-direction: column-reverse;
		height: auto;
		border-radius: 0;
	}

	.sidebar-icons {
		flex-direction: row;
		width: 100%;
		height: auto;
		padding: 12px 0;
		overflow-x: auto;
		overflow-y: hidden;
		border-right: none;
		border-top: 1px solid var(--border-color);
	}

	.icon-item {
		margin: 0 8px;
		min-width: 64px;
		padding: 8px;
	}

	.icon-item.active::before {
		top: auto;
		left: 50%;
		bottom: 0;
		transform: translateX(-50%);
		width: 24px;
		height: 3px;
		border-radius: 3px 3px 0 0;
	}

	.sidebar-content {
		width: 100%;
		max-width: 100%;
		height: auto;
		max-height: 60vh;
		padding: 16px;
	}

	.search-bar {
		display: none;
	}

	.category-content {
		grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
		gap: 12px;
	}
}

@media (max-width: 480px) {
	.sidebar-icons {
		padding: 8px 0;
	}

	.icon-item {
		min-width: 56px;
	}

	.category-content {
		grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
		gap: 10px;
	}
}
</style>
