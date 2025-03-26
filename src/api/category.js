import axios from "./axios";

export const getCategories = async (credentials) => {
    const response = await axios.post("/api/category/list", credentials);
    return response.data;
};