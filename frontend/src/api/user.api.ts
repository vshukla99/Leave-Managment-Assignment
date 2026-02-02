import { api } from "./axios";
import type { User } from "../types/user.types";

/* ADMIN ONLY */
export const getAllUsers = async () => {
  const res = await api.get("/users");
  return res.data.data as User[];
};

/* BOTH ROLE SEE PROFILE DETAILS */
export const getUserById = async (id: number) => {
  const res = await api.get(`/users/${id}`);
  return res.data.data as User;
};

/* ADMIN ONLY */
export const updateUserByAdmin = async (
  id: number,
  data: { fullName?: string; mobile?: string; role?: "USER" | "ADMIN" }
) => {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
};

/* ADMIN ONLY */
export const deleteUser = async (id: number) => {
  const res = await api.delete(`/users/${id}`);
  return res.data as { message: string };
};

/* USER + ADMIN */
export const updateMyProfile = async (data: {
  fullName?: string;
  mobile?: string;
}) => {
  const res = await api.put("/users/me", data);
  return res.data as {
    message: string;
    data: User;
  };
};
