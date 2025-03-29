export function changeZIndex(droppedImages, action, imageId) {
	const updatedImages = [...droppedImages]
	const image = updatedImages.find(img => img.id === imageId)
	if (!image) return updatedImages

	const allZIndex = updatedImages.map(img => img.zIndex)
	const maxZ = Math.max(...allZIndex)
	const minZ = Math.min(...allZIndex)

	switch (action) {
		case 'up':
			image.zIndex += 1
			break
		case 'down':
			image.zIndex = Math.max(minZ, image.zIndex - 1)
			break
		case 'top':
			image.zIndex = maxZ + 1
			break
		case 'bottom':
			image.zIndex = minZ - 1
			break
	}

	return updatedImages.sort((a, b) => a.zIndex - b.zIndex)
}
