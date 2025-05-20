<template>
  <div class="dashboard-page">
    <AppHeader :current-page="currentPage" @update-page="handlePageChange" />

    <div class="app-container">
      <AppSidebar :show-content="showSidebar" @add-image="addImageToContent" />

      <div class="main-content">
        <AppSlides :zones="zones" :highlight="highlightSlides" @zone-selected="handleZoneSelection" />
      </div>
    </div>

    <AppGuide v-if="showGuide" :initial-page="currentPage" @close="closeGuide" @update-page="handlePageChange"
      @highlight-slides="handleHighlightSlides" />
  </div>
</template>

<script>
import AppGuide from '@/components/AppGuide.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppSlides from '@/components/AppSlides.vue'

export default {
  components: {
    AppHeader,
    AppSidebar,
    AppSlides,
    AppGuide
  },
  data() {
    return {
      currentPage: 0,
      showSidebar: false,
      showGuide: false,
      highlightSlides: false,
      zones: [
        { id: 0, title: 'Выездная регистрация' },
        { id: 1, title: 'Фотозона' },
        { id: 2, title: 'Столы гостей' },
        { id: 3, title: 'План рассадки' },
        { id: 4, title: 'Другая зона' }
      ],
      selectedZone: null
    }
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page
    },
    handleHighlightSlides(shouldHighlight) {
      this.highlightSlides = shouldHighlight
      if (shouldHighlight) {
        setTimeout(() => {
          const slidesElement = document.querySelector('.slides-grid')
          if (slidesElement) {
            slidesElement.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            })
          }
        }, 300)
      }
    },
    handleZoneSelection(zoneId) {
      this.selectedZone = zoneId
      this.showSidebar = true
    },
    addImageToContent(image) {
      console.log('Adding image to zone:', this.selectedZone, image)
    },
    closeGuide() {
      this.showGuide = false
      this.highlightSlides = false
    }
  },
  mounted() {
    const startGuide = this.$route.query.startGuide === 'true' ||
      this.$route.query.startGuide === true

    if (startGuide) {
      this.currentPage = parseInt(this.$route.query.page, 10) || 1
      this.showGuide = true
      this.$router.replace({ path: this.$route.path, query: {} })
    }
    console.log('SlidesPage mounted')
    console.log('Route:', this.$route.fullPath)
  }

}
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.app-container {
  display: flex;
  padding: 20px;
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }
}
</style>