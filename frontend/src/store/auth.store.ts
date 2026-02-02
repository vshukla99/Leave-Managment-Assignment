import { type AuthUser } from "../types/auth.types";

export const getAuth = (): AuthUser | null => {
  const data = localStorage.getItem("auth");
  return data ? JSON.parse(data) : null;
};

export const setAuth = (user: AuthUser) => {
  localStorage.setItem("auth", JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem("auth");
};
