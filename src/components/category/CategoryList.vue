<template>
  <div class="dashboard-container">
    <div class="sidebar-menu">
      <!-- Первая часть: вертикальная полоса -->
      <div class="sidebar-icons">
        <div class="icon-item" v-for="(category, index) in categories" :key="category.id"
          :class="{ active: activeIcon === category.name }" @click="setActiveIcon(category.name)">
          <img :src="index === 0 ? backgroundIcon : category.image" :alt="category.name" />
          <span>{{ category.name }}</span>
        </div>
      </div>

      <!-- Вторая часть: содержимое -->
      <div class="sidebar-content">
        <!-- Поиск -->
        <div class="search-bar">
          <input type="text" placeholder="Искать в Зазеркалье" class="search-input" v-model="searchQuery" />
          <img :src="glassIcon" alt="Search Icon" class="search-icon" />
        </div>

        <!-- Категории -->
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
            <!-- Элементы -->
            <transition name="category-transition">
              <div class="category-content" v-if="subcategory.open">
                <div class="subcategory" v-for="element in subcategory.elements" :key="element.id">
                  <div class="subcategory-header" @dblclick="addImageToContent(element)">
                    <span><img class="img-element" :src="element.image" /></span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <!-- Перетаскиваемые изображения -->
      <div v-for="(image, index) in droppedImages" :key="index" class="dropped-image"
        @mousedown="startDrag(image, $event)"
        :style="{ top: `${image.y}px`, left: `${image.x}px`, width: `${image.width}px`, height: `${image.height}px` }">
        <div class='images-buttons'>
          <img :src="keyIcon" alt="key">
          <img :src="copyIcon" alt="copy" @click='copyImage(image.id)'>
          <img :src="mirrorIcon" alt="mirror" @click='mirrorFun(image.id)'>
          <div>
            <img :src="indexIcon" alt="index">
            <div class='index-range'>
              <span>Прозрачность</span>
              <input type="range" min='0' max='100' step='1' />
              <span>70%</span>
            </div>
          </div>

          <img :src="layersIcon" alt="layers">
          <img :src="settingsIcon" alt="settings">
        </div>

        <div class='images-utils'>
          <img :src="deleteImage" @click='deleteImageById(image.id)' alt="deleteImage">
          <img :src="rotate" alt="rotate" @click='rotateImage(image.id)'>
        </div>


        <!-- Применяем width и height к изображению -->
        <img :src="image.src" alt="Dropped image" :style="{
          width: `${image.width}px`,
          height: `${image.height}px`,
          transform: image.flip ? `scaleX(-1) rotate(${image.rotate}deg)` : `rotate(${image.rotate}deg)`,
          transition: 'transform 0.3s'
        }" />
        <!-- Границы для изменения размеров -->
        <div class="border-bottom" @mousedown.stop="startResize(image, $event, ' bottom')">
        </div>
        <div class="border-right" @mousedown.stop="startResize(image, $event, 'right')"></div>
        <div class="border-left" @mousedown.stop="startResize(image, $event, 'left')"></div>
        <div class="border-top" @mousedown.stop="startResize(image, $event, 'top')"></div>
        <div class="border-bottom-right" @mousedown.stop="startResize(image, $event, 'bottom-right')"></div>
        <div class="border-bottom-left" @mousedown.stop="startResize(image, $event, 'bottom-left')"></div>
        <div class="border-top-right" @mousedown.stop="startResize(image, $event, 'top-right')"></div>
        <div class="border-top-left" @mousedown.stop="startResize(image, $event, 'top-left')"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { backgroundIcon, collapseRowIcon, glassIcon } from '@/assets/images/category'
import { copyIcon, deleteImage, indexIcon, keyIcon, layersIcon, mirrorIcon, rotate, settingsIcon } from '@/assets/images/content'
import { ref } from 'vue'
import { mapActions, mapState } from "vuex"
import {
  useDrag,
  useResize
} from '../../lib'

