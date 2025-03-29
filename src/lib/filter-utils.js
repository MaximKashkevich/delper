export function updateRangeFill(event) {
	const input = event.target
	const value = Number(input.value)

	if (value < 0) {
		const fillPercent = 50 + value / 2
		input.style.setProperty('--left-fill', `${fillPercent}%`)
		input.style.setProperty('--right-fill', `50%`)
	}

	if (value > 0) {
		const fillPercent = 50 + value / 2
		input.style.setProperty('--right-fill', `${fillPercent}%`)
		input.style.setProperty('--left-fill', `50%`)
	}
}
