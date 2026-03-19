import axios from "axios";

export const API_URL = "http://link2clip.eaproma.com/api";

const api = axios.create({
  baseURL: API_URL,
});

//Se activara al usar mas funciones de api

// api.interceptors.request.use(async (config) => {
//     // Verificar si tenemos un token en el secure storage
//     const token = await SecureStorageAdapter.getItem('token');

//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
// });

export { api };