export default {
  data() {
    return {
      //button images
      keyIcon,
      copyIcon,
      mirrorIcon,
      indexIcon,
      layersIcon,
      settingsIcon,
      //utils images
      deleteImage,
      rotate,
      //icons
      backgroundIcon,
      glassIcon,
      collapseRowIcon,
      // sidebar
      errorMessage: "",
      successMessage: "",
      activeIcon: null,
      searchQuery: "",

      // content
      droppedImages: [],
      id: 0,

      // New flag to track range input interaction
      isRangeDragging: false,
    }
  },
  computed: {
    ...mapState("category", ["categories", "fetchCategoriesSuccess"]),
    filteredCategories() {
      if (this.searchQuery.length > 0) {
        const allSubcategories = this.categories.flatMap(
          (category) => category.subcategories || []
        )
        return allSubcategories.filter((subcategory) =>
          subcategory.name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase())
        )
      }
      const currentCategory = this.categories.find(
        (category) => category.name === this.activeIcon
      )
      return currentCategory && Array.isArray(currentCategory.subcategories)
        ? currentCategory.subcategories
        : []
    },
  },
  methods: {
    ...mapActions("category", ["fetchCategories"]),
    setActiveIcon(id) {
      this.activeIcon = id
    },
    toggleCategory(id) {
      this.categories.forEach((category) => {
        const subcategory = category.subcategories.find((sub) => sub.id === id)
        if (subcategory) subcategory.open = !subcategory.open
      })
    },

    deleteImageById(id) {
      this.droppedImages = this.droppedImages.filter((image) => image.id !== id)
    },

    rotateImage(id) {
      const image = this.droppedImages.find((image) => image.id === id)

      console.log(image)

      if (image) {
        image.rotate += 90
      }
    },

    copyImage(id) {
      const image = this.droppedImages.find((image) => image.id === id)

      if (image) {
        this.droppedImages.push({
          id: this.id++,
          src: image.src,
          x: image.x + 10,
          y: image.y + 10,
          width: image.width,
          height: image.height,
          rotate: image.rotate
        })
      }
    },

    mirrorFun(id) {
      const image = this.droppedImages.find(image => image.id === id)

      if (image) {
        image.flip = !image.flip
      }
    },


    // content
    addImageToContent(element) {
      this.droppedImages.push({
        id: this.id++,
        src: element.image,
        x: 100,
        y: 100,
        width: 200,
        height: 200,
        rotate: 0
      })
    },
  },
  setup() {
    const droppedImages = ref([])

    const { startDrag } = useDrag()
    const { startResize } = useResize(droppedImages)

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      droppedImages,
      startDrag,
      startResize,
    }
  },
  created() {
    this.fetchCategories() // Загружаем категории при создании компонента
  },


}
</script>



<style scoped>
.dashboard-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* КОНТЕНТ */

.img-element {
  cursor: pointer;
}

.dropped-image {
  position: absolute;
  border: 1px solid rgba(187, 202, 216, 1);
  border-radius: 5px;
  cursor: grab;
}

.dropped-image:active {
  cursor: grabbing;
}

/* Кастомизированный бордюр */
.dropped-image::before,
.dropped-image::after,
.dropped-image .border-bottom,
.dropped-image .border-right,
.dropped-image .border-left,
.dropped-image .border-top,
.dropped-image .border-bottom-right,
.dropped-image .border-bottom-left,
.dropped-image .border-top-right,
.dropped-image .border-top-left {
  content: '';
  position: absolute;
  background-color: rgba(187, 202, 216, 1);
  z-index: 1;
}

/* Горизонтальные линии (верх и низ) */
.dropped-image::before {
  width: 30px;
  height: 4px;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  cursor: ns-resize;
}

.dropped-image .border-bottom {
  width: 30px;
  height: 4px;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  cursor: ns-resize;
}

/* Вертикальные линии (лево и право) */
.dropped-image::after {
  width: 4px;
  height: 30px;
  left: -2px;
  top: 50%;
  transform: translateY(-50%);
  cursor: ew-resize;
}

.dropped-image .border-right {
  width: 4px;
  height: 30px;
  right: -2px;
  top: 50%;
  transform: translateY(-50%);
  cursor: ew-resize;
}

.dropped-image .border-left {
  width: 4px;
  height: 30px;
  left: -2px;
  top: 50%;
  transform: translateY(-50%);
  cursor: ew-resize;
}

.dropped-image .border-top {
  width: 30px;
  height: 4px;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  cursor: ns-resize;
}

/* Угловые линии */
.dropped-image .border-bottom-right {
  width: 10px;
  height: 10px;
  bottom: -2px;
  right: -2px;
  cursor: se-resize;
}

.dropped-image .border-bottom-left {
  width: 10px;
  height: 10px;
  bottom: -2px;
  left: -2px;
  cursor: sw-resize;
}

.dropped-image .border-top-right {
  width: 10px;
  height: 10px;
  top: -2px;
  right: -2px;
  cursor: ne-resize;
}

