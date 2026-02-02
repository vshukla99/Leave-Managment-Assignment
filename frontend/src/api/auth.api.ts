import { api } from "./axios";
import { type AuthUser,type LoginResponse } from "../types/auth.types";

/**
 * LOGIN
 */
export const login = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  const res = await api.post<LoginResponse>("/auth/login", { email, password });

  const { token, user } = res.data;

  return {
    id: user.id,
    fullName: user.fullName,  // required field
    email: user.email,
    role: user.role,
    token,                    //  token 
  };
};

/**
 * REGISTER
 */
export const register = async (data: {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
}) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

/**
 * LOGOUT
 */
export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};
