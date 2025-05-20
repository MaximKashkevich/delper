export const addImageToContent = (
	images,
	idCounter,
	element,
	isBackground = false
) => {
	// Если добавляем фон, сначала удаляем существующий фон
	const filteredImages = isBackground
		? images.filter(img => !img.isBackground)
		: [...images]

	const newImage = {
		id: idCounter,
		src: element.image,
		x: isBackground ? 0 : 100,
		y: isBackground ? 0 : 100,
		width: isBackground ? 100 : 200,
		height: isBackground ? 100 : 200,
		rotate: 0,
		flip: false,
		opacity: 1,
		locked: isBackground, // Фон блокируется по умолчанию
		zIndex: isBackground ? -1 : idCounter,
		isBackground,
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
		droppedImages: [...filteredImages, newImage],
		newIdCounter: idCounter + 1,
		newImage,
	}
}
export const deleteImageById = (images, id) => {
	return images.filter(img => img.id !== id)
}

export const rotateImage = (images, id) => {
	return images.map(img => {
		if (img.id === id) {
			return {
				...img,
				rotate: (img.rotate + 90) % 360,
			}
		}
		return img
	})
}

export const copyImage = (images, id, idCounter) => {
	const imageToCopy = images.find(img => img.id === id)
	if (!imageToCopy)
		return { droppedImages: images, idCounter, copiedImage: null }

	const newImage = {
		...imageToCopy,
		id: idCounter,
		x: imageToCopy.x + 20,
		y: imageToCopy.y + 20,
		zIndex: idCounter,
		filters: { ...imageToCopy.filters },
	}

	return {
		droppedImages: [...images, newImage],
		idCounter: idCounter + 1,
		copiedImage: newImage,
	}
}

export const mirrorImage = (images, id) => {
	return images.map(img => {
		if (img.id === id) {
			return {
				...img,
				flip: !img.flip,
			}
		}
		return img
	})
}

export const changeOpacity = (images, event, id) => {
	const opacityValue = Number(event.target.value)
	const opacity = opacityValue / 100
	return images.map(img => {
		if (img.id === id) {
			return {
				...img,
				opacity,
			}
		}
		return img
	})
}

export const toggleImageLock = (images, id) => {
	return images.map(img => {
		if (img.id === id) {
			return {
				...img,
				locked: !img.locked,
			}
		}
		return img
	})
}
