import axios from "axios";
import { getAuth } from "../store/auth.store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const auth = getAuth();

  // debug logs, remove in production
  console.log("AUTH OBJECT ", auth);

  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }

  console.log("HEADERS ", config.headers);

  return config;
});
