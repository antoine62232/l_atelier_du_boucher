import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});
// Avant que la requête ne parte, on exécute ce code :
api.interceptors.request.use(
  (config) => {
    // On regarde si un token est stocké dans le navigateur
    const token = localStorage.getItem("authToken");

    // Si oui, on l'ajoute à l'en-tête "Authorization"
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;