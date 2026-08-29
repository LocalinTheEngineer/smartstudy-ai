import axios from "axios";
import { requestStarted, requestFinished } from "./wakeUpStore";

// Backend ile konuşan tek merkezi Axios örneği.
// .env dosyasında VITE_API_URL tanımlarsak onu kullanır, yoksa local backend'e bakar.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Her istekte, kullanıcı giriş yapmışsa token'ı otomatik ekler.
api.interceptors.request.use((config) => {
  requestStarted();
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Istek bitince (basarili ya da hatali) "sunucu uyaniyor" durumunu kapatiyoruz.
api.interceptors.response.use(
  (response) => {
    requestFinished();
    return response;
  },
  (error) => {
    requestFinished();
    return Promise.reject(error);
  }
);

export default api;
