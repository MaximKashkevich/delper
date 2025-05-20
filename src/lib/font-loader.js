const fontCache = new Map()

export default {
	async loadFont(font) {
		try {
			if (fontCache.has(font.name)) {
				return true
			}

			const fontFace = new FontFace(font.name, `url(${font.url})`)
			const loadedFont = await fontFace.load()

			document.fonts.add(loadedFont)
			fontCache.set(font.name, true)

			return true
		} catch (error) {
			console.error('Font loading error:', error)
			fontCache.delete(font.name)
			throw new Error(`Не удалось загрузить шрифт ${font.name}`)
		}
	},

	isFontLoaded(fontName) {
		return fontCache.has(fontName)
	},

	getLoadedFonts() {
		return Array.from(fontCache.keys())
	},
}
