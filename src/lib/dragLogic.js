export const useDrag = () => {
	let draggingImage = null
	let initialPosition = { x: 0, y: 0 }

	const startDrag = (image, event) => {
		if (!image.isLocked) {
			event.preventDefault()
			draggingImage = image
			initialPosition = {
				cursorX: event.clientX,
				cursorY: event.clientY,
				imageX: image.x,
				imageY: image.y,
			}

			const handleMove = e => {
				if (draggingImage) {
					draggingImage.x =
						initialPosition.imageX + (e.clientX - initialPosition.cursorX)

					draggingImage.y =
						initialPosition.imageY + (e.clientY - initialPosition.cursorY)
				}
			}
			const endDrag = () => {
				document.removeEventListener('mousemove', handleMove)
				document.removeEventListener('mouseup', endDrag)
				draggingImage = null
			}

			document.addEventListener('mousemove', handleMove)
			document.addEventListener('mouseup', endDrag)
		}
	}

	return { startDrag }
}
