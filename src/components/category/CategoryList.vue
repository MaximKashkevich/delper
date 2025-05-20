<template>
  <AppHeader :current-page="currentGuidePage" @update-page="handlePageChange" />
  <AppGuide v-if="showGuide" :initial-page="currentPage" @close="closeGuide" @update-page="handlePageChange" />

  <div class="app-container">
    <AppSidebar :show-content="shaw.sidebar" @add-image="addImageToContent" @add-font="addFontToContent"
      @icon-change="setActiveIcon" />

    <div class="main-content-wrapper">
      <div class="slides-section">
        <AppContentSlides :slides="fotozones" :activeSlideId="activeZoneId" @slide-change="onSlideChange" />

      </div>

      <div class="content-section" @click="handleContentClick" ref="contentRef">
        <div v-if="shaw.content">
          <div v-if="showEmptyMessage" class="empty-content-message">
            {{ emptyMessageText }}
          </div>

          <div class="utils-block">
            <img :src="deleteCONTENT" alt="deleteElement" @click="clearContent" />
            <span class="downloadImage" @click="downloadContent">скачать изображение</span>
            <img :src="save" alt="save" @click="openSaveModal" />
          </div>

          <AppSaveProjectModal :visible="showSaveModal" :current-zone-title="currentZoneTitle"
            :project-data="currentProjectData" @close="showSaveModal = false" @save="handleProjectSave" />
          <AppSaveSuccessModal :visible="showSuccessModal" :projectName="savedProjectName"
            @close="showSuccessModal = false" @continue="showSuccessModal = false" @goto-projects="goToProjectsPage" />

          <!-- Фоновые элементы -->
          <template v-for="(item, index) in droppedImages.filter(img => img?.isBackground)">
            <div v-if="item?.isColor" :key="`bg-color-${index}`" class="background-color"
              :style="{ backgroundColor: item?.color }" />
            <div v-else :key="`bg-image-${index}`" class="background-image-container">
              <img :src="item?.src" alt="Background" />
            </div>
          </template>

          <!-- Основной контент -->
          <template v-for="(item, index) in droppedImages.filter(i => i && !i.isBackground)"
            :key="getItemKey(item, index)">
            <div class="dropped-image-container" :class="{
              'active': activeItemId === item?.id,
              'show-controls': activeItemId === item?.id && showControls,
              'locked': item?.locked
            }" :style="getItemStyle(item)" @click.stop="handleItemClick(item?.id)">

              <!-- Отображение текстового элемента -->
              <div v-if="item.type === 'text'" class="text-element-wrapper"
                @mousedown="handleItemMouseDown(item, $event)">
                <input v-model="item.text" :style="getFontStyle(item)" class="content-input" placeholder="Введите текст"
                  @mousedown="(e) => e.stopPropagation()" />
              </div>

              <!-- Графическое изображение -->
              <template v-if="item?.src && item.type !== 'text'">
                <img :src="item.src" alt="Content element" class="resizable-image" :style="getImageStyle(item)"
                  :data-image-id="item.id" @mousedown.stop="handleItemMouseDown(item, $event)" />
              </template>

              <!-- Контролы для других элементов -->
              <div v-if="activeItemId === item?.id && showControls" class="item-controls">
                <div class="images-buttons">
                  <!-- Кнопка блокировки -->
                  <img :src="keyIcon" @click.stop="toggleLock(item.id)" :class="{ 'active': item.locked }" />

                  <!-- Кнопка копирования -->
                  <img :src="copyIcon" @click.stop="copyItem(item.id)" />

                  <!-- Кнопка отражения -->
                  <img :src="mirrorIcon" @click.stop="mirrorFun(item.id)" v-if="item.type !== 'text'" />

                  <!-- Управление прозрачностью -->
                  <div class="indexIcon">
                    <img :src="indexIcon" />
                    <div class="index-block-input">
                      <span>Прозрачность</span>
                      <input type="range" :value="Math.round((item.opacity ?? 1) * 100)"
                        @input="e => onChangeOpacity(e, item.id)" />
                      <span>{{ Math.round((item.opacity ?? 1) * 100) }}%</span>
                    </div>
                  </div>

                  <!-- Управление слоями -->
                  <div class="layers-control">
                    <img :src="layersIcon" />
                    <div class="layers-menu">
                      <div @click.stop="changeZIndex('front', item.id)">
                        <img :src="upFull" /> На передний план
                      </div>
                      <div @click.stop="changeZIndex('up', item.id)">
                        <img :src="up" /> Вверх
                      </div>
                      <div @click.stop="changeZIndex('down', item.id)">
                        <img :src="down" /> Вниз
                      </div>
                      <div @click.stop="changeZIndex('back', item.id)">
                        <img :src="downFull" /> На задний план
                      </div>
                    </div>
                  </div>

                  <!-- Настройки фильтров -->
                  <div class="settings-block" v-if="item.type !== 'text'">
                    <img :src="settingsIcon" alt="settings">
                    <div class="settings-inputs">
                      <div class="settings-inputs-block" v-for="filter in filtersList" :key="filter.name">
                        <span class='settings-text'>{{ getFilterLabel(filter.name) }}</span>
                        <input type="range" class='settings-input' :ref="el => setSliderRef(filter.name, el)"
                          @input="e => updateFilter(filter.name, e.target.value, item.id)" :min="filter.min"
                          :max="filter.max" :step="filter.step" :value="item.filters[filter.name] || 0" />
                        <span class='settings-number'>{{ item.filters[filter.name] || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="images-utils">
                  <img :src="deleteImage" @click.stop="deleteItem(item.id)" />
                  <img :src="rotate" @click.stop="rotateItem(item.id)" />
                </div>
              </div>

              <!-- Ресайз хендлы для всех элементов (включая текст) -->
              <template v-if="activeItemId === item?.id && showControls && !item?.locked">
                <div
                  v-for="handle in ['right', 'left', 'bottom', 'top', 'top-right', 'top-left', 'bottom-left', 'bottom-right']"
                  :key="handle" class="resize-handle" :class="`resize-handle-${handle}`"
                  @mousedown.stop="startResize(item, $event, handle)"></div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { backgroundIcon, collapseRowIcon, glassIcon } from '@/assets/images/category'
import { copyIcon, deleteContent, deleteCONTENT, deleteImage, down, downFull, indexIcon, keyIcon, layersIcon, mirrorIcon, rotate, save, settingsIcon, up, upFull } from '@/assets/images/content'
import { AppContentSlides, AppGuide, AppHeader, AppSaveProjectModal, AppSaveSuccessModal, AppSidebar } from '@/components/index'
import html2canvas from 'html2canvas'
import { mapActions, mapState } from "vuex"
import { useDrag, useResize } from '../../lib'
import {
  deleteImageById as deleteImageUtil,
  rotateImage as rotateImageUtil
} from '../../lib/image-utils'
export default {
  components: {
    AppHeader, AppContentSlides,
    AppSaveProjectModal,
    AppSidebar,
    AppSaveSuccessModal,
    AppGuide
  },
  data() {
    return {
      keyIcon,
      copyIcon,
      mirrorIcon,
      indexIcon,
      layersIcon,
      settingsIcon,
      up,
      upFull,
      deleteCONTENT,
      down,
      downFull,
      deleteContent,
      save,
      deleteImage,
      rotate,
      backgroundIcon,
      glassIcon,
      collapseRowIcon,
      errorMessage: "",
      successMessage: "",
      activeIcon: null,
      searchQuery: "",
      droppedImages: [],
      activeImageId: null,
      id: 0,
      isRangeDragging: false,
      startDrag: null,
      startResize: null,

      sliderRefs: {
        exposure: null,
        contrast: null,
        saturation: null,
        temperature: null,
        hue: null,
        highlights: null,
        shadows: null
      },

      shaw: {
        content: true,
        sidebar: true
      },

      fotozones: [
        {
          id: 0,
          title: 'выездной регистрации',
          images: [],
          settings: {},
          activeImageId: null,
          showControls: false
        },
        {
          id: 1,
          title: 'фотозоны',
          images: [],
          settings: {},
          activeImageId: null,
          showControls: false
        },
        {
          id: 2,
          title: 'столов гостей',
          images: [],
          settings: {},
          activeImageId: null,
          showControls: false
        },
        {
          id: 3,
          title: 'плана рассадки',
          images: [],
          settings: {},
          activeImageId: null,
          showControls: false
        },
        {
          id: 5,
          title: 'другой зоны',
          images: [],
          settings: {},
          activeImageId: null,
          showControls: false
        }
      ],

      slidesId: null,
      showControls: false,
      contentRef: null,
      projects: [],
      filtersList: [
        { name: 'exposure', label: 'Экспозиция', min: -100, max: 100, step: 1 },
        { name: 'contrast', label: 'Контраст', min: -100, max: 100, step: 1 },
        { name: 'saturation', label: 'Насыщенность', min: -100, max: 100, step: 1 },
        { name: 'temperature', label: 'Температура', min: -100, max: 100, step: 1 },
        { name: 'hue', label: 'Оттенок', min: -100, max: 100, step: 1 },
        { name: 'highlights', label: 'Светлые области', min: -100, max: 100, step: 1 },
        { name: 'shadows', label: 'Тени', min: -100, max: 100, step: 1 }
      ],
      showSaveModal: false,
      showSuccessModal: false,
      currentProject: null,
      showContentSlides: false,
      currentGuidePage: 0,
      currentSlideId: null,
      zoneContents: {},
      currentElements: [],
      currentBackground: null,
      zonesState: {},
      zonesData: {}
    }
  },
  computed: {
    ...mapState("category", ["categories", "fetchCategoriesSuccess"]),
    totalPrice() {
      return this.droppedImages.reduce((total, image) => {
        return total + (image.price || 0)
      }, 0)
    },
    activeImage() {
      if (!this.activeImageId) return null
      const img = this.droppedImages.find(img => img.id === this.activeImageId)
      return img?.filters ? img : null
    },
    hasBackground() {
      return this.droppedImages.some(img => img.isBackground)
    },
    currentZoneTitle() {
      const zone = this.fotozones.find(zone => zone.id === this.slidesId)
      return zone ? zone.title : 'фотозоны'
    },
    showEmptyMessage() {
      return this.droppedImages.length === 0 ||
        (this.activeIcon === this.categories[0]?.name && !this.hasBackground)
    },
    emptyMessageText() {
      if (this.activeIcon === this.categories[0]?.name && !this.hasBackground) {
        return `Выберите фон для композиции ${this.currentZoneTitle}`
      }
      return 'Начните собирать композицию. Выбирайте элементы из колонки слева и они автоматически добавятся в рабочее поле.'
    },

    nonBackgroundImages() {
      return this.droppedImages
        .filter(item => item && !item.isBackground && !item.isText)
    },
  },

  methods: {
    ...mapActions("category", ["fetchCategories"]),
    ...mapActions("projects", ["saveProject", "loadProjects"]),
    handlePageChange(newPage) {
      this.currentGuidePage = newPage
    },

    handleRouteUpdate() {
      const zoneId = this.$route.query.zone
      if (zoneId !== undefined) {
        this.currentSlideId = parseInt(zoneId, 10)
      }
    },

    prepareSave() {
      this.currentProjectData = {
        zoneId: this.activeZoneId,
        images: this.droppedImages,
        preview: this.generatePreview()
      }
      this.showSaveModal = true
    },
    handleFotozoneChange(id) {
      if (id === this.currentSlideId) return
      this.switchZone(id)
      this.$router.push({
        query: { ...this.$route.query, zone: id }
      }).catch(() => { })
    },
    setActiveIcon(id) {
      this.activeIcon = id
    },

    initZoneState(zoneId) {
      if (!this.zonesState[zoneId]) {
        this.zonesState[zoneId] = {
          background: null,
          elements: [],
          settings: {}
        }
      }
    },

    switchZone(newZoneId) {
      // Сохраняем текущие настройки
      if (this.activeZoneId !== null) {
        this.zonesData[this.activeZoneId] = this.droppedImages.map(img => ({
          ...img,
          filters: { ...img.filters } // Глубокая копия фильтров
        }))
      }

      // Загружаем новую зону
      this.activeZoneId = newZoneId
      this.droppedImages = this.zonesData[newZoneId]
        ? [...this.zonesData[newZoneId]]
        : []

      // Применяем фильтры для всех изображений новой зоны
      this.$nextTick(() => {
        this.droppedImages.forEach(img => {
          this.applyFiltersToDom(img.id)
        })
      })
    },

    onSlideChange(newZoneId) {
      this.switchZone(newZoneId)
    },

    handleTextMouseDown(item, event) {
      if (!item.locked && !item.isBackground) {
        const target = event.target
        if (target.tagName === 'INPUT' && target.classList.contains('content-input')) {
          return
        }

        item.zIndex = 1001
        this.activeItemId = item.id
        this.showControls = true

        const nativeEvent = event.originalEvent || event
        nativeEvent?.preventDefault()

        this.startDrag(item, nativeEvent)

        const upHandler = () => {
          item.zIndex = this.activeItemId === item.id ? 1000 : 2
          document.removeEventListener('mouseup', upHandler)
        }
        document.addEventListener('mouseup', upHandler)
      }
    },


    addFontToContent(subcategory) {
      const newTextItem = {
        id: Date.now(),
        draggable: true,
        resizable: true,
        type: 'text',
        text: '',
        fontName: subcategory.name,
        fontUrl: subcategory.url,
        x: 50,
        y: 50,
        width: 200,
        height: 40,
        rotate: 0,
        scale: 1,
        zIndex: 1,
        locked: false,
        opacity: 1,
        color: '#000000',
        filters: {
          exposure: 0,
          contrast: 0,
          saturation: 0,
          temperature: 0,
          hue: 0,
          highlights: 0,
          shadows: 0
        }
      }
      this.droppedImages.push(newTextItem)
    },

    // Получение стилей для текста
    getFontStyle(item) {
      if (item.type !== 'text') return {}

      const fontName = `font_${item.id}`
      const fontFace = `
    @font-face {
      font-family: '${fontName}';
      src: url('${item.fontUrl}');
    }
  `

      if (!document.getElementById(fontName)) {
        const style = document.createElement('style')
        style.id = fontName
        style.innerHTML = fontFace
        document.head.appendChild(style)
      }

      return {
        fontFamily: fontName,
        fontSize: '20px',
        backgroundColor: 'transparent',
        border: '1px solid #ccc',
        borderRadius: '4px',
        outline: 'none',
        resize: 'none',
        padding: '4px 8px',
        margin: '0',
        lineHeight: '1',
        color: item.color || '#000000',
        boxSizing: 'border-box',
        width: '100%',
        height: '100%'
      }
    },

    setActiveItem(id) {
      this.activeItemId = id
      this.showControls = true
    },



    getItemKey(item, index) {
      return item?.id ? `item-${item.id}` : `item-${index}`
    },

    getItemStyle(item) {
      if (!item) return {}
      return {
        top: `${item.y}px`,
        left: `${item.x}px`,
        width: `${item.width}px`,
        height: `${item.height}px`,
        zIndex: item.zIndex ?? 1,
        position: 'absolute',
        boxSizing: 'border-box'
      }
    },



    toggleCategory(id) {
      this.categories.forEach((category) => {
        const subcategory = category.subcategories.find((sub) => sub.id === id)
        if (subcategory) subcategory.open = !subcategory.open
      })
    },

    handleItemMouseDown(item, event) {
      const target = event.target
      // Разрешаем выделение текста только при клике непосредственно на input
      if (target.tagName === 'INPUT' && target.classList.contains('content-input')) {
        return
      }

      if (!item.locked && !item.isBackground) {
        item.zIndex = 1001
        this.activeItemId = item.id
        this.showControls = true

        const nativeEvent = event.originalEvent || event
        nativeEvent?.preventDefault()

        this.startDrag(item, nativeEvent)

        const upHandler = () => {
          item.zIndex = this.activeItemId === item.id ? 1000 : 2
          document.removeEventListener('mouseup', upHandler)
        }
        document.addEventListener('mouseup', upHandler)
      }
    },


    addImageToContent(element) {
      const isColorBackground = !!element.color
      const isImageBackground = this.activeIcon === this.categories[0]?.name && !isColorBackground
      const isBackground = isImageBackground || isColorBackground

      const contentWidth = this.$refs.contentRef?.offsetWidth || 0
      const contentHeight = this.$refs.contentRef?.offsetHeight || 0


      if (isBackground) {
        this.droppedImages = this.droppedImages.filter(img => !img.isBackground)
      }

      const newImage = {
        id: this.id++,
        src: isColorBackground ? this.createColorImage(element.color) : element.image,
        width: isBackground ? contentWidth : 200,
        height: isBackground ? contentHeight : 200,
        x: 0,
        y: 0,
        rotate: 0,
        flip: false,
        opacity: 1,
        zoneId: this.currentSlideId,
        zIndex: isBackground ? -1000 : 0,
        isBackground,
        isColor: isColorBackground,
        color: element.color,
        locked: isBackground,
        price: element.price || 0,
        filters: {
          exposure: 0,
          contrast: 0,
          saturation: 0,
          temperature: 0,
          hue: 0,
          highlights: 0,
          shadows: 0
        }
      }

      this.droppedImages = [...this.droppedImages, newImage]

      this.$store.commit('category/UPDATE_TOTAL_PRICE', this.totalPrice)
    },

    createColorImage(color) {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 10
        canvas.height = 10
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = color || '#ffffff'
        ctx.fillRect(0, 0, 10, 10)
        return canvas.toDataURL()
      } catch (e) {
        console.error('Error creating color image:', e)
        return ''
      }
    },
    handleItemClick(id) {
      const item = this.droppedImages.find(img => img.id === id)
      if (item && !item.isBackground) {
        this.activeItemId = id
        this.showControls = true
        this.bringToFront(id)
      }
    },

    bringToFront(id) {
      const maxZ = Math.max(...this.droppedImages.map(i => i.zIndex))
      this.droppedImages = this.droppedImages.map(item =>
        item.id === id ? { ...item, zIndex: maxZ + 1 } : item
      )
    },

    deleteItem(id) {
      const index = this.droppedImages.findIndex(item => item.id === id)
      if (index !== -1) {
        this.droppedImages.splice(index, 1)
      }
    },
    rotateItem(id) {
      this.droppedImages = this.droppedImages.map(img => {
        if (img.id === id) {
          const newRotate = (img.rotate + 90) % 360
          return {
            ...img,
            rotate: newRotate,
            flip: newRotate % 180 !== 0 ? !img.flip : img.flip
          }
        }
        return img
      })
      this.$forceUpdate()
    },
    clearContent() {
      this.droppedImages = []
      this.activeImageId = null
      this.showControls = false
      this.$store.commit('category/UPDATE_TOTAL_PRICE', 0)
    },

    async downloadContent() {
      try {
        const prevShowControls = this.showControls
        this.showControls =
          await this.$nextTick()

        const canvas = await html2canvas(this.$refs.contentRef, {
          backgroundColor: null,
          scale: 3,
          logging: false,
          useCORS: true,
          allowTaint: true,
          ignoreElements: (element) => {
            return element.classList && (
              element.classList.contains('utils-block') ||
              element.classList.contains('images-buttons') ||
              element.classList.contains('images-utils') ||
              element.classList.contains('resize-handle')
            )
          }
        })


        const link = document.createElement('a')
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        link.download = `Проект-${this.currentZoneTitle}-${timestamp}.png`
        link.href = canvas.toDataURL('image/png', 1.0)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        this.showControls = prevShowControls
      } catch (error) {
        console.error('Ошибка при создании изображения:', error)
        alert('Произошла ошибка при создании изображения')
        this.showControls = true
      }
    },

    deleteImageById(id) {
      this.droppedImages = deleteImageUtil(this.droppedImages, id)
      if (this.activeImageId === id) {
        this.activeImageId = null
        this.showControls = false
      }
      this.$store.commit('category/UPDATE_TOTAL_PRICE', this.totalPrice)
    },

    rotateImage(id) {
      this.droppedImages = rotateImageUtil(this.droppedImages, id)
    },

    copyItem(id) {
      const original = this.droppedImages.find(img => img.id === id)
      if (!original) return

      const copy = {
        ...original,
        id: this.id++,
        x: original.x + 20, // Смещаем копию
        y: original.y + 20,
        zIndex: Math.max(...this.droppedImages.map(i => i.zIndex)) + 1
      }

      this.droppedImages = [...this.droppedImages, copy]
    },

    mirrorFun(id) {
      this.droppedImages = this.droppedImages.map(img => {
        if (img.id === id) {
          return {
            ...img,
            flip: !img.flip,
            rotate: img.flip ? -img.rotate : Math.abs(img.rotate)
          }
        }
        return img
      })
    },
    onChangeOpacity(e, id) {
      const opacityValue = parseInt(e.target.value) / 100
      this.droppedImages = this.droppedImages.map(img =>
        img.id === id ? { ...img, opacity: opacityValue } : img
      )
    },

    toggleLock(id) {
      this.droppedImages = this.droppedImages.map(img =>
        img.id === id ? { ...img, locked: !img.locked } : img
      )
    },

    changeZIndex(action, imageId) {
      const images = [...this.droppedImages]
      const index = images.findIndex(img => img.id === imageId)

      if (index === -1) return

      const maxZ = Math.max(...images.map(i => i.zIndex))
      const minZ = Math.min(...images.map(i => i.zIndex))

      switch (action) {
        case 'front':
          images[index].zIndex = maxZ + 1
          break
        case 'back':
          images[index].zIndex = minZ - 1
          break
        case 'up':
          images.sort((a, b) => a.zIndex - b.zIndex)
            .forEach((img, i) => { img.zIndex = i + 1 })
          break
        case 'down':
          images.sort((a, b) => b.zIndex - a.zIndex)
            .forEach((img, i) => { img.zIndex = i + 1 })
          break
      }

      this.droppedImages = images
      this.activeImageId = imageId
    },



    initDragResize() {
      const { startDrag: dragFn } = useDrag()
      const { startResize: resizeFn } = useResize()

      this.startDrag = (image, event) => {
        if (!image.locked && !image.isBackground) {
          dragFn(this.droppedImages, image, event, this.$refs.contentRef)
        }
      }

      this.startResize = (image, event, direction) => {
        if (!image.locked && !image.isBackground) {
          const contentRect = this.$refs.contentRef.getBoundingClientRect()
          const maxWidth = contentRect.width - image.x
          const maxHeight = contentRect.height - image.y

          resizeFn(this.droppedImages, image, event, direction, {
            minWidth: 50,
            minHeight: 50,
            maxWidth,
            maxHeight,
            aspectRatio: image.type === 'text' ? null : image.width / image.height
          })
        }
      }
    },

    applyFiltersToDom(imageId) {
      const item = this.droppedImages.find(img => img.id === imageId)
      if (!item || !item.filters) return

      // Используем document.querySelector вместо this.$el.querySelector
      const element = document.querySelector(`[data-image-id="${imageId}"]`)
      if (!element) return

      const f = item.filters
      const filterString = `
    brightness(${100 + f.exposure}%)
    contrast(${100 + f.contrast}%)
    saturate(${100 + f.saturation}%)
    sepia(${Math.max(0, Math.min(f.temperature, 100)) / 100})
    hue-rotate(${f.hue}deg)
  `.trim().replace(/\s+/g, ' ')

      element.style.filter = filterString
      element.style.webkitFilter = filterString // Для Safari
    },
    generateFilterString(filters) {
      if (!filters) return ''

      const parts = []

      // Экспозиция (яркость)
      if (filters.exposure !== undefined) {
        parts.push(`brightness(${1 + filters.exposure / 100})`)
      }

      // Контраст
      if (filters.contrast !== undefined) {
        parts.push(`contrast(${1 + filters.contrast / 100})`)
      }

      // Насыщенность
      if (filters.saturation !== undefined) {
        parts.push(`saturate(${1 + filters.saturation / 100})`)
      }

      // Оттенок
      if (filters.hue !== undefined) {
        parts.push(`hue-rotate(${filters.hue}deg)`)
      }

      // Температура (теплый/холодный)
      if (filters.temperature !== undefined) {
        if (filters.temperature > 0) {
          parts.push(`sepia(${filters.temperature / 100})`)
        } else {
          parts.push(`hue-rotate(${Math.abs(filters.temperature) / 2}deg)`)
        }
      }

      // Тени/Света
      if (filters.shadows !== undefined) {
        const intensity = Math.abs(filters.shadows) / 20
        if (filters.shadows > 0) {
          parts.push(`drop-shadow(0 0 ${intensity}px rgba(0,0,0,0.5))`)
        } else if (filters.shadows < 0) {
          parts.push(`drop-shadow(0 0 ${intensity}px rgba(255,255,255,0.5))`)
        }
      }

      if (filters.highlights !== undefined && filters.highlights !== 0) {
        parts.push(`brightness(${1 + (filters.highlights / 200)})`)
      }

      return parts.join(' ')
    },

    getCurrentFilterValue(filterName) {
      const item = this.droppedImages.find(img => img.id === this.activeItemId)
      return item?.filters?.[filterName] ?? 0
    },


    // В методе updateFilter замените обновление данных на:
    updateFilter(filterName, value) {
      const numericValue = parseInt(value)
      this.droppedImages = this.droppedImages.map(img => {
        if (img.id === this.activeItemId) {
          return {
            ...img,
            filters: {
              ...img.filters,
              [filterName]: numericValue
            }
          }
        }
        return img
      })
      this.applyFiltersToDom(this.activeItemId)
    },

    generateShadowEffect(shadowValue) {
      const intensity = Math.abs(shadowValue) / 20
      if (shadowValue > 0) {
        return `drop-shadow(0 0 ${intensity}px rgba(0,0,0,0.5))`
      } else if (shadowValue < 0) {
        return `drop-shadow(0 0 ${intensity}px rgba(255,255,255,0.5))`
      }
      return ''
    },

    applyComplexEffects(element, filters) {
      const { highlights } = filters
      let overlay = element.querySelector('.image-effects-overlay')
      if (!overlay) {
        overlay = document.createElement('div')
        overlay.className = 'image-effects-overlay'
        element.appendChild(overlay)
      }
      const highlightOpacity = Math.max(0, highlights / 100)
      overlay.style.background = `
    linear-gradient(
      to bottom,
      rgba(255, 255, 255, ${highlightOpacity}) 0%,
      transparent 50%
    )
  `
    },

    updateSliderValues(filters) {
      this.$nextTick(() => {
        Object.keys(filters).forEach(name => {
          const input = this.sliderRefs[name]
          if (input) {
            input.value = filters[name]
            const nextSpan = input.nextElementSibling
            if (nextSpan && nextSpan.classList.contains('settings-number')) {
              nextSpan.textContent = filters[name]
            }
            this.updateRangeFill({ target: input })
          }
        })
      })
    },

    getFilterLabel(name) {
      const labels = {
        exposure: 'Экспозиция',
        contrast: 'Контраст',
        saturation: 'Насыщенность',
        temperature: 'Температура',
        hue: 'Оттенок',
        highlights: 'Светлые области',
        shadows: 'Тени'
      }
      return labels[name] || name
    },

    updateRangeFill(event) {
      if (!event?.target) return
      const input = event.target
      const value = Number(input.value) || 0
      const percent = Math.abs(value) / (input.max - input.min) * 50

      if (value < 0) {
        input.style.setProperty('--left-fill', `${50 - percent}%`)
        input.style.setProperty('--right-fill', '50%')
      } else if (value > 0) {
        input.style.setProperty('--right-fill', `${50 + percent}%`)
        input.style.setProperty('--left-fill', '50%')
      } else {
        input.style.setProperty('--left-fill', '50%')
        input.style.setProperty('--right-fill', '50%')
      }
    },
    getImageStyle(item) {
      if (!item || !item.filters) return {}
      const f = item.filters
      return {
        filter: `
      brightness(${100 + f.exposure}%)
      contrast(${100 + f.contrast}%)
      saturate(${100 + f.saturation}%)
      sepia(${Math.max(0, Math.min(f.temperature, 100)) / 100})
      hue-rotate(${f.hue}deg)
    `,
        transform: `
      rotate(${item.rotate}deg)
      scaleX(${item.flip ? -1 : 1})
    `,
        transformOrigin: 'center center',
        opacity: item.opacity ?? 1,
        width: '100%',
        height: '100%',
        objectFit: 'contain'
      }
    },

    setSliderRef(name, el) {
      if (el) {
        this.sliderRefs[name] = el
        this.$nextTick(() => {
          const value = this.getCurrentFilterValue(name)
          el.value = value
          this.updateRangeFill({ target: el })

          const nextSpan = el.nextElementSibling
          if (nextSpan && nextSpan.classList.contains('settings-number')) {
            nextSpan.textContent = value
          }
        })
      }
    },


    toggleShaw(id) {
      this.shaw.content = true
      this.shaw.sidebar = true
      this.slidesId = id

      if (this.currentProject && this.currentProject.zoneId === id) {
        this.droppedImages = JSON.parse(JSON.stringify(this.currentProject.images))
      } else {
        this.droppedImages = []
        const slide = this.fotozones.find(el => el.id === id)
        if (slide) {
          this.droppedImages = [...slide.images]
        }
      }

      this.activeImageId = null
      this.showControls = false
      this.showContentSlides = true
    },


    handleContentClick(e) {
      if (!e.target.closest('.dropped-image-container') &&
        !e.target.closest('.images-buttons') &&
        !e.target.closest('.images-utils')) {
        this.activeImageId = null
        this.showControls = false
      }
    },


    handleImageClick(id) {
      const image = this.droppedImages.find(img => img.id === id)
      if (image) {
        this.activeImageId = id
        this.showControls = true

        // Инициализируем filters если их нет
        if (!image.filters) {
          const imageIndex = this.droppedImages.findIndex(img => img.id === id)
          this.droppedImages[imageIndex].filters = {
            exposure: 0,
            contrast: 0,
            saturation: 0,
            temperature: 0,
            hue: 0,
            highlights: 0,
            shadows: 0
          }
        }

        this.$nextTick(() => {
          this.updateSliderValues(image.filters || {})
        })
      }
    },

    handleImageMouseDown(image, event) {
      if (!image.locked && !image.isBackground) {
        // Принудительно поднимаем z-index перед началом перемещения
        image.zIndex = 1001

        if (this.activeImageId !== image.id) {
          this.activeImageId = image.id
          this.showControls = true
        }

        const nativeEvent = event.originalEvent || event
        if (nativeEvent) {
          nativeEvent.preventDefault()
          nativeEvent.stopPropagation()
        }

        this.startDrag(image, nativeEvent)

        const upHandler = () => {
          image.zIndex = this.activeImageId === image.id ? 1000 : 2
          document.removeEventListener('mouseup', upHandler)
        }

        document.addEventListener('mouseup', upHandler)
      }
    },

    toggleControls(id) {
      const image = this.droppedImages.find(img => img.id === id)
      if (image && !image.isBackground) {
        if (this.activeImageId === id) {
          this.showControls = !this.showControls
        } else {
          this.activeImageId = id
          this.showControls = true
        }
      }
    },

    openSaveModal() {
      this.showSaveModal = true
    },

    async handleProjectSave(projectData) {
      try {
        // Блокируем интерфейс
        this.showControls = false
        this.isSaving = true

        // Проверка и нормализация имени проекта
        const projectName = String(projectData.name || 'Без названия').trim()
        if (!projectName) {
          throw new Error('Введите название проекта')
        }

        // Проверка наличия элементов
        if (!Array.isArray(this.droppedImages) || this.droppedImages.length === 0) {
          throw new Error('Добавьте элементы для сохранения проекта')
        }

        // Генерация превью
        let preview = ''
        try {
          const canvas = await html2canvas(this.$refs.contentRef, {
            useCORS: true,
            scale: 0.8,
            logging: false,
            backgroundColor: null
          })
          preview = canvas.toDataURL('image/png', 0.85)
        } catch (canvasError) {
          console.warn('Ошибка генерации превью:', canvasError)
          preview = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
        }

        // Формируем данные элементов
        const images = this.droppedImages.map(element => ({
          type: element.type || 'image',
          id: element.id || Date.now(),
          content: element.type === 'text' ?
            (element.text || '') :
            (element.src || ''),
          position: {
            x: Number(element.x) || 0,
            y: Number(element.y) || 0
          },
          size: {
            width: Number(element.width) || 100,
            height: Number(element.height) || 100
          },
          styles: {
            font: element.fontName || 'Arial',
            color: element.color || '#000000',
            opacity: Number(element.opacity) || 1,
            rotation: Number(element.rotate) || 0,
            zIndex: Number(element.zIndex) || 1,
            flip: Boolean(element.flip)
          },
          filters: element.filters ? {
            ...element.filters
          } : {},
          isBackground: Boolean(element.isBackground),
          isColor: Boolean(element.isColor),
          locked: Boolean(element.locked),
          createdAt: new Date().toISOString()
        }))

        // Формируем полные данные проекта
        const preparedData = {
          name: projectName,
          zoneId: Number(this.slidesId) || 1,
          zoneTitle: String(this.currentZoneTitle || 'Без названия зоны'),
          images: images,
          preview: preview,
          settings: {
            resolution: `${window.innerWidth}x${window.innerHeight}`,
            createdAt: new Date().toISOString()
          }
        }

        // Сохраняем через Vuex
        const result = await this.$store.dispatch(
          'projects/saveProject',
          preparedData
        )

        if (!result.success) {
          throw new Error(result.error || 'Ошибка сохранения')
        }

        // Успешное сохранение
        this.showSaveModal = false
        this.showSuccessModal = true
        this.savedProjectName = projectName

        // Сбрасываем состояние через 1 секунду
        setTimeout(() => {
          this.clearCurrentProject()
        }, 1000)

      } catch (error) {
        console.error('Ошибка сохранения:', error)
        alert(`Ошибка сохранения: ${error.message}`)
      } finally {
        // Восстанавливаем интерфейс
        this.isSaving = false
        this.showControls = true
      }
    },

    goToProjectsPage() {
      this.$router.push('/projects')
    },

    loadProject() {
      const projectId = this.$route.query.projectId
      if (!projectId) return

      try {
        const savedProjects = JSON.parse(localStorage.getItem('savedProjects')) || []
        const projectToLoad = savedProjects.find(p => p.id === Number(projectId))

        if (projectToLoad) {
          this.currentProject = projectToLoad
          this.slidesId = projectToLoad.zoneId
          this.droppedImages = JSON.parse(JSON.stringify(projectToLoad.images))
          this.shaw.content = true
          this.shaw.sidebar = true

          const slide = this.fotozones.find(f => f.id === projectToLoad.zoneId)
          if (slide) {
            slide.images = [...this.droppedImages]
          }
        } else {
          console.error('Проект не найден')
        }
      } catch (error) {
        console.error('Ошибка загрузки проекта:', error)
      }
    },
    clearCurrentProject() {
      this.currentProject = null
      if (this.$route.query.projectId) {
        this.$router.replace({ query: null })
      }
    },

    setHighlight(shouldHighlight) {
      this.highlightSlides = shouldHighlight
      if (shouldHighlight) {
        this.$nextTick(() => {
          const slides = document.querySelector('.slides-track')
          if (slides) slides.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        })
      }
    },
    handleSlideChange(newId) {
      this.slidesId = newId
    },

    loadZoneContent(zoneId) {
      if (this.zoneContents[zoneId]) {
        this.droppedImages = this.zoneContents[zoneId]
      }
      else {
        this.droppedImages = []
        this.zoneContents[zoneId] = this.droppedImages
      }

      this.activeItemId = null
      this.showControls = false
    },

  },

  mounted() {

    setTimeout(() => {
      if (this.droppedImages.length > 0) {
        console.log('Initial application of filters')
        this.droppedImages.forEach(img => {
          this.applyFiltersToDom(img.id)
        })
      }
    }, 1000)

    const savedState = localStorage.getItem('zonesState')
    if (savedState) {
      this.zonesState = JSON.parse(savedState)
    }


    const initialZone = this.$route.query.zone
      ? parseInt(this.$route.query.zone)
      : this.fotozones[0]?.id || 0

    this.switchZone(initialZone)

    this.currentSlideId = initialZone
    this.initZoneState(initialZone)

    const zoneState = this.zonesState[initialZone]
    this.droppedImages = [
      ...(zoneState.background ? [zoneState.background] : []),
      ...zoneState.elements
    ]
    this.currentBackground = zoneState.background

    this.fetchCategories()
    this.initDragResize()

    if (this.activeImageId) {
      const image = this.droppedImages.find(img => img.id === this.activeImageId)
      if (image) {
        this.$nextTick(() => {
          this.updateSliderValues(image.filters)
        })
      }
    }

    this.$nextTick(() => {
      if (this.$refs.contentRef) {
        console.log('Content size:', {
          width: this.$refs.contentRef.offsetWidth,
          height: this.$refs.contentRef.offsetHeight
        })
      }
    })

    if (!localStorage.getItem('guideShown')) {
      this.showGuide = true
      localStorage.setItem('guideShown', 'true')
    }
  },


  watch: {
    activeImageId: {
      immediate: true,
      handler(newId) {
        if (newId) {
          const image = this.droppedImages.find(img => img.id === newId)
          if (image) {
            this.$nextTick(() => {
              this.updateSliderValues(image.filters)
            })
          }
        }
      }
    },
    '$route.query.projectId'(newId) {
      if (newId) {
        this.loadProject()
      }
    },
    '$route.query.zone': {
      handler(newZoneId) {
        const zoneId = newZoneId !== undefined ? parseInt(newZoneId, 10) : null
        if (zoneId !== null && zoneId !== this.currentSlideId) {
          this.switchZone(zoneId)
        }
      },
      immediate: true
    },
    currentSlideId(newZoneId) {
      this.loadZoneContent(newZoneId)
    },
    zoneContents: {
      deep: true,
      handler() {
        localStorage.setItem('zoneContents', JSON.stringify(this.zoneContents))
      }
    },
    zonesState: {
      deep: true,
      handler(newState) {
        localStorage.setItem('zonesState', JSON.stringify(newState))
      }
    },
    droppedImages: {
      deep: true,
      handler(newVal) {
        console.log('Dropped images changed:', JSON.parse(JSON.stringify(newVal)))
      }
    }
  },
  created() {
    this.$watch(
      () => this.fotozones,
      (newZones) => {
        newZones.forEach(zone => {
          if (!this.zonesState[zone.id]) {
            this.zonesState[zone.id] = {
              background: null,
              elements: [],
              settings: {}
            }
          }
        })
      },
      { immediate: true, deep: true }
    )
  }
}
</script>

<style scoped>
.text-element-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: move;
  user-select: none;
}

