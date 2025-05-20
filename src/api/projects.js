import axios from './axios'

export const saveProject = async project => {
	try {
		const response = await axios.post(`api/save`, project, {
			headers: {
				'Content-Type': 'application/json',
			},
		})
		return response.data
	} catch (error) {
		console.error('API Error:', error)
		throw error
	}
}

export const fetchProjects = async () => {
	try {
		const response = await axios.get('api/save')
		return response.data
	} catch (error) {
		console.error('API Error:', error)
		throw error
	}
}
