import axios from "axios";

const BACKEND_URL = "";
export const API = "/api";
const TOKEN_KEY = "adan_admin_token";

export const adminApi = axios.create({ baseURL: API });

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      if (window.location.pathname.startsWith("/admin") && !window.location.pathname.includes("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export function formatApiError(err) {
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => e?.msg || JSON.stringify(e)).join(" ");
  if (detail?.msg) return detail.msg;
  return err?.message || "حدث خطأ غير متوقع";
}
