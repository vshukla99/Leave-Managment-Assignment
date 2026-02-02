import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma";
import { deductLeaveFIFO, restoreLeaveFIFO } from "./leave.service";
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

  await prisma.leaveCredit.create({
    data: {
      userId,
      hoursGranted,
      hoursRemaining: hoursGranted,
      expiresAt: new Date(expiresAt),
    },
  });

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
  if (!req.user) throw new AppError("Unauthorized", 401);

  const { fromDate, toDate, hoursRequested, reason } = req.body;

  await prisma.$transaction(
    async (tx) => {
      // FIFO deduction
      await deductLeaveFIFO(
        tx,
        req.user!.id,
        hoursRequested
      );

      // Create leave request
      await tx.leaveRequest.create({
        data: {
          userId: req.user!.id,
          fromDate: new Date(fromDate),
          toDate: new Date(toDate),
          hoursRequested,
          reason,
        },
      });
    },
    { isolationLevel: "Serializable" }
  );

  res.json({ message: "Leave requested successfully" });
}

/**
 * ================================
 * USER: Get my leave requests
 * ================================
 */
export async function getMyLeaves(
  req: Request,
  res: Response
) {
  if (!req.user) throw new AppError("Unauthorized", 401);

  const leaves = await prisma.leaveRequest.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });

  res.json(leaves);
}

/**
 * ================================
 * ADMIN: Get all leave requests
 * ================================
 */
export async function getAllLeaves(
  req: Request,
  res: Response
) {
  const leaves = await prisma.leaveRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          fullName: true,
          email: true,
          mobile: true,
        },
      },
    },
  });

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

  await prisma.$transaction(async (tx) => {
    const leave = await tx.leaveRequest.findUnique({
      where: { id: leaveId },
    });

    if (!leave) throw new AppError("Leave not found", 404);

    if (leave.status === status) {
      throw new AppError("Invalid state transition", 409);
    }

    // Rejected → restore FIFO
    if (status === "REJECTED") {
      await restoreLeaveFIFO(
        tx,
        leave.userId,
        leave.hoursRequested
      );
    }

    // Approved after rejection → deduct again
    if (
      status === "APPROVED" &&
      leave.status === "REJECTED"
    ) {
      await deductLeaveFIFO(
        tx,
        leave.userId,
        leave.hoursRequested
      );
    }

    await tx.leaveRequest.update({
      where: { id: leaveId },
      data: { status },
    });
  });

  res.json({ message: "Leave status updated successfully" });
}

/**
 * ================================
 * USER: Get leave balance
 * ================================
 */
export async function getMyLeaveBalance(
  req: Request,
  res: Response
) {
  if (!req.user) throw new AppError("Unauthorized", 401);

  const credits = await prisma.leaveCredit.findMany({
    where: {
      userId: req.user.id,
      expiresAt: { gt: new Date() },
    },
  });

  const totalGranted = credits.reduce(
    (sum, c) => sum + c.hoursGranted,
    0
  );

  const totalRemaining = credits.reduce(
    (sum, c) => sum + c.hoursRemaining,
    0
  );

  const totalUsed = totalGranted - totalRemaining;

  res.json({
    totalGranted,
    totalUsed,
    totalRemaining,
  });
}
