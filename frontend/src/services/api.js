import axios from "axios";

const API = axios.create({
  baseURL: "https://devpilot-ai-backend-6d8m.onrender.com",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;