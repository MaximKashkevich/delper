import { ref } from 'vue'

export const useResize = () => {
	const resizingImage = ref(null)
	const resizeDirection = ref(null)
	const startResizePosition = ref({ x: 0, y: 0 })
	const startImageSize = ref({ width: 0, height: 0 })
	const startImagePosition = ref({ x: 0, y: 0 })
	const MIN_SIZE = 120

	const startResize = (droppedImages, image, event, direction) => {
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

		const handleResize = e => {
			if (!resizingImage.value || !resizeDirection.value) return

			const deltaX = e.clientX - startResizePosition.value.x
			const deltaY = e.clientY - startResizePosition.value.y

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
					// eslint-disable-next-line no-case-declarations
					const newHeight = startImageSize.value.height - deltaY
					if (newHeight >= MIN_SIZE) {
						newImage.height = newHeight
						newImage.y = startImagePosition.value.y + deltaY
					}
					break
				case 'top-right':
					newImage.width = Math.max(
						MIN_SIZE,
						startImageSize.value.width + deltaX
					)
					// eslint-disable-next-line no-case-declarations
					const newHeightTR = startImageSize.value.height - deltaY
					if (newHeightTR >= MIN_SIZE) {
						newImage.height = newHeightTR
						newImage.y = startImagePosition.value.y + deltaY
					}
					break
				case 'top-left':
					newImage.width = Math.max(
						MIN_SIZE,
						startImageSize.value.width - deltaX
					)
					newImage.x = startImagePosition.value.x + deltaX
					// eslint-disable-next-line no-case-declarations
					const newHeightTL = startImageSize.value.height - deltaY
					if (newHeightTL >= MIN_SIZE) {
						newImage.height = newHeightTL
						newImage.y = startImagePosition.value.y + deltaY
					}
					break
				case 'bottom-left':
					newImage.width = Math.max(
						MIN_SIZE,
						startImageSize.value.width - deltaX
					)
					newImage.x = startImagePosition.value.x + deltaX
					newImage.height = Math.max(
						MIN_SIZE,
						startImageSize.value.height + deltaY
					)
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
			}

			const index = droppedImages.findIndex(img => img.id === newImage.id)
			if (index !== -1) {
				droppedImages[index] = newImage
			}
		}

		const endResize = () => {
			document.removeEventListener('mousemove', handleResize)
			document.removeEventListener('mouseup', endResize)
			resizingImage.value = null
			resizeDirection.value = null
		}

		document.addEventListener('mousemove', handleResize)
		document.addEventListener('mouseup', endResize)
	}

	return { startResize }
}
