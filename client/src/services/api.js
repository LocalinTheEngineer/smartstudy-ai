import axios from "axios";

// Backend ile konuşan tek merkezi Axios örneği.
// .env dosyasında VITE_API_URL tanımlarsak onu kullanır, yoksa local backend'e bakar.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Her istekte, kullanıcı giriş yapmışsa token'ı otomatik ekler.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
