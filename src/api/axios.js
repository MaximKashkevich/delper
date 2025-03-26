import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
