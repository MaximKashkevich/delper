import { ref } from 'vue'

export const useResize = droppedImages => {
	const resizingImage = ref(null)

	const resizeDirection = ref(null)

	const startResizePosition = ref({ x: 0, y: 0 })

	const startImageSize = ref({ width: 0, height: 0 })

	const startImagePosition = ref({ x: 0, y: 0 })

	const MIN_SIZE = 50

	const startResize = (image, event, direction) => {
		event.preventDefault()
		event.stopPropagation()

		resizingImage.value = image
		resizeDirection.value = direction
		startResizePosition.value = {
			x: event.clientX,
			y: event.clientY,
		}
		startImageSize.value = {
			width: image.width,
			height: image.height,
		}
		startImagePosition.value = {
			x: image.x,
			y: image.y,
		}

		setResizeCursor(direction)

		document.addEventListener('mousemove', handleResize)
		document.addEventListener('mouseup', endResize)
	}

	const endResize = () => {
		document.removeEventListener('mousemove', handleResize)
		document.removeEventListener('mouseup', endResize)

		resizingImage.value = null
		resizeDirection.value = null
	}

	const handleResize = event => {
		if (resizingImage.value && resizeDirection.value) {
			const deltaX = event.clientX - startResizePosition.value.x
			const deltaY = event.clientY - startResizePosition.value.y

			const newImage = { ...resizingImage.value }

			switch (resizeDirection.value) {
				case 'right':
					newImage.width = Math.max(
						MIN_SIZE,
						startImageSize.value.width + deltaX
					)
					break
				case 'left':
					newImage.width = Math.max(
						MIN_SIZE,
						startImageSize.value.width - deltaX
					)
					newImage.x = startImagePosition.value.x + deltaX
					break
				case 'bottom':
					newImage.height = Math.max(
						MIN_SIZE,
						startImageSize.value.height + deltaY
					)
					break
				case 'top':
					newImage.height = Math.max(
						MIN_SIZE,
						startImageSize.value.height - deltaY
					)
					newImage.y = startImagePosition.value.y + deltaY
					break
				case 'bottom-right':
					newImage.width = Math.max(
						MIN_SIZE,
						startImageSize.value.width + deltaX
					)
					newImage.height = Math.max(
						MIN_SIZE,
						startImageSize.value.height + deltaY
					)
					break
				case 'bottom-left':
					newImage.width = Math.max(
						MIN_SIZE,
						startImageSize.value.width - deltaX
					)
					newImage.height = Math.max(
						MIN_SIZE,
						startImageSize.value.height + deltaY
					)
					newImage.x = startImagePosition.value.x + deltaX
					break
				case 'top-right':
					newImage.width = Math.max(
						MIN_SIZE,
						startImageSize.value.width + deltaX
					)
					newImage.height = Math.max(
						MIN_SIZE,
						startImageSize.value.height - deltaY
					)
					newImage.y = startImagePosition.value.y + deltaY
					break
				case 'top-left':
					newImage.width = Math.max(
						MIN_SIZE,
						startImageSize.value.width - deltaX
					)
					newImage.height = Math.max(
						MIN_SIZE,
						startImageSize.value.height - deltaY
					)
					newImage.x = startImagePosition.value.x + deltaX
					newImage.y = startImagePosition.value.y + deltaY
					break
			}

			updateDroppedImages(newImage)
		}
	}
	// Обновление массива droppedImages
	const updateDroppedImages = newImage => {
		const index = droppedImages.value.indexOf(resizingImage.value)
		if (index !== -1) {
			droppedImages.value.splice(index, 1, newImage)
		}
	}

	const setResizeCursor = direction => {
		const cursorClass = {
			right: 'ew-resize',
			left: 'ew-resize',
			bottom: 'ns-resize',
			top: 'ns-resize',
			'bottom-right': 'nwse-resize',
			'bottom-left': 'nesw-resize',
			'top-right': 'nesw-resize',
			'top-left': 'nwse-resize',
		}[direction]

		if (cursorClass) {
			document.body.style.cursor = cursorClass
		}
	}

	return {
		startResize,
	}
}
