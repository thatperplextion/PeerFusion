// client/src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  try {
    const token = (typeof window !== "undefined") ? localStorage.getItem("token") : null;
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) { /* ignore */ }
  return config;
});

// Global response handling (401 => clear token, suppress 404 for unmigrated endpoints)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const url = err?.config?.url || '';
    
    // Clear token on 401
    if (status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    }
    
    // Suppress console errors for 404 on unmigrated endpoints
    if (status === 404 && (
      url.includes('/notifications') || 
      url.includes('/messages') ||
      url.includes('/connections') ||
      url.includes('/projects')
    )) {
      // Silently fail for unmigrated endpoints
      return Promise.reject({ ...err, silent: true });
    }
    
    return Promise.reject(err);
  }
);

export default api;