.dropped-image .border-top-left {
  width: 10px;
  height: 10px;
  top: -2px;
  left: -2px;
  cursor: nw-resize;
}

.images-buttons {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  /* Располагаем кнопки выше картинки */
  top: -35%;
  left: 50%;
  border-radius: 5px;
  transform: translateX(-50%);
  /* Центрируем кнопки относительно картинки */
  width: 204px;
  height: 34px;
  cursor: pointer;
  background: #ffff;

  box-shadow:
    0 2px 4px rgba(128, 117, 116, 0.05),
    0 4px 8px rgba(128, 117, 116, 0.08),
    0 8px 12px rgba(128, 117, 116, 0.1);
}

.images-buttons img:hover {
  background-color: #ece7e7;
  border-radius: 5px;
  transition: ease-in-out 0.4s;
}

.images-utils {
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  top: -45px;
  gap: 20px;
  z-index: 1;
  cursor: pointer;
}

.index-range {
  position: absolute;
  background: #fff;
  z-index: 1000;
  /* Увеличено значение */
  box-shadow:
    0 2px 4px rgba(128, 117, 116, 0.05),
    0 4px 8px rgba(128, 117, 116, 0.08),
    0 8px 12px rgba(128, 117, 116, 0.1);
  display: flex;
  align-items: center;
  padding: 5px;
  gap: 10px;
  border-radius: 8px;
}

.index-range input {
  width: 110px;
  height: 4px;
  background: #fff;
  cursor: pointer;
  z-index: 1000000;
  position: relative;
}


.content {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #f9f9f9;
}

/* Основной блок */
.sidebar-menu {
  display: flex;
  width: 370px;
  height: 100vh;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  margin: 20px;
  overflow: hidden;
}

/* Вертикальная полоса */
.sidebar-icons {
  width: 76px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  background-color: #f9f9f9;
  border-right: 1px solid #999999;
}

.sidebar-icons span {
  font-family: 'BerlinType';
  font-weight: 100;
}

::-webkit-scrollbar-thumb {
  -webkit-border-radius: 10px;
  border-radius: 10px;
  background: rgba(255, 0, 0, 0.8);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 7px;
  cursor: pointer;
  padding: 10px 15px 10px 15px;
  border-radius: 5px;
}

.icon-item.active {
  box-shadow: 2px 2px 4px 0px #E5E5E5 inset;
}

.icon-item img {
  width: 32px;
  height: 32px;
  margin-bottom: 5px;
}

.icon-item span {
  font-size: 9px;
  text-align: center;
  max-width: 35px;
  text-overflow: unset;
}

/* Содержимое */
.sidebar-content {
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  scrollbar-color: #BBCAD8 #fff;
  scrollbar-width: thin;
}

.search-bar {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.search-bar input {
  font-family: 'BerlinType';
  font-weight: 100;
}

.search-input {
  width: 100%;
  padding: 8px 8px 8px 32px;
  /* Отступ слева для иконки */
  border: 1px solid #e5e5e5;
  font-size: 14px;
  background-color: #fff;
  box-shadow: 1px 1px 3px 0px #00000017 inset;
  border-radius: 10px;
  height: 40px;
}

.search-icon {
  position: absolute;
  left: 10px;
  /* Расстояние от левого края инпута */
  width: 14px;
  height: 15px;
  pointer-events: none;
  /* Чтобы иконка не мешала вводу текста */
}

/* Категории */
.categories {
  display: flex;
  flex-direction: column;
}

.category {
  margin-bottom: 15px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.category-header span {
  font-family: 'BerlinType';
  font-weight: 900;
}

.collapse-row-icon {
  display: inline-block;
  transition: transform 0.3s ease;
}

.collapse-row-icon.rotated {
  transform: rotate(180deg);
}

span.collapse-row-icon {
  line-height: 1em;
}

.category-content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  margin-top: 10px;
  overflow: hidden;
  padding: 10px;
}

.category-transition-enter-active,
.category-transition-leave-active {
  transition: max-height 0.6s ease, opacity 0.6s ease;
  overflow: hidden;
}

.category-transition-enter-from,
.category-transition-leave-to {
  max-height: 0;
  opacity: 0;
}

.category-transition-enter-to,
.category-transition-leave-from {
  max-height: 500px;
  /* Установите максимальную высоту, подходящую для контента */
}



/* Анимация collapse */

.subcategory img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
