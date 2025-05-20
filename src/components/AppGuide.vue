<template>
  <div class="guide-overlay" @click.self="closeGuide" style="z-index: 100001">
    <div class="guide-container" ref="guideContainer" :style="containerStyle" style="z-index: 100005">
      <div class="arrow-wrapper" :style="arrowStyle">
        <div class="guide-arrow"></div>
      </div>

      <transition :name="transitionName" mode="out-in">
        <div class="guide-content" :key="currentPage">
          <div class="guide-page">
            <h4>{{ currentTitle }}</h4>
            <div class="guide-instruction">
              <p v-for="(item, index) in currentInstructions" :key="index">{{ item }}</p>
            </div>
          </div>
        </div>
      </transition>

      <div class="guide-navigation">
        <button class="nav-button" @click="prevPage" :disabled="currentPage === 1">
          Назад
        </button>
        <span class="page-indicator">{{ currentPage }}/{{ totalPages }}</span>
        <button class="nav-button" @click="nextPage" :disabled="currentPage === totalPages">
          {{ currentPage === totalPages ? 'Завершить' : 'Далее' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, onUnmounted, ref } from 'vue'

export default {
  emits: ['close', 'update-page'],
  setup(props, { emit }) {
    const currentPage = ref(1)
    const totalPages = 14
    const transitionName = ref('slide-next')
    const guideContainer = ref(null)

    const pages = [
      {
        title: "Помощь по интерфейсу",
        instructions: [
          "• Здесь вы можете открыть руководство",
          "• Ответы на часто задаваемые вопросы",
          "• Быстрая справка по работе с конструктором"
        ],
        target: '.faq-icon'
      },
      {
        title: "Личный кабинет",
        instructions: [
          "• Перейдите в ваш профиль",
          "• Просмотрите сохраненные проекты",
          "• Измените настройки аккаунта"
        ],
        target: '.avatar-icon'
      },
      {
        title: "Выберите другую зону декорирования",
        instructions: [
          "• В этом поле вы можете сменить зону оформления.",
          "• После создания первой зоны вы можете создать все остальные либо сохранить только одну."
        ],
        target: '.slides-container'
      },
      {
        title: "Поиск элементов декора",
        instructions: [
          "• Введите в поиске название элемента (например, синяя ваза)",
          "• Выберите нужный элемент из результатов",
          "• В поиске отображаются все элементы без разделения на категории",
          "• Плейсхолдер поиска: 'Искать в Зазеркалье'"
        ],
        target: '.search-input'
      },
      {
        title: "Выберите фон для зоны оформления",
        instructions: [
          "• Используйте первую категорию для выбора фона",
          "• Выберите цвет или готовое фоновое изображение",
          "• Можно загрузить собственное изображение",
          "• Фон автоматически растягивается на всю зону"
        ],
        target: '.categories'
      },
      {
        title: "Выберите категорию декора",
        instructions: [
          "• Выбирайте категорию для начала оформления",
          "• Внутри каждой категории есть подкатегории элементов",
          "• Элементы разделены по видам, формам и материалам",
          "• Нажмите на иконку категории для выбора"
        ],
        target: '.sidebar-icons'
      },
      {
        title: "Выберите подкатегорию элементов декора",
        instructions: [
          "• Нажмите на нужную группу элементов",
          "• Раскроется полный список элементов категории",
          "• Выбирайте элементы по видам, формам или материалам",
          "• Используйте двойной клик для быстрого добавления"
        ],
        target: '.categories'
      },
      {
        title: "Просмотр добавленных в проект элементов",
        instructions: [
          "• Все выбранные элементы в каждой категории будут видны первыми",
          "• В блоке «В проекте» отображаются добавленные элементы",
          "• Вы можете быстро найти и изменить ранее добавленные элементы"
        ],
        target: '.categories'
      },
      {
        title: "Измените выбранный элемент",
        instructions: [
          "• Чтобы передвинуть - зажмите элемент и двигайте по рабочему полю",
          "• Для поворота - зажмите круглую стрелку справа вверху от элемента",
          "• Чтобы изменить слои - нажмите на элемент и выберите «слои» в меню",
          "• В меню можно заблокировать, скопировать или отзеркалить элемент",
          "• Для удаления нажмите на корзину"
        ],
        target: '.content-section'
      },
      {
        title: "Сохраните проект",
        instructions: [
          "• Чтобы сохранить проект нажмите на эту кнопку",
          "• Во всплывающем окне дайте название проекту",
          "• Нажмите «Сохранить» для завершения",
          "• Посмотреть сохранённые проекты можно в «Мои проекты»"
        ],
        target: '.utils-block img[src*="save"]',
        arrowDirection: 'down'
      },
      {
        title: "Сохраните проект на устройство",
        instructions: [
          "• Чтобы сохранить изображение на ваше устройство",
          "• Нажмите на эту кнопку",
          "• Выберите место сохранения",
          "• Нажмите «Сохранить»"
        ],
        target: '.downloadImage',
        arrowDirection: 'down'
      },
      {
        title: "Удаление",
        instructions: [
          "• Чтобы удалить все добавленные объекты",
          "• Нажмите на корзину",
          "• Все элементы будут удалены с рабочего поля",
          "• Вы сможете начать создание композиции заново"
        ],
        target: '.utils-block img[src*="deleteCONTENT"]',
        arrowDirection: 'down'
      },
      {
        title: "Мои проекты",
        instructions: [
          "• Здесь сохраняются все созданные композиции",
          "• Если вы создали одну зону - остальные будут пустыми",
          "• Можно просматривать и редактировать сохраненные проекты"
        ],
        target: '.header-li:nth-child(2)',
        arrowDirection: 'down'
      },
      {
        title: "Готовые дизайны",
        instructions: [
          "• В этом разделе готовые композиции от Delper",
          "• Можно просмотреть примеры оформления",
          "• Любой дизайн можно заказать"
        ],
        target: '.order-button',
        arrowDirection: 'down'
      },

    ]

    const positions = ref({
      top: 0,
      left: 0,
      arrowOffset: 0,
      arrowDirection: 'down'
    })

    const currentTitle = computed(() => pages[currentPage.value - 1].title)
    const currentInstructions = computed(() => pages[currentPage.value - 1].instructions)

    const calculatePosition = () => {
      const target = document.querySelector(pages[currentPage.value - 1].target)
      if (!target || !guideContainer.value) return

      const targetRect = target.getBoundingClientRect()
      const containerRect = guideContainer.value.getBoundingClientRect()
      const scrollY = window.scrollY || window.pageYOffset
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let containerLeft, containerTop, arrowOffset, arrowDirection

      switch (currentPage.value) {
        case 1:
          containerLeft = targetRect.left + targetRect.width / 2 - containerRect.width / 2
          containerTop = targetRect.bottom + scrollY + 10
          arrowOffset = targetRect.width / 2 - 15
          arrowDirection = 'down'
          break

        case 2:
          containerLeft = targetRect.left + targetRect.width / 2 - containerRect.width / 1
          containerTop = targetRect.bottom + scrollY + 10
          arrowOffset = containerRect.width / 2 - targetRect.width / 2
          arrowDirection = 'down'
          break

        case 5:
          if (window.innerWidth >= 768) {
            containerLeft = targetRect.right + 20
            containerTop = targetRect.top + scrollY + targetRect.height / 2 - containerRect.height / 2
            arrowOffset = -20
            arrowDirection = 'left'
            if (containerLeft + containerRect.width > viewportWidth - 10) {
              containerLeft = viewportWidth - containerRect.width - 10
            }
          } else {
            containerLeft = 10
            containerTop = targetRect.bottom + scrollY + 10
            arrowDirection = 'down'
          }
          break


        case 6:
          if (window.innerWidth >= 768) {
            containerLeft = targetRect.right + 20
            containerTop = targetRect.top + scrollY + targetRect.height / 2 - containerRect.height / 2
            arrowOffset = -20
            arrowDirection = 'left'

            if (containerLeft + containerRect.width > viewportWidth - 10) {
              containerLeft = viewportWidth - containerRect.width - 10
            }
          } else {
            containerLeft = 10
            containerTop = targetRect.bottom + scrollY + 10
            arrowDirection = 'down'
          }
          break

        case 7:
          if (window.innerWidth >= 768) {
            containerLeft = targetRect.right + 20
            containerTop = targetRect.top + scrollY + targetRect.height / 2 - containerRect.height / 2
            arrowOffset = -20
            arrowDirection = 'left'

            const targetElement = document.querySelector('.subcategory')
            if (targetElement) {
              const subcategoryRect = targetElement.getBoundingClientRect()
              containerLeft = subcategoryRect.right + 20
              containerTop = subcategoryRect.top + scrollY + subcategoryRect.height / 2 - containerRect.height / 2
            }

            if (containerLeft + containerRect.width > viewportWidth - 10) {
              containerLeft = viewportWidth - containerRect.width - 10
            }
          } else {
            containerLeft = 10
            containerTop = targetRect.bottom + scrollY + 10
            arrowDirection = 'down'
          }
          break

        case 8:
          if (window.innerWidth >= 768) {
            containerLeft = targetRect.right + 20
            containerTop = targetRect.top + scrollY + targetRect.height / 2 - containerRect.height / 2
            arrowOffset = -20
            arrowDirection = 'left'
            if (containerLeft + containerRect.width > viewportWidth - 10) {
              containerLeft = viewportWidth - containerRect.width - 10
            }
          } else {
            containerLeft = 10
            containerTop = targetRect.bottom + scrollY + 10
            arrowDirection = 'down'
          }
          break

        case 9:
          if (window.innerWidth >= 768) {
            containerLeft = targetRect.left - containerRect.width - 20
            containerTop = targetRect.top + scrollY + targetRect.height / 2 - containerRect.height / 2
            arrowOffset = containerRect.width + 15
            arrowDirection = 'right'

            if (containerLeft < 10) {
              containerLeft = targetRect.right + 20
              arrowOffset = -20
            }

            if (targetRect.bottom > viewportHeight - 200) {
              containerTop = targetRect.top + scrollY - containerRect.height - 10
              arrowDirection = 'down'
              arrowOffset = targetRect.width / 2 - 15
            }
          } else {
            containerLeft = 10
            containerTop = targetRect.bottom + scrollY + 10
            arrowDirection = 'down'
          }
          break
        case 10:
        case 11:
        case 12:
          if (window.innerWidth >= 768) {
            containerLeft = targetRect.left + targetRect.width / 2 - containerRect.width / 2
            containerTop = targetRect.bottom + scrollY + 10
            arrowOffset = 0
            arrowDirection = pages[currentPage.value - 1].arrowDirection || 'down'

            if (containerTop + containerRect.height > viewportHeight - 10) {
              containerTop = targetRect.top + scrollY - containerRect.height - 10
              arrowDirection = 'up'
            }
          } else {
            containerLeft = 10
            containerTop = targetRect.bottom + scrollY + 10
            arrowDirection = 'down'
          }
          break

        case 13:
        case 14:
          if (window.innerWidth >= 768) {
            containerLeft = targetRect.left + targetRect.width / 2 - containerRect.width / 2
            containerTop = targetRect.bottom + scrollY + 15
            arrowOffset = 0
            arrowDirection = 'down'

            if (containerTop + containerRect.height > viewportHeight - 10) {
              containerTop = targetRect.top + scrollY - containerRect.height - 15
              arrowDirection = 'up'
            }

            containerLeft = Math.max(20, Math.min(containerLeft, viewportWidth - containerRect.width - 20))

            if (currentPage.value === 14) {
              guideContainer.value.style.width = '320px'
            }
          } else {
            containerLeft = 20
            containerTop = targetRect.bottom + scrollY + 15
            arrowDirection = 'down'
            guideContainer.value.style.maxWidth = 'calc(100% - 40px)'
          }

          guideContainer.value.classList.add('header-tooltip')
          break

        default:
          containerLeft = targetRect.left + targetRect.width / 2 - containerRect.width / 2
          containerTop = targetRect.bottom + scrollY + 10
          arrowOffset = 0
          arrowDirection = 'down'

      }

      // Общая корректировка
      containerLeft = Math.max(10, Math.min(containerLeft, viewportWidth - containerRect.width - 10))
      containerTop = Math.max(10, Math.min(containerTop, viewportHeight - containerRect.height - 10))

      positions.value = {
        top: containerTop,
        left: containerLeft,
        arrowOffset,
        arrowDirection
      }

      emit('update-page', currentPage.value)
    }


    const containerStyle = computed(() => ({
      top: `${positions.value.top}px`,
      left: `${positions.value.left}px`
    }))

    const arrowStyle = computed(() => {
      if (positions.value.arrowDirection === 'left') {
        return {
          left: '-15px',
          top: '50%',
          transform: 'translateY(-50%) rotate(90deg)'
        }
      }
      if (positions.value.arrowDirection === 'right') {
        return {
          right: '-15px',
          top: '50%',
          transform: 'translateY(-50%) rotate(-90deg)'
        }
      }
      if (positions.value.arrowDirection === 'up') {
        return {
          left: '50%',
          bottom: '-15px',
          transform: 'translateX(-50%) rotate(180deg)'
        }
      }
      return {
        left: `calc(50% + ${positions.value.arrowOffset}px)`,
        top: '-15px',
        transform: 'none'
      }
    })

    const nextPage = () => {
      if (currentPage.value < totalPages) {
        transitionName.value = 'slide-next'
        currentPage.value += 1
        calculatePosition()
      } else {
        closeGuide()
      }
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        transitionName.value = 'slide-prev'
        currentPage.value -= 1
        calculatePosition()
      }
    }

    const closeGuide = () => {
      emit('close')
    }

    onMounted(() => {
      calculatePosition()
      window.addEventListener('resize', calculatePosition)
      window.addEventListener('scroll', calculatePosition, true)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', calculatePosition)
      window.removeEventListener('scroll', calculatePosition, true)
    })

    return {
      currentPage,
      totalPages,
      currentTitle,
      currentInstructions,
      containerStyle,
      arrowStyle,
      transitionName,
      guideContainer,
      nextPage,
      prevPage,
      closeGuide
    }
  }
}
</script>

