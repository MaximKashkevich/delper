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
          <div class="category" v-for="subcategory in this.categories" :key="subcategory.id">
            <div class="category-header" @click="toggleCategory(subcategory.id)">
              <div>
                <span>{{ subcategory.name }}&nbsp;</span>
                <!-- <span>({{ subcategory.elements.length }})</span> -->
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
      <div v-for="(image, index) in droppedImages" :key="index" class="dropped-image-container"
        :class="{ active: activeImageId === image.id }" :style="{
          top: `${image.y}px`,
          left: `${image.x}px`,
          zIndex: image.zIndex
        }" @mousedown="activeImageId = image.id" @mouseenter="activeImageId = image.id">

        <div class='images-buttons'>
          <img :src="keyIcon" alt="key" @click='keyFun(image.id)'>
          <img :src="copyIcon" alt="copy" @click='copyImage(image.id)'>
          <img :src="mirrorIcon" alt="mirror" @click='mirrorFun(image.id)'>
          <div class='indexIcon'>
            <img :src="indexIcon" alt="index">
            <div class="index-block-input">
              <span class='index-text'>Прозрачность</span>
              <input type="range" class='index-range' min='0' max='100' step='1'
                :value="Math.round(image.opacity * 100)" @input="(e) => onChangeOpacity(e, image.id)">
              <span class='index-procent'>{{ Math.round(image.opacity * 100) }}%</span>
            </div>
          </div>
          <div class='layrs-block'>
            <img :src="layersIcon" alt="layers">
            <div class="layers-z-container">
              <div class="layers-z-block">
                <img :src="up" alt="up">

                <span class='layers-text' @click.stop="changeZIndex('up', image.id)">Вверх</span>

              </div>
              <div class="layers-z-block">
                <img :src="upFull" alt="up">

                <span class='layers-text' @click.stop="changeZIndex('top', image.id)">На передний плане</span>

              </div>
              <div class="layers-z-block">
                <img :src="down" alt="up">

                <span class='layers-text' @click.stop="changeZIndex('down', image.id)">Вниз</span>

              </div>
              <div class="layers-z-block">
                <img :src="downFull" alt="up">
                <span class='layers-text' @click.stop="changeZIndex('bottom', image.id)">На задний плане</span>
              </div>
            </div>
          </div>

          <div class="settings-block">
            <img :src="settingsIcon" alt="settings">
            <div class="settings-inputs">
              <div class="settings-inputs-block">
                <span class='settings-text'>Экспозиция</span>
                <input type="range" class='settings-input' @input="updateFilter($event, 'exposure')" min="-100"
                  max="100" :value="activeImage?.filters?.exposure || 0">
                <span class='settings-number'>{{ activeImage?.filters?.exposure || 0 }}</span>
              </div>
              <div class="settings-inputs-block">
                <span class='settings-text'>Контраст</span>
                <input type="range" class='settings-input' @input="updateFilter($event, 'contrast')" min="-100"
                  max="100" :value="activeImage?.filters?.contrast || 0">
                <span class='settings-number'>{{ activeImage?.filters?.contrast || 0 }}</span>
              </div>
              <div class="settings-inputs-block">
                <span class='settings-text'>Насыщенность</span>
                <input type="range" class='settings-input' @input="updateFilter($event, 'saturation')" min="-100"
                  max="100" :value="activeImage?.filters?.saturation || 0">
                <span class='settings-number'>{{ activeImage?.filters?.saturation || 0 }}</span>
              </div>
              <div class="settings-inputs-block">
                <span class='settings-text'>Температура</span>
                <input type="range" class='settings-input' @input="updateFilter($event, 'temperature')" min="-100"
                  max="100" :value="activeImage?.filters?.temperature || 0">
                <span class='settings-number'>{{ activeImage?.filters?.temperature || 0 }}</span>
              </div>
              <div class="settings-inputs-block">
                <span class='settings-text'>Оттенок</span>
                <input type="range" class='settings-input' @input="updateFilter($event, 'hue')" min="-100" max="100"
                  :value="activeImage?.filters?.hue || 0">
                <span class='settings-number'>{{ activeImage?.filters?.hue || 0 }}</span>
              </div>
              <div class="settings-inputs-block">
                <span class='settings-text'>Светлые области</span>
                <input type="range" class='settings-input' @input="updateFilter($event, 'highlights')" min="-100"
                  max="100" :value="activeImage?.filters?.highlights || 0">
                <span class='settings-number'>{{ activeImage?.filters?.highlights || 0 }}</span>
              </div>
              <div class="settings-inputs-block">
                <span class='settings-text'>Тени</span>
                <input type="range" class='settings-input' @input="updateFilter($event, 'shadows')" min="-100" max="100"
                  :value="activeImage?.filters?.shadows || 0">
                <span class='settings-number'>{{ activeImage?.filters?.shadows || 0 }}</span>
              </div>
            </div>
          </div>

        </div>

        <div class='images-utils'>
          <img :src="deleteImage" @click='deleteImageById(image.id)' alt="deleteImage">
          <img :src="rotate" alt="rotate" @click='rotateImage(image.id)'>
        </div>

        <img :src="image.src" alt="Dropped image" class="resizable-image" :style="getImageStyle(image)"
          @mousedown="startDrag(image, $event)" />

        <!-- Resize handles -->
        <div class="resize-handle resize-handle-left" @mousedown.stop="startResize(image, $event, 'left')"></div>
        <div class="resize-handle resize-handle-right" @mousedown.stop="startResize(image, $event, 'right')"></div>
        <div class="resize-handle resize-handle-top" @mousedown.stop="startResize(image, $event, 'top')"></div>
        <div class="resize-handle resize-handle-bottom" @mousedown.stop="startResize(image, $event, 'bottom')"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { backgroundIcon, collapseRowIcon, glassIcon } from '@/assets/images/category'
