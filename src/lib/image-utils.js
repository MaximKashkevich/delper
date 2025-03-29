export function addImageToContent(droppedImages, idCounter, element) {
	const newImage = {
		id: idCounter,
		src: element.image,
		x: 100,
		y: 100,
		width: 200,
		height: 200,
		zIndex:
			droppedImages.reduce((max, img) => Math.max(max, img.zIndex || 0), 0) + 1,
		rotate: 0,
		opacity: 1,
		isLocked: false,
		flip: false,
		filters: {
			exposure: 0,
			contrast: 0,
			saturation: 0,
			temperature: 0,
			hue: 0,
			highlights: 0,
			shadows: 0,
		},
	}
	return {
		droppedImages: [...droppedImages, newImage],
		newIdCounter: idCounter + 1,
		newImage,
	}
}

export function deleteImageById(droppedImages, id) {
	return droppedImages.filter(image => image.id !== id)
}

export function rotateImage(droppedImages, id) {
	const updatedImages = [...droppedImages]
	const image = updatedImages.find(image => image.id === id)
	if (image) image.rotate += 90
	return updatedImages
}

export function copyImage(droppedImages, id, idCounter) {
	const imageToCopy = droppedImages.find(img => img.id === id)
	if (!imageToCopy) return { droppedImages, idCounter }

	const copiedImage = {
		...imageToCopy,
		id: idCounter,
		x: imageToCopy.x + 20, // Смещаем копию немного в сторону
		y: imageToCopy.y + 20,
		zIndex:
			droppedImages.reduce((max, img) => Math.max(max, img.zIndex || 0), 0) + 1,
	}

	return {
		droppedImages: [...droppedImages, copiedImage],
		idCounter: idCounter + 1,
		copiedImage, // Добавляем это поле
	}
}

export function mirrorImage(droppedImages, id) {
	const updatedImages = [...droppedImages]
	const image = updatedImages.find(image => image.id === id)
	if (image) image.flip = !image.flip
	return updatedImages
}

export function toggleImageLock(droppedImages, id) {
	const updatedImages = [...droppedImages]
	const image = updatedImages.find(image => image.id === id)
	if (image) image.isLocked = !image.isLocked
	return updatedImages
}

export function changeOpacity(droppedImages, event, id) {
	const updatedImages = [...droppedImages]
	const image = updatedImages.find(el => el.id === id)
	if (image) image.opacity = parseFloat(event.target.value) / 100
	return updatedImages
}
