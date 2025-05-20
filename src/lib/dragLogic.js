export const useDrag = () => {
	let draggingItem = null
	let initialPosition = { x: 0, y: 0 }
	let containerRect = null

	const startDrag = (images, item, event, container) => {
		if (!event || !container) return

		event.preventDefault()

		if (!item.locked && !item.isBackground) {
			containerRect = container.getBoundingClientRect()

			draggingItem = item
			initialPosition = {
				cursorX: event.clientX,
				cursorY: event.clientY,
				itemX: item.x,
				itemY: item.y,
			}

			const handleMove = e => {
				if (!draggingItem) return

				let newX = initialPosition.itemX + (e.clientX - initialPosition.cursorX)
				let newY = initialPosition.itemY + (e.clientY - initialPosition.cursorY)

				// Для текстовых элементов учитываем границы контейнера
				if (draggingItem.type === 'text') {
					newX = Math.max(
						0,
						Math.min(newX, containerRect.width - draggingItem.width)
					)
					newY = Math.max(
						0,
						Math.min(newY, containerRect.height - draggingItem.height)
					)
				}

				draggingItem.x = newX
				draggingItem.y = newY
			}

			const endDrag = () => {
				document.removeEventListener('mousemove', handleMove)
				document.removeEventListener('mouseup', endDrag)
				draggingItem = null
			}

			document.addEventListener('mousemove', handleMove)
			document.addEventListener('mouseup', endDrag)
		}
	}
	return { startDrag }
}