import { copyIcon, deleteImage, down, downFull, indexIcon, keyIcon, layersIcon, mirrorIcon, rotate, settingsIcon, up, upFull } from '@/assets/images/content'
import { mapActions, mapState } from "vuex"
import { useDrag, useResize } from '../../lib'
import { updateRangeFill as updateRangeFillUtil } from '../../lib/filter-utils'
import {
  addImageToContent as addImageUtil,
  changeOpacity as changeOpacityUtil,
  copyImage as copyImageUtil,
  deleteImageById as deleteImageUtil,
  mirrorImage as mirrorImageUtil,
  rotateImage as rotateImageUtil,
  toggleImageLock as toggleImageLockUtil
} from '../../lib/image-utils'
import { changeZIndex as changeZIndexUtil } from '../../lib/layer-utils'

export default {
  data() {
    return {
      // button images
      keyIcon,
      copyIcon,
      mirrorIcon,
      indexIcon,
      layersIcon,
      settingsIcon,
      up,
      upFull,
      down,
      downFull,
      // utils images
      deleteImage,
      rotate,
      // icons
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
      activeImageId: null,
      id: 0,
      isRangeDragging: false,
      // drag and resize
      startDrag: null,
      startResize: null
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
          subcategory.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }
      const currentCategory = this.categories.find(
        (category) => category.name === this.activeIcon
      )

      console.log(this.categories)
      return currentCategory?.subcategories || []
    },
    activeImage() {
      return this.droppedImages.find(img => img.id === this.activeImageId)
    }
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
    addImageToContent(element) {
      const result = addImageUtil(this.droppedImages, this.id, element)
      this.droppedImages = result.droppedImages
      this.id = result.newIdCounter
      this.activeImageId = result.newImage.id
      this.$nextTick(() => {
        this.applyFilters(result.newImage)
      })
    },
    deleteImageById(id) {
      this.droppedImages = deleteImageUtil(this.droppedImages, id)
    },
    rotateImage(id) {
      this.droppedImages = rotateImageUtil(this.droppedImages, id)
    },
    copyImage(id) {
      const result = copyImageUtil(this.droppedImages, id, this.id)
      if (!result.copiedImage) return // Добавляем проверку

      this.droppedImages = result.droppedImages
      this.id = result.idCounter
      this.activeImageId = result.copiedImage.id
      this.$nextTick(() => {
        this.applyFilters(result.copiedImage)
      })
    },
    mirrorFun(id) {
      this.droppedImages = mirrorImageUtil(this.droppedImages, id)
    },
    onChangeOpacity(event, id) {
      this.droppedImages = changeOpacityUtil(this.droppedImages, event, id)
    },
    keyFun(id) {
      this.droppedImages = toggleImageLockUtil(this.droppedImages, id)
    },
    changeZIndex(action, imageId) {
      this.droppedImages = changeZIndexUtil(this.droppedImages, action, imageId)
      this.activeImageId = imageId
    },
    updateRangeFill(event) {
      updateRangeFillUtil(event)
    },
    initDragResize() {
      const { startDrag } = useDrag()
      const { startResize } = useResize()
      this.startDrag = startDrag
      this.startResize = (image, event, direction) => {
        startResize(this.droppedImages, image, event, direction)
      }
    },

    // Методы для работы с фильтрами
    updateFilter(event, filterName) {
      if (!this.activeImage) return

      const value = Number(event.target.value)
      this.activeImage.filters[filterName] = value

      // Обновляем отображение значения
      event.target.nextElementSibling.textContent = value

      // Применяем фильтры
      this.applyFilters(this.activeImage)
      this.updateRangeFill(event)
    },

    getImageStyle(image) {
      return {
        width: `${image.width}px`,
        height: `${image.height}px`,
        transform: image.flip ? `scaleX(-1) rotate(${image.rotate}deg)` : `rotate(${image.rotate}deg)`,
        transition: 'transform 0.3s',
        opacity: `${image.opacity}`,
        filter: this.generateFilterString(image.filters),
        boxShadow: this.generateShadowEffect(image.filters.shadows)
      }
    },

    applyFilters(image) {
      const imgElement = document.querySelector(`[data-id="${image.id}"]`)
      if (imgElement) {
        this.applyComplexEffects(imgElement, image.filters)
      }
    },

    generateFilterString(filters) {
      const {
        exposure,
        contrast,
        saturation,
        hue,
        temperature
      } = filters

      let filterStr = `
        brightness(${1 + exposure / 200})
        contrast(${1 + contrast / 100})
        saturate(${1 + saturation / 100})
        hue-rotate(${hue}deg)
      `

      // Температура (теплые/холодные тона)
      if (temperature > 0) {
        filterStr += `sepia(${temperature / 200}) hue-rotate(-${temperature / 5}deg)`
      } else if (temperature < 0) {
        filterStr += `hue-rotate(${Math.abs(temperature) / 5}deg) brightness(0.95)`
      }

      return filterStr
    },

    generateShadowEffect(shadowValue) {
      const intensity = Math.abs(shadowValue) / 20
      if (shadowValue > 0) {
        return `0 0 ${intensity}px ${intensity}px rgba(0,0,0,0.5)`
      } else if (shadowValue < 0) {
        return `0 0 ${intensity}px ${intensity}px rgba(255,255,255,0.5)`
      }
      return 'none'
    },

    applyComplexEffects(element, filters) {
      const { highlights } = filters

      // Создаем или находим overlay элемент
      let overlay = element.querySelector('.image-effects-overlay')
      if (!overlay) {
        overlay = document.createElement('div')
        overlay.className = 'image-effects-overlay'
        element.appendChild(overlay)
      }

      // Градиент для светлых областей
      const highlightOpacity = Math.max(0, highlights / 100)
      overlay.style.background = `
        linear-gradient(
          to bottom,
          rgba(255, 255, 255, ${highlightOpacity}) 0%,
          transparent 50%
        )
      `
    },

    // При активации изображения обновляем значения ползунков
    updateSliderValues(filters) {
      const sliderNames = [
        'exposure', 'contrast', 'saturation',
        'temperature', 'hue', 'highlights', 'shadows'
      ]

      sliderNames.forEach((name, index) => {
        const input = this.$el.querySelectorAll('.settings-input')[index]
        if (input) {
          input.value = filters[name]
          input.nextElementSibling.textContent = filters[name]
          this.updateRangeFill({ target: input })
        }
      })
    }
  },
  watch: {
    activeImageId(newId) {
      const image = this.droppedImages.find(img => img.id === newId)
      if (image) {
        this.updateSliderValues(image.filters)
      }
    }
  },
  created() {
    this.fetchCategories()
    this.initDragResize()
  }
}
</script>



