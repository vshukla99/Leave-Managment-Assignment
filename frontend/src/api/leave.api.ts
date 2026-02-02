import { api } from "./axios";
import type { Leave,LeaveBalance } from "../types/leave.types";

/* USER */
export const requestLeave = async (data: {
  fromDate: string;
  toDate: string;
  hoursRequested: number;
  reason?: string;
}) => {
  const res = await api.post("/leave/request", data);
  return res.data as { message: string };
};

/* USER */
export const getMyLeaves = async () => {
  const res = await api.get("/leave/my");
  return res.data as Leave[];
};

/* ADMIN */
export const addLeaveCredit = async (data: {
  userId: number;
  hoursGranted: number;
  expiresAt: string;
}) => {
  const res = await api.post("/leave/credit", data);
  return res.data as { message: string };
};

/* ADMIN */
export const getAllLeaves = async () => {
  const res = await api.get("/leave/all");
  return res.data as Leave[];
};

export const getLeaveBalance = async () => {
  const res = await api.get("/leave/balance");
  return res.data as LeaveBalance;
};

/* ADMIN */
export const updateLeaveStatus = async (
  leaveId: number,
  status: "APPROVED" | "REJECTED"
) => {
  const res = await api.patch(`/leave/${leaveId}/status`, { status });
  return res.data as { message: string };
};