.content-input {
  flex: 1;
  pointer-events: auto;
  min-width: 0;
  cursor: text;
  min-height: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 8px;
  margin: 0;
  pointer-events: auto;
  transform: none !important;
}


/* Для активного текстового элемента */
.dropped-image-container.active .content-input {
  border-color: transparent !important;
}

.layers-control {
  position: relative;
  display: inline-block;
}

.layers-control img {
  cursor: pointer;
  transition: transform 0.2s;
}

.layers-control:hover img {
  transform: scale(1.1);
}

.layers-menu {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  min-width: 200px;
  z-index: 1000;
  display: none;
}

.layers-control:hover .layers-menu {
  display: block;
}

.layers-menu div {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
}

.layers-menu div:hover {
  background-color: #f5f5f5;
}

.layers-menu img {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.content-input {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  outline: none;
  resize: none;
  padding: 5px;
  pointer-events: none;
}

.dropped-image-container.active .content-input {
  pointer-events: auto;
}

/* Основная структура */
.app-container {
  display: flex;
  height: calc(100vh - 60px);
  /* Увеличили высоту */
  width: 100%;
  overflow: hidden;
  padding: 0 20px 0 20px;
  gap: 20px;
}

.dashboard-container {
  display: flex;
  height: 100%;
  margin: 0;
  padding: 0 40px;
  /* Вернули отступы по бокам */
  gap: 30px;
  overflow: hidden;
  width: calc(100% - 80px);
  /* Уменьшили общую ширину */
}

.main-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  max-width: 90%;
  /* Уменьшили ширину контента */
  margin: 0 auto;
  /* Центрирование */
}