<style scoped>
@media(max-width: 1024px) {
  .dashboard-container {
    display: flex;
    flex-direction: column-reverse;
    height: 100vh;
    margin: 10px;
  }

  .content {
    width: 100% !important;
    height: 70vh !important;
  }

  .sidebar-menu {
    width: 100% !important;
    height: 30vh !important;
    flex-direction: column-reverse !important;
    align-items: center !important;
    display: flex;
    overflow: auto !important;
  }

  .search-bar {
    display: none !important;
  }

  .sidebar-icons {
    overflow: auto !important;
    display: flex;
    flex-direction: row !important;
    flex: 1 !important;
    width: 100% !important;
    flex-wrap: nowrap !important;
    justify-content: flex-start !important;
    overflow-y: hidden !important;
    border-right: none !important;
  }

  .icon-item {
    width: 100% !important;
  }

  .sidebar-content {
    overflow: auto !important;
    display: flex;
    flex-direction: row !important;
    flex: 1 !important;
    width: 100% !important;
  }
}


.dashboard-container {
  display: flex;
  justify-content: space-between;
  align-items: center
}

.img-element {
  cursor: pointer
}

.dropped-image-container {
  position: absolute;
  will-change: transform;
  cursor: grab
}

.dropped-image-container:active {
  cursor: grabbing;
  z-index: 100
}

