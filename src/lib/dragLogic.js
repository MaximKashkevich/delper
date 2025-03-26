import { ref } from 'vue'

export const useDrag = () => {
	const draggingImage = ref(null)

	const initialPosition = ref({ x: 0, y: 0 })

	const startDrag = (image, event) => {
		event.preventDefault()
		event.stopPropagation()

		draggingImage.value = image
		initialPosition.value = {
			cursorX: event.clientX,
			cursorY: event.clientY,
			imageX: image.x,
			imageY: image.y,
		}

		document.addEventListener('mousemove', handleMove)
		document.addEventListener('mouseup', endDrag)
	}

	const endDrag = () => {
		document.removeEventListener('mousemove', handleMove)
		document.removeEventListener('mouseup', endDrag)

		if (draggingImage.value) {
			const container = document.querySelector('.content')
			const containerRect = container.getBoundingClientRect()

			draggingImage.value.x = Math.max(
				0,
				Math.min(containerRect.width - 100, draggingImage.value.x)
			)
			draggingImage.value.y = Math.max(
				0,
				Math.min(containerRect.height - 100, draggingImage.value.y)
			)
		}

		draggingImage.value = null
	}

	const handleMove = event => {
		if (draggingImage.value) {
			const newX =
				event.clientX -
				initialPosition.value.cursorX +
				initialPosition.value.imageX
			const newY =
				event.clientY -
				initialPosition.value.cursorY +
				initialPosition.value.imageY

			const container = document.querySelector('.content')
			const containerRect = container.getBoundingClientRect()
			const clampedX = Math.max(0, Math.min(containerRect.width - 100, newX))
			const clampedY = Math.max(0, Math.min(containerRect.height - 100, newY))

			draggingImage.value.x = clampedX
			draggingImage.value.y = clampedY
		}
	}

	return {
		startDrag,
	}
}