.content-section {
  flex: 1;
  position: relative;
  min-height: 0;
  height: 85vh;
  /* Увеличили высоту контента */
  background-color: #faf9f7;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.02),
    0 6.7px 5.3px rgba(0, 0, 0, 0.028),
    0 12.5px 10px rgba(0, 0, 0, 0.035),
    0 22.3px 17.9px rgba(0, 0, 0, 0.042),
    0 41.8px 33.4px rgba(0, 0, 0, 0.05),
    0 100px 80px rgba(0, 0, 0, 0.07);
}

.slides-section {
  flex-shrink: 0;
  z-index: 100;
  /* Гарантируем что фотозоны выше контента */
  position: relative;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .dashboard-container {
    padding: 0 20px;
    /* Адаптивные отступы */
    width: calc(100% - 40px);
  }

  .main-content-wrapper {
    max-width: 100%;
    height: 75vh;
  }

  .content-section {
    height: 75vh;
  }
}

/* Стили для контента */
.background-color,
.background-image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.empty-content-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: 18px;
  color: #666;
  max-width: 300px;
  line-height: 1.5;
  z-index: 0;
}

.utils-block {
  position: absolute;
  z-index: 100;
  width: 100%;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}

.utils-block img {
  cursor: pointer;
}

.downloadImage {
  color: rgba(255, 255, 255, 1);
  text-transform: uppercase;
  padding: 13px 20px 13px 20px;
  background-color: rgba(73, 103, 130, 1);
  border-radius: 10px;
  cursor: pointer;
}