.resizable-image {
  display: block;
  position: relative;
  border: 1px solid #bbcad8;
  border-radius: 5px
}

.resize-handle {
  position: absolute;
  background-color: #bbcad8;
}

.resize-handle-left,
.resize-handle-right {
  width: 4px;
  height: 30px;
  top: 50%;
  transform: translateY(-50%);
  cursor: ew-resize
}

.resize-handle-left {
  left: -2px
}

.resize-handle-right {
  right: -2px
}

.resize-handle-top,
.resize-handle-bottom {
  width: 30px;
  height: 4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: ns-resize;
  z-index: 10;
}

.resize-handle-top {
  top: -2px
}

.resize-handle-bottom {
  bottom: -2px
}

.images-buttons {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  top: -35%;
  left: 50%;
  border-radius: 5px;
  transform: translateX(-50%);
  width: 204px;
  height: 34px;
  cursor: pointer;
  background: #fff;
  z-index: calc(var(--image-zindex, 1) + 1);
  box-shadow: 0 2px 4px rgba(128, 117, 116, .05), 0 4px 8px rgba(128, 117, 116, .08), 0 8px 12px rgba(128, 117, 116, .1)
}

.images-buttons img:hover {
  background-color: #ece7e7;
  border-radius: 5px;
  transition: ease-in-out .4s
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
  cursor: pointer
}

.index-block-input {
  position: absolute;
  gap: 10px;
  display: none;
  justify-content: space-between;
  align-items: center;
  z-index: 99999;
  padding: 5px;
  border-radius: 5px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(128, 117, 116, .05), 0 4px 8px rgba(128, 117, 116, .08), 0 8px 12px rgba(128, 117, 116, .1)
}

.indexIcon:hover .index-block-input {
  display: flex
}

.index-text,
.index-procent {
  white-space: nowrap;
  color: #26374e;
  font-size: 14px;
  font-weight: 600
}

.index-range {
  height: 4px;
  min-width: 150px;
}

.layers-z-container {
  position: absolute;
  display: none;
  flex-direction: column;
  gap: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(128, 117, 116, .05), 0 4px 8px rgba(128, 117, 116, .08), 0 8px 12px rgba(128, 117, 116, .1);
  padding: 10px;
  border-radius: 5px
}

.layers-z-block {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer
}

.layers-text {
  color: #26374e;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  text-align: left;
  line-height: 120%
}

.layrs-block:hover .layers-z-container {
  display: flex
}

.settings-inputs {
  position: absolute;
  background: #fff;
  box-shadow: 0 2px 4px rgba(128, 117, 116, .05), 0 4px 8px rgba(128, 117, 116, .08), 0 8px 12px rgba(128, 117, 116, .1);
  border-radius: 5px;
  display: none;
  gap: 10px;
  flex-direction: column;
  align-items: stretch;
  padding: 10px;
  min-width: 220px;
}

.settings-block:hover .settings-inputs {
  display: flex;
}

.settings-inputs-block {
  display: grid;
  grid-template-columns: 110px 150px 40px;
  align-items: center;
  gap: 10px;
}

.settings-text {
  color: #26374e;
  font-size: 14px;
  font-weight: 600;
  line-height: 120%;
  white-space: nowrap;
  text-align: left;
}

.settings-number {
  color: #26374e;
  font-size: 14px;
  font-weight: 600;
  line-height: 120%;
  white-space: nowrap;
  text-align: right;
}

.settings-input {
  width: 150px;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
  cursor: pointer;
  background: linear-gradient(to right,
      #e0e4e8 0,
      var(--left-fill, 50%),
      #496782 0,
      var(--right-fill, 50%),
      #e0e4e8 0);
  border-radius: 10px;
  outline: none;
}

.settings-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #496782;
  cursor: pointer;
}

.image-effects-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  mix-blend-mode: overlay;
  z-index: 1;
}

.content {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #f9f9f9;
  z-index: 0;
  border-radius: 10px;
}

.sidebar-menu {
  display: flex;
  width: 35%;
  height: 100vh;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  margin: 20px;
  overflow: hidden;
}

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
  width: 14px;
  height: 15px;
  pointer-events: none;
}

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
}

.subcategory img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
