import axios from "axios";

// 1. On crée l'instance Axios avec l'URL de base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

// 2. L'INTERCEPTEUR : Avant chaque requête, on ajoute le token d'authentification si présent
api.interceptors.request.use(
  (config) => {
    // Avant que la requête parte, on cherche le token
    const token = localStorage.getItem("authToken");
    
    // Si on a un token, on l'ajoute dans le header "Authorization"
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