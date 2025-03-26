import axios from "./axios";

// Логин пользователя
export const login = async (credentials) => {
    const response = await axios.post("/api/login", credentials);
    return response.data;
};

// Регистрация пользователя
export const register = async (userData) => {
    const response = await axios.post("/api/register", userData);
    return response.data;
};

export const forgotPassword = async (userData) => {
    const response = await axios.post("/api/forgot-password", userData);
    return response.data;
};
export const passwordRecovery = async (userData) => {
    const response = await axios.post("/api/password-recovery", userData);
    return response.data;
};

// Получение данных текущего пользователя
export const fetchCurrentUser = async () => {
    const response = await axios.get("/api/me");
    return response.data;
};

// Выход из системы
export const logout = async () => {
    const response = await axios.post("/api/logout");
    return response.data;
};