/* Стили для изображений */
.dropped-image-container {
  position: absolute;
  will-change: transform;
  cursor: grab;
  z-index: 2;
  transition: z-index 0.1s ease;
  box-sizing: border-box;
  contain: layout;
}

.dropped-image-container.active {
  z-index: 1000;
  cursor: move;
}

.resizable-image {
  display: block;
  width: 100%;
  height: 100%;
  user-select: none;
  -webkit-user-drag: none;
  transition: 0.5s;
  border: none !important;
  border-radius: 0 !important;
}

.dropped-image-container.active.show-controls .resizable-image {
  border: 1px solid #bbcad8 !important;
  border-radius: 5px !important;
}

/* Элементы управления изображениями */
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
  box-shadow: 0 2px 4px rgba(128, 117, 116, .05),
    0 4px 8px rgba(128, 117, 116, .08),
    0 8px 12px rgba(128, 117, 116, .1);
}

.images-utils {
  position: absolute;
  display: none;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  top: -45px;
  gap: 20px;
  z-index: 1;
  cursor: pointer;
}

/* Скрытие/показ элементов управления */
.dropped-image-container .images-buttons,
.dropped-image-container .resize-handle,
.dropped-image-container .images-utils {
  display: none;
}

.dropped-image-container.active.show-controls .images-buttons,
.dropped-image-container.active.show-controls .resize-handle,
.dropped-image-container.active.show-controls .images-utils {
  display: flex;
}

