import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000', // Cambia esto a la URL de tu backend
    withCredentials: true, // Habilita el envío de cookies
});

const loginUser = async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data;
}

const registerUser = async (firstName, lastName, email, password) => {
    const response = await api.post('/users/register', { firstName, lastName, email, password });
    localStorage.setItem("user", JSON.stringify(response.data.user));
    return response.data;
}

const getUser = async () => {
    const response = await api.get('/users/me');
    return response.data;
}

const logoutUser = async () => {
    const response = await api.post('/users/logout');
    return response.data;
}



export { loginUser, registerUser, getUser, logoutUser };