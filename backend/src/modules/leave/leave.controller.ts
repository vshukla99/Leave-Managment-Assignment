import { Request, Response, NextFunction } from "express";
import {
  creditLeaveService,
  requestLeaveService,
  getMyLeavesService,
  getAllLeavesService,
  updateLeaveStatusService,
  getMyLeaveBalanceService,
} from "./leave.service";
import { AppError } from "../../utils/app-error";

/**
 * ================================
 * ADMIN: Credit leave
 * ================================
 */
export async function postLeave(
  req: Request,
  res: Response
) {
  const { userId, hoursGranted, expiresAt } = req.body;

  await creditLeaveService(
    userId,
    hoursGranted,
    expiresAt
  );

  res.status(201).json({
    message: "Leave credited successfully",
  });
}

/**
 * ================================
 * USER: Request leave (PTO)
 * ================================
 */
export async function requestLeave(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  await requestLeaveService(
    req.user.id,
    req.body
  );

  res.json({ message: "Leave requested successfully" });
}

/**
 * ================================
 * USER: Get my leaves
 * ================================
 */
export async function getMyLeaves(
  req: Request,
  res: Response
) {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const leaves = await getMyLeavesService(
    req.user.id
  );

  res.json(leaves);
}

/**
 * ================================
 * ADMIN: Get all leaves
 * ================================
 */
export async function getAllLeaves(
  req: Request,
  res: Response
) {
  const leaves = await getAllLeavesService();
  res.json(leaves);
}

/**
 * ================================
 * ADMIN: Update leave status
 * ================================
 */
export async function updateLeaveStatus(
  req: Request,
  res: Response
) {
  const leaveId = Number(req.params.leaveId);
  const { status } = req.body;

  await updateLeaveStatusService(leaveId, status);

  res.json({
    message: "Leave status updated successfully",
  });
}

/**
 * ================================
 * USER: Leave balance
 * ================================
 */
export async function getMyLeaveBalance(
  req: Request,
  res: Response
) {
  if (!req.user) {
    throw new AppError("Unauthorized", 401);
  }

  const balance =
    await getMyLeaveBalanceService(
      req.user.id
    );

  res.json(balance);
}