/* Ресайз-ручки */
.resize-handle {
  position: absolute;
  background-color: #bbcad8;
  opacity: 1 !important;
}

.resize-handle-left,
.resize-handle-right {
  width: 4px;
  height: 30px;
  top: 50%;
  transform: translateY(-50%);
  cursor: ew-resize;
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

.resize-handle-top-left,
.resize-handle-top-right,
.resize-handle-bottom-left,
.resize-handle-bottom-right {
  width: 12px;
  height: 12px;
  background-color: #bbcad8;
  border-radius: 2px;
  z-index: 0;
}

.resize-handle-top-left {
  top: -6px;
  left: -6px;
  cursor: nwse-resize;
}

.resize-handle-top-right {
  top: -6px;
  right: -6px;
  cursor: nesw-resize;
}

.resize-handle-bottom-left {
  bottom: -6px;
  left: -6px;
  cursor: nesw-resize;
}

.resize-handle-bottom-right {
  bottom: -6px;
  right: -6px;
  cursor: nwse-resize;
}

/* Дополнительные стили элементов управления */
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
  box-shadow: 0 2px 4px rgba(128, 117, 116, .05),
    0 4px 8px rgba(128, 117, 116, .08),
    0 8px 12px rgba(128, 117, 116, .1);
}

.indexIcon:hover .index-block-input {
  display: flex;
}

.layers-z-container {
  position: absolute;
  display: none;
  flex-direction: column;
  gap: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(128, 117, 116, .05),
    0 4px 8px rgba(128, 117, 116, .08),
    0 8px 12px rgba(128, 117, 116, .1);
  padding: 10px;
  border-radius: 5px;
}

.settings-inputs {
  position: absolute;
  background: #fff;

  box-shadow: 0 2px 4px rgba(128, 117, 116, .05),
    0 4px 8px rgba(128, 117, 116, .08),
    0 8px 12px rgba(128, 117, 116, .1);
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
</style>