<style scoped>
.guide-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.guide-container {
  position: absolute;
  background: white;
  border-radius: 12px;
  padding: 20px;
  width: 300px;
  max-width: calc(100vw - 40px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1003;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.arrow-wrapper {
  position: absolute;
  width: 20px;
  height: 20px;
  z-index: 100002;
  pointer-events: none;
  transition: all 0.3s ease;
}

.guide-arrow {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 15px solid white;
  position: absolute;
}

.guide-content {
  position: relative;
  min-height: 120px;
}

/* Остальные стили без изменений */
.guide-page h4 {
  margin: 0 0 16px 0;
  color: #2c3e50;
  font-size: 18px;
}

.guide-instruction {
  font-size: 14px;
  color: #4a5568;
  line-height: 1.6;
}

.guide-instruction p {
  margin: 8px 0;
}

.guide-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.nav-button {
  background: #4a90e2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.nav-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.nav-button:hover:not(:disabled) {
  background: #357abd;
}

.page-indicator {
  font-size: 14px;
  color: #718096;
}

/* Анимации */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: all 0.3s ease;
}

.slide-next-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-next-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@media (max-width: 768px) {
  .guide-container {
    width: 90%;
    left: 50% !important;
    transform: translateX(-50%) !important;
  }

  .arrow-wrapper {
    display: none;
  }

  .guide-content {
    max-height: 60vh;
    overflow-y: auto;
  }
}
</style